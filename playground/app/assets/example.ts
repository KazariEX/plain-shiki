import { createPlainShiki } from "plain-shiki";
import { createHighlighter } from "shiki";

const shiki = await createHighlighter({
    langs: ["html", "css", "js", "ts"],
    themes: ["vitesse-light", "vitesse-dark"]
});

const el = document.querySelector(".plain-shiki") as HTMLElement;

createPlainShiki(shiki).mount(el, {
    lang: "ts",
    themes: {
        light: "vitesse-light",
        dark: "vitesse-dark"
    }
});