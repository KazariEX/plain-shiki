import { defineConfig, presetAttributify, presetUno, transformerDirectives } from "unocss";

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify()
    ],
    theme: {
        colors: {
            primary: "hsl(154deg 32% 46%)"
        }
    },
    transformers: [
        transformerDirectives()
    ]
});