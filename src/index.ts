import { type BundledLanguage, type BundledTheme, type ThemedTokenWithVariants, createHighlighter } from "shiki";
import { debounce } from "./utils";

export interface CreatePlainShikiOptions {
    /**
     * @description Language of the code to be highlighted.
     *
     * @requires
     */
    lang: BundledLanguage;

    /**
     * @description All languages to be imported.
     *
     * @default ["html","css","js"]
     */
    langs?: BundledLanguage[];

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

    /**
     * @description Shiki highlighter instance.
     */
    instance?: Awaited<ReturnType<typeof createHighlighter>>;
}

interface ColorLoads {
    token: ThemedTokenWithVariants;
    range: Range;
}

export function createPlainShiki(el: HTMLElement, options: CreatePlainShikiOptions) {
    const {
        lang,
        themes = {
            light: "min-light",
            dark: "min-dark"
        },
        selector = (theme) => `.${theme}`,
        watch = true,
        delay = 0,
        instance = createInstance()
    } = options;

    const isSupported = () => "CSS" in globalThis && "highlights" in CSS;

    const debouncedUpdate = debounce(update, { delay });
    const dispose = () => el.removeEventListener("input", debouncedUpdate);

    if (isSupported() && watch) {
        el.addEventListener("input", debouncedUpdate);
    }

    let getTokenLines: (text: string) => ThemedTokenWithVariants[][];
    let stylesheet: CSSStyleSheet;

    Promise.resolve(instance).then((shiki) => {
        getTokenLines = (text) => shiki.codeToTokensWithThemes(text, {
            lang,
            themes: themes
        } as any);

        stylesheet = new CSSStyleSheet();
        document.adoptedStyleSheets.push(stylesheet);

        isSupported() && update();
    });

    const colorRanges = new Map<string, Range[]>();

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
        const tokenLines = getTokenLines(textContent);

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
        get isSupported() {
            return isSupported();
        },
        dispose,
        update
    };

    async function createInstance() {
        const key = "__shiki_instance__";
        let instance = Reflect.get(globalThis, key);

        if (!instance) {
            Reflect.set(
                globalThis,
                key,
                instance = await createHighlighter({
                    langs: ["html", "css", "js", lang],
                    themes: Object.values(themes)
                })
            );
        }
        return instance;
    }
}