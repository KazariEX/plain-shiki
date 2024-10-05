import type { BundledLanguage, BundledTheme, CodeToTokensWithThemesOptions, HighlighterCore, ThemedTokenWithVariants } from "shiki";
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

interface ColorLoads {
    token: ThemedTokenWithVariants;
    range: Range;
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

        const debouncedUpdate = debounce(update, { delay });

        const stylesheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(stylesheet);

        const names = new Set<string>();

        if (isSupported()) {
            watch && el.addEventListener("input", debouncedUpdate);
            update();
        }

        function dispose() {
            watch && el.removeEventListener("input", debouncedUpdate);

            const idx = document.adoptedStyleSheets.indexOf(stylesheet);
            document.adoptedStyleSheets.splice(idx, 1);
        }

        function patch(loads: ColorLoads[]) {
            for (const name of names) {
                const highlight = CSS.highlights.get(name);
                highlight?.clear();
            }

            for (const { token, range } of loads) {
                for (const theme in token.variants) {
                    const { color } = token.variants[theme];
                    const name = `shiki-${theme}-${color!.slice(1).toLowerCase()}`;
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

        function update() {
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);

            const textNodes: Node[] = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            const { innerText } = el;
            const tokenLines = shiki.codeToTokensWithThemes(innerText, {
                lang,
                themes
            });

            let i = 0;
            let offset = 0;
            let isCorrect = false;

            const loads: ColorLoads[] = [];
            for (const tokens of tokenLines) {
                for (const token of tokens) {
                    const [startNode, startOffset] = findNodeAndOffset(token.offset);
                    const [endNode, endOffset] = findNodeAndOffset(token.offset + token.content.length);

                    const range = document.createRange();
                    range.setStart(startNode, startOffset);
                    range.setEnd(endNode, endOffset);

                    loads.push({ token, range });
                }
            }
            patch(loads);

            function findNodeAndOffset(tokenOffset: number) {
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

                    if (offset + textContent.length >= tokenOffset) {
                        return [node, tokenOffset - offset] as const;
                    }
                    else {
                        offset += textContent.length;
                        isCorrect = false;
                    }
                }
                throw new RangeError(`[Plain Shiki] cannot find node at offset ${tokenOffset}.`);
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