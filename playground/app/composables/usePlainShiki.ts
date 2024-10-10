import { createPlainShiki, type CreatePlainShikiReturns, type MountPlainShikiOptions } from "plain-shiki";
import { type BundledLanguage, createHighlighter, createJavaScriptRegexEngine } from "shiki";

export type UsePlainShikiOptions = Omit<MountPlainShikiOptions, "lang"> & {
    lang: MaybeRefOrGetter<BundledLanguage>;
};

export default function(el: MaybeRefOrGetter<HTMLElement | null>, options: UsePlainShikiOptions) {
    const target = toRef(el);
    const lang = toRef(options.lang);

    let plain: CreatePlainShikiReturns;
    let ctx: ReturnType<(typeof plain)["mount"]>;

    const { trigger } = watchTriggerable([target, lang], () => {
        ctx?.dispose();
        if (target.value) {
            ctx = plain?.mount(target.value, {
                ...options,
                lang: lang.value
            });
        }
    });

    tryOnMounted(async () => {
        const shiki = await createHighlighter({
            langs: ["html", "css", "js", "ts"],
            themes: Object.values(options.themes ?? {}).filter((theme) => theme !== void 0),
            engine: createJavaScriptRegexEngine()
        });

        plain = createPlainShiki(shiki);
        trigger();
    });

    tryOnUnmounted(() => {
        ctx?.dispose();
    });
}