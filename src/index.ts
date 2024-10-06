import type { BundledLanguage, BundledTheme, CodeToTokensWithThemesOptions, GrammarState, HighlighterCore, ThemedTokenWithVariants } from "shiki";
import { debounce } from "./utils";

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

interface ColorLoad {
    token: ThemedTokenWithVariants;
    range: Range;
}

interface LoadLine {
    text: string;
    lastGrammarState: GrammarState;
    loads: ColorLoad[];
}

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

        const loadLines: LoadLine[] = [];
        const names = new Set<string>();

        if (isSupported()) {
            watch && el.addEventListener("input", debouncedUpdate);
            update();
        }

        function dispose() {
            watch && el.removeEventListener("input", debouncedUpdate);

            const idx = document.adoptedStyleSheets.indexOf(stylesheet);
            document.adoptedStyleSheets.splice(idx, 1);

            for (const name of names) {
                CSS.highlights.delete(name);
            }
        }

        function resolveName(theme: string, color: string) {
            return `shiki-${theme}-${color.slice(1).toLowerCase()}`;
        }

        function patch(loads: ColorLoad[], oldLoads: ColorLoad[]) {
            for (const { token, range } of oldLoads) {
                for (const theme in token.variants) {
                    const { color } = token.variants[theme];
                    const name = resolveName(theme, color!);

                    const highlight = CSS.highlights.get(name);
                    if (!highlight) {
                        continue;
                    }
                    highlight.delete(range);
                }
            }

            for (const { token, range } of loads) {
                for (const theme in token.variants) {
                    const { color } = token.variants[theme];
                    const name = resolveName(theme, color!);
                    const isDefault = theme === "light";

                    let highlight = CSS.highlights.get(name);
                    if (!highlight) {
                        CSS.highlights.set(name, highlight = new Highlight());
                        highlight.priority = isDefault ? 0 : 1;
                    }

                    if (!names.has(name)) {
                        const rule = `${
                            isDefault ? ":root" : selector(theme)
                        }::highlight(${name}) { color: ${color}; }`;
                        stylesheet.insertRule(rule);
                        names.add(name);
                    }

                    highlight.add(range);
                }
            }
        }

        function diff(textLines: string[]) {
            let i = 0;
            for (; i < textLines.length; i++) {
                if (textLines[i] !== loadLines[i]?.text) {
                    return i;
                }
                for (const { range } of loadLines[i]?.loads ?? []) {
                    if (range.collapsed) {
                        return i;
                    }
                }
            }
            return i;
        }

        function update() {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

            const textNodes: Node[] = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            const { innerText } = el;
            const textLines = innerText.split("\n");

            let i = diff(textLines);
            let lineOffset = textLines.slice(0, i).reduce((res, text) => res + text.length + 1, 0);

            let j = 0;
            let offset = 0;
            let isCorrect = false;
            findNodeAndOffset(lineOffset);

            for (; i < textLines.length; i++) {
                const text = textLines[i];

                const tokenLines = shiki.codeToTokensWithThemes(text, {
                    lang,
                    themes
                });

                const loads: ColorLoad[] = [];
                for (const token of tokenLines[0]) {
                    const [startNode, startOffset] = findNodeAndOffset(lineOffset + token.offset);
                    const [endNode, endOffset] = findNodeAndOffset(lineOffset + token.offset + token.content.length);

                    const range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);
                    loads.push({ token, range });
                }

                const loadLine = loadLines[i] ??= {} as LoadLine;
                loadLine.text = text;

                patch(loads, loadLine.loads ?? []);
                loadLine.loads = loads;

                const lastGrammarState = shiki.getLastGrammarState(text ?? "", { lang });
                if (loadLine.lastGrammarState !== lastGrammarState) {
                    loadLine.lastGrammarState = lastGrammarState;
                    lineOffset += text.length + 1;
                }
                else break;
            }

            function findNodeAndOffset(tokenOffset: number) {
                for (; j < textNodes.length; j++) {
                    const node = textNodes[j];
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
                return [textNodes[j], tokenOffset - offset] as const;
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