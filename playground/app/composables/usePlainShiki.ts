import { type BundledLanguage, createHighlighter } from "shiki";
import { createPlainShiki, type CreatePlainShikiReturns, type MountPlainShikiOptions } from "../../../src";

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
            themes: Object.values(options.themes ?? {}).filter((theme) => theme !== void 0)
        });

        plain = createPlainShiki(shiki);
        trigger();
    });

    tryOnUnmounted(() => {
        ctx?.dispose();
    });
}