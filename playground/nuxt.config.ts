export default defineNuxtConfig({
    app: {
        head: {
            link: [
                { rel: "icon", href: "https://shiki.style/logo.svg" }
            ]
        }
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
        "@vueuse/nuxt"
    ],
    colorMode: {
        classSuffix: ""
    },
    icon: {
        componentName: "iconify"
    }
});