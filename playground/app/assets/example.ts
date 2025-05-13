import { createPlainShiki } from "plain-shiki";
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine-javascript.mjs";
import grammarTs from "shiki/langs/typescript.mjs";
import vitesseDark from "shiki/themes/vitesse-dark.mjs";
import vitesseLight from "shiki/themes/vitesse-light.mjs";

const shiki = await createHighlighterCore({
    langs: [grammarTs],
    themes: [vitesseLight, vitesseDark],
    engine: createJavaScriptRegexEngine(),
});

const el = document.querySelector(".plain-shiki") as HTMLElement;

createPlainShiki(shiki).mount(el, {
    lang: "ts",
    themes: {
        light: "vitesse-light",
        dark: "vitesse-dark",
    },
});
