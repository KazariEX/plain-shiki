import type { BundledLanguage, BundledTheme, ThemedTokenWithVariants, createHighlighter } from "shiki";
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
    themes?: Record<string, BundledTheme>;

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

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>;

interface ColorLoads {
    token: ThemedTokenWithVariants;
    range: Range;
}

export function createPlainShiki(shiki: Highlighter) {
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

        const colorRanges = new Map<string, Range[]>();

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
            const deleted = new Set<string>();

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

                    let ranges = colorRanges.get(name);
                    if (!ranges) {
                        const rule = `${
                            isDefault ? ":root" : selector(theme)
                        }::highlight(${name}) { color: ${color}; }`;
                        stylesheet.insertRule(rule);
                        colorRanges.set(name, ranges = []);
                    }

                    if (!deleted.has(name)) {
                        deleted.add(name);
                        for (const range of ranges) {
                            highlight.delete(range);
                        }
                        ranges.length = 0;
                    }

                    highlight.add(range);
                    ranges.push(range);
                }
            }
        }

        function update() {
            const childNodes = el.childNodes;
            const textContent = [...childNodes].map((node) => node.textContent).join("");
            const tokenLines = shiki.codeToTokensWithThemes(textContent, {
                lang,
                themes
            });

            const loads: ColorLoads[] = [];
            for (const tokens of tokenLines) {
                for (const token of tokens) {
                    const [node, offset] = findNodeAndOffset(token.offset);
                    const range = document.createRange();
                    range.setStart(node, offset);
                    range.setEnd(node, offset + token.content.length);

                    loads.push({ token, range });
                }
            }
            patch(loads);

            // @ts-expect-error 函数缺少结束 return 语句，返回类型不包括 "undefined"。
            function findNodeAndOffset(tokenOffset: number): [Node, number] {
                let offset = 0;
                for (const node of childNodes) {
                    if (!node.textContent) {
                        continue;
                    }
                    if (offset + node.textContent.length > tokenOffset) {
                        return [node, tokenOffset - offset];
                    }
                    else {
                        offset += node.textContent.length;
                    }
                }
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