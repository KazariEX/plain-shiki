import { createPlainShiki, type CreatePlainShikiReturns, type MountPlainShikiOptions } from "plain-shiki";
import {
    type BundledLanguage,
    bundledLanguages,
    type BundledTheme,
    bundledThemes,
    createHighlighterCore,
    createJavaScriptRegexEngine,
    type HighlighterCore
} from "shiki";

export type UsePlainShikiOptions = Omit<MountPlainShikiOptions, "lang" | "themes"> & {
    lang: MaybeRefOrGetter<BundledLanguage>;
    themes: MaybeRefOrGetter<Record<string, BundledTheme>>;
};

let shiki: HighlighterCore;

export default function(el: MaybeRefOrGetter<HTMLElement | null>, options: UsePlainShikiOptions) {
    const target = computed(() => toValue(el));
    const lang = toRef(options.lang);
    const themes = toRef(options.themes);

    let plain: CreatePlainShikiReturns;
    let ctx: ReturnType<(typeof plain)["mount"]>;

    const { trigger } = watchTriggerable([target, lang, themes], async () => {
        ctx?.dispose();

        if (target.value) {
            await shiki?.loadLanguage(bundledLanguages[lang.value]);
            for (const theme of Object.values(themes.value)) {
                await shiki?.loadTheme(bundledThemes[theme]);
            }

            ctx = plain?.mount(target.value, {
                ...options,
                lang: lang.value,
                themes: themes.value
            });
        }
    });

    tryOnMounted(async () => {
        shiki ??= await createHighlighterCore({
            engine: createJavaScriptRegexEngine()
        });

        plain = createPlainShiki(shiki);
        trigger();
    });

    tryOnUnmounted(() => {
        ctx?.dispose();
    });
}