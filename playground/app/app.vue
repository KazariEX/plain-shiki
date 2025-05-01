<script lang="ts" setup>
    import { type BundledLanguage, bundledLanguages, type BundledTheme, bundledThemes } from "shiki";
    import pkg from "../../package.json";

    const repository = new URL(pkg.repository, "https://github.com").href;
    const version = "v" + pkg.version;

    const langNames = Object.keys(bundledLanguages).sort((a, b) => a.localeCompare(b));
    const themeNames = Object.keys(bundledThemes).sort((a, b) => a.localeCompare(b));

    const lang = ref<BundledLanguage>("typescript");
    const lightTheme = ref<BundledTheme>("catppuccin-latte");
    const darkTheme = ref<BundledTheme>("one-dark-pro");

    const themes = computed(() => ({
        light: lightTheme.value,
        dark: darkTheme.value
    }));
</script>

<template>
    <header
        flex="~ items-center justify-between gap-3 lt-sm:col"
        max-w="screen-lg"
        m="x-auto y-4"
        p="x-4"
    >
        <hgroup flex="~ gap-2 items-center">
            <h1 font="bold" text="5">Plain Shiki Playground</h1>
            <span
                p="x-1 y-.5"
                b="rounded-1"
                bg="primary op-20"
                font="mono"
                text="3 primary"
            >{{ version }}</span>
        </hgroup>
        <nav flex="~ gap-2">
            <plain-button as="a" icon="ph:github-logo" title="GitHub" :href="repository"/>
            <theme-button mode="light" icon="solar:sun-2-outline"/>
            <theme-button mode="system" icon="solar:monitor-outline"/>
            <theme-button mode="dark" icon="solar:moon-outline"/>
        </nav>
    </header>
    <main
        max-w="screen-lg"
        m="x-auto"
        p="x-4"
    >
        <div grid="~ cols-3 gap-4 lt-sm:cols-2">
            <plain-select grid="col-start-1 lt-sm:col-end-3" label="language" :options="langNames" v-model="lang"/>
            <plain-select label="light theme" :options="themeNames" v-model="lightTheme"/>
            <plain-select label="dark theme" :options="themeNames" v-model="darkTheme"/>
        </div>
        <plain-shiki :lang :themes/>
    </main>
</template>