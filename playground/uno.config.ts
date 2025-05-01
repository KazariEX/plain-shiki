import { defineConfig, presetAttributify, presetWind3, transformerVariantGroup } from "unocss";

export default defineConfig({
    presets: [
        presetAttributify(),
        presetWind3()
    ],
    theme: {
        colors: {
            primary: "hsl(154deg 32% 46%)"
        }
    },
    transformers: [
        transformerVariantGroup()
    ]
});