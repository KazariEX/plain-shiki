import type { BundledLanguage, BundledTheme, CodeToTokensWithThemesOptions, HighlighterCore } from "shiki";
import { diff } from "./diff";
import { debounce, isArrayEqual } from "./utils";
import type { ColorLoad, LoadLine } from "./types";

export interface MountPlainShikiOptions {
    /**
     * @description Language of the code to be highlighted.
     *
     * @requires
     */
    lang: BundledLanguage;

    /**
     * @description Theme of the code to be highlighted.
     *
     * @default {light:"min-light",dark:"min-dark"}
     */
    themes?: CodeToTokensWithThemesOptions<BundledLanguage, BundledTheme>["themes"];

    /**
     * @description Root element selector corresponding to the theme.
     *
     * @default `.${theme}`
     */
    selector?: (theme: string) => string;

    /**
     * @description Whether to listen for element update events and automatic rendering.
     *
     * @default true
     */
    watch?: boolean;

    /**
     * @description Delay in updating when `watch: true`.
     *
     * @default 0
     */
    delay?: number;
}

export type CreatePlainShikiReturns = ReturnType<typeof createPlainShiki>;

export function createPlainShiki(shiki: HighlighterCore) {
    const isSupported = () => "CSS" in globalThis && "highlights" in CSS;

    function mount(el: HTMLElement, options: MountPlainShikiOptions) {
        const {
            lang,
            themes = {
                light: "min-light",
                dark: "min-dark"
            },
            selector = (theme) => `.${theme}`,
            watch = true,
            delay = 0
        } = options;

        const debouncedUpdate = delay > 0 ? debounce(update, { delay }) : update;

        const stylesheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(stylesheet);

        const colorRanges = new Map<string, Set<Range>>();
        const loadLines: LoadLine[] = [];

        if (isSupported()) {
            watch && el.addEventListener("input", debouncedUpdate);
            update();
        }

        function dispose() {
            watch && el.removeEventListener("input", debouncedUpdate);

            const idx = document.adoptedStyleSheets.indexOf(stylesheet);
            document.adoptedStyleSheets.splice(idx, 1);

            for (const [name, ranges] of colorRanges) {
                const highlight = CSS.highlights.get(name);
                for (const range of ranges) {
                    highlight?.delete(range);
                }
            }
        }

        function patch(loads: ColorLoad[], oldLoads: ColorLoad[]) {
            for (const { range, name } of walkTokens(oldLoads)) {
                const highlight = CSS.highlights.get(name);
                highlight?.delete(range);

                const ranges = colorRanges.get(name);
                ranges?.delete(range);
            }

            for (const { range, color, theme, name } of walkTokens(loads)) {
                const isDefault = theme === "light";

                let highlight = CSS.highlights.get(name);
                if (!highlight) {
                    CSS.highlights.set(name, highlight = new Highlight());
                    highlight.priority = isDefault ? 0 : 1;
                }

                let ranges = colorRanges.get(name);
                if (!ranges) {
                    colorRanges.set(name, ranges = new Set());
                    const rule = `${
                        isDefault ? ":root" : selector(theme)
                    }::highlight(${name}) { color: ${color}; }`;
                    stylesheet.insertRule(rule);
                }

                highlight.add(range);
                ranges.add(range);
            }
        }

        function update() {
            const { innerText } = el;
            const textLines = innerText.split("\n");
            const textNodes = collectTextNodes(el);

            const [start, end] = diff(textLines, loadLines);
            const length = end - textLines.length + loadLines.length;
            const chunk = loadLines.splice(length);
            for (let i = start; i < length; i++) {
                patch([], loadLines[i]?.loads ?? []);
            }
            loadLines.length = end;
            loadLines.fill(null!, start, end);
            loadLines.push(...chunk);

            let offset = textLines.slice(0, start).reduce((res, text) => res + text.length + 1, 0);
            const findNodeAndOffset = createFindNodeAndOffset(innerText, textNodes, offset);

            for (let i = start; i < textLines.length; i++) {
                const text = textLines[i];

                const tokenResult = shiki.codeToTokens(text, {
                    lang,
                    themes,
                    cssVariablePrefix: "",
                    defaultColor: false,
                    grammarState: loadLines[i - 1]?.lastGrammarState
                });

                const loads: ColorLoad[] = [];
                for (const token of tokenResult.tokens[0]) {
                    const [startNode, startOffset] = findNodeAndOffset(offset + token.offset);
                    const [endNode, endOffset] = findNodeAndOffset(offset + token.offset + token.content.length);

                    const range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                    loads.push({ token, range });
                }

                const loadLine = loadLines[i] ??= {} as LoadLine;

                patch(loads, loadLine.loads ?? []);
                loadLine.loads = loads;
                loadLine.text = text;

                const oldScopes = loadLine.lastGrammarState?.getScopes() ?? [Number.NaN];
                const newScopes = tokenResult.grammarState?.getScopes() ?? [Number.NaN];

                const skip = isArrayEqual(oldScopes, newScopes);
                loadLine.lastGrammarState = tokenResult.grammarState;

                if (!skip) {
                    offset += text.length + 1;
                }
                else break;
            }
        }

        return {
            dispose,
            update
        };
    }

    return {
        get isSupported() {
            return isSupported();
        },
        mount
    };
}

function* walkTokens(loads: ColorLoad[]) {
    for (const { token, range } of loads) {
        if (typeof token.htmlStyle !== "object") {
            continue;
        }

        for (const theme in token.htmlStyle) {
            const color = token.htmlStyle[theme];
            const name = `shiki-${theme}-${color.slice(1).toLowerCase()}`;

            yield { range, color, theme, name };
        }
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