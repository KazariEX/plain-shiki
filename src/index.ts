import type { BundledLanguage, BundledTheme, CodeOptionsMultipleThemes, CodeToHastOptionsCommon, HighlighterCore, ThemedToken } from "shiki";
import { diff } from "./diff";
import { isArrayEqual, once, throttle } from "./utils";
import type { ColorInfo, LoadLine } from "./types";

export interface MountPlainShikiOptions {
    /**
     * Language of the code to be highlighted.
     */
    lang: CodeToHastOptionsCommon<BundledLanguage>["lang"];

    /**
     * Themes of the code to be highlighted.
     * @default {light:"min-light",dark:"min-dark"}
     */
    themes?: CodeOptionsMultipleThemes<BundledTheme>["themes"];

    /**
     * Name of default theme.
     * @default "light"
     */
    defaultTheme?: string | false;

    /**
     * Root element selector corresponding to the theme.
     * @default `.${theme}`
     */
    selector?: (theme: string) => string;

    /**
     * Root element selector with default theme.
     * @default ":root"
     */
    defaultSelector?: string;

    /**
     * Whether to listen for element update events and automatic rendering.
     * @default true
     */
    watch?: boolean;

    /**
     * Throttle delay in updating when `watch: true`.
     * @default 33.4
     */
    delay?: number;
}

export interface MountPlainShikiReturns {
    dispose: () => boolean;
    update: () => void;
}

export interface PlainShiki {
    mount: (el: HTMLElement, options: MountPlainShikiOptions) => MountPlainShikiReturns;
}

export function createPlainShiki(shiki: HighlighterCore): PlainShiki {
    return {
        mount,
    };

    function mount(el: HTMLElement, options: MountPlainShikiOptions): MountPlainShikiReturns {
        const {
            lang,
            themes = {
                light: "min-light",
                dark: "min-dark",
            },
            defaultTheme = "light",
            selector = (theme) => `.${theme}`,
            defaultSelector = ":root",
            watch = true,
            delay = 33.4,
        } = options;

        const stylesheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(stylesheet);

        const colorRanges = new Map<string, Set<Range>>();
        const loadLines: LoadLine[] = [];

        function erase(info: ColorInfo[]) {
            for (const { range, name } of info) {
                const highlight = CSS.highlights.get(name);
                highlight?.delete(range);

                const ranges = colorRanges.get(name);
                ranges?.delete(range);
            }
        }

        function render(info: ColorInfo[]) {
            for (const { range, color, theme, name } of info) {
                const isDefault = theme === defaultTheme;

                let highlight = CSS.highlights.get(name);
                if (!highlight) {
                    CSS.highlights.set(name, highlight = new Highlight());
                    highlight.priority = isDefault ? 0 : 1;
                }

                let ranges = colorRanges.get(name);
                if (!ranges) {
                    colorRanges.set(name, ranges = new Set());
                    const rule = `${
                        isDefault ? defaultSelector : selector(theme)
                    }::highlight(${name}) { color: ${color}; }`;
                    stylesheet.insertRule(rule);
                }

                highlight.add(range);
                ranges.add(range);
            }
        }

        const update = throttle(() => {
            const { innerText } = el;
            const textLines = innerText.split("\n");
            const textNodes = collectTextNodes(el);

            // Get text change range
            const [start, end] = diff(textLines, loadLines);

            // Delete old color info
            const length = end - textLines.length + loadLines.length;
            const chunk = loadLines.splice(length);
            for (let i = start; i < length; i++) {
                erase(loadLines[i].info);
            }

            // Fill new load lines
            const lastGrammarState = loadLines.at(-1)?.lastGrammarState;
            loadLines.length = end - 1;
            loadLines.fill(null!, start, end - 1);
            loadLines.push(createLoadLine({ lastGrammarState }), ...chunk);

            let offset = textLines.slice(0, start).reduce((res, text) => res + text.length + 1, 0);
            const findNodeAndOffset = createFindNodeAndOffset(innerText, textNodes, offset);

            // Render text line by line
            for (let i = start; i < textLines.length; i++) {
                const text = textLines[i];
                const load = loadLines[i];

                const tokenized = shiki.codeToTokens(text, {
                    lang,
                    themes,
                    cssVariablePrefix: "",
                    defaultColor: false,
                    grammarState: loadLines[i - 1]?.lastGrammarState,
                });

                const ranges: Range[] = [];
                const info: ColorInfo[] = [];

                for (const token of tokenized.tokens[0]) {
                    if (!token.content.trim().length) {
                        continue;
                    }

                    const [startNode, startOffset] = findNodeAndOffset(offset + token.offset);
                    const [endNode, endOffset] = findNodeAndOffset(offset + token.offset + token.content.length);

                    const range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                    ranges.push(range);

                    info.push(...createColorInfo(token, range));
                }

                if (load) {
                    erase(load.info);
                }
                render(info);

                const oldScopes = load?.lastGrammarState?.getScopes();
                const newScopes = tokenized.grammarState?.getScopes();
                const skip = oldScopes && newScopes && isArrayEqual(oldScopes, newScopes);

                loadLines[i] = {
                    text,
                    offset,
                    lastGrammarState: tokenized.grammarState,
                    ranges,
                    info,
                };

                if (!skip) {
                    offset += text.length + 1;
                }
                else break;
            }
        }, delay);

        watch && el.addEventListener("input", update);
        update();

        const dispose = once(() => {
            watch && el.removeEventListener("input", update);

            const idx = document.adoptedStyleSheets.indexOf(stylesheet);
            document.adoptedStyleSheets.splice(idx, 1);

            for (const [name, ranges] of colorRanges) {
                const highlight = CSS.highlights.get(name);
                for (const range of ranges) {
                    highlight?.delete(range);
                }
            }
        });

        return {
            dispose,
            update,
        };
    }
}

function collectTextNodes(el: HTMLElement) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];

    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node as Text);
    }
    return textNodes;
}

function createLoadLine(options: Partial<LoadLine> = {}) {
    return {
        text: "",
        offset: 0,
        lastGrammarState: void 0,
        ranges: [],
        info: [],
        ...options,
    } as LoadLine;
}

function* createColorInfo(token: ThemedToken, range: Range) {
    if (typeof token.htmlStyle !== "object") {
        return;
    }

    for (const theme in token.htmlStyle) {
        const color = token.htmlStyle[theme];
        const name = `shiki-${theme}-${color.slice(1).toLowerCase()}`;

        yield { range, color, theme, name };
    }
}

function createFindNodeAndOffset(innerText: string, textNodes: Text[], initialOffset: number) {
    let i = 0;
    let offset = 0;
    let isCorrect = false;

    if (initialOffset > 0) {
        find(initialOffset);
    }
    return find;

    function find(tokenOffset: number) {
        for (; i < textNodes.length; i++) {
            const node = textNodes[i];
            const { textContent } = node;
            if (!textContent) {
                continue;
            }

            if (!isCorrect) {
                offset = innerText.indexOf(textContent, offset);
                isCorrect = true;
            }

            if (offset + textContent.length < tokenOffset) {
                offset += textContent.length;
                isCorrect = false;
            }
            else break;
        }
        return [textNodes[i], tokenOffset - offset] as const;
    }
}
