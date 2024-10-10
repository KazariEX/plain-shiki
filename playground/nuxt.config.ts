import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "icon", href: "https://shiki.style/logo.svg" }
            ],
            title: "Plain Shiki Playground"
        }
    },
    alias: {
        "plain-shiki": fileURLToPath(new URL("../src/index.ts", import.meta.url))
    },
    css: [
        "~/assets/style.css"
    ],
    compatibilityDate: "2024-07-19",
    future: {
        compatibilityVersion: 4
    },
    ssr: false,
    modules: [
        "@nuxt/icon",
        "@nuxtjs/color-mode",
        "@unocss/nuxt",
        "@vueuse/nuxt",
        "radix-vue/nuxt"
    ],
    colorMode: {
        classSuffix: ""
    },
    icon: {
        componentName: "iconify"
    }
});