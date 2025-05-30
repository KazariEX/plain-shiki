import { resolve } from "node:path";

export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "icon", href: "https://shiki.style/logo.svg" },
            ],
            title: "Plain Shiki Playground",
        },
    },
    alias: {
        "plain-shiki": resolve(import.meta.dirname, "../src/index.ts"),
    },
    css: [
        "~/assets/style.css",
    ],
    compatibilityDate: "2024-07-19",
    future: {
        compatibilityVersion: 4,
    },
    ssr: false,
    modules: [
        "@nuxt/icon",
        "@nuxtjs/color-mode",
        "@primevue/nuxt-module",
        "@unocss/nuxt",
        "@vueuse/nuxt",
    ],
    colorMode: {
        classSuffix: "",
    },
    icon: {
        componentName: "iconify",
    },
    primevue: {
        components: {
            prefix: "Prime",
            // https://github.com/primefaces/primevue/issues/7434
            exclude: ["Chart", "Editor", "Form", "FormField"],
        },
        importTheme: {
            from: "~/themes/index.ts",
        },
        options: {
            ripple: true,
        },
    },
});
