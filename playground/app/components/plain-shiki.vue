<script lang="ts" setup>
    import type { BundledLanguage, BundledTheme } from "shiki";
    import example from "~/assets/example.ts?raw";

    const { lang, themes } = defineProps<{
        lang: BundledLanguage;
        themes: Record<string, BundledTheme>;
    }>();

    const editorEl = useTemplateRef("editor");
    usePlainShiki(editorEl, {
        lang: () => lang,
        themes: () => themes
    });
</script>

<template>
    <div
        ref="editor"
        class="plain-shiki"
        overflow="x-auto"
        p="x-4 y-3"
        outline="none"
        font="mono"
        whitespace="break-spaces"
        leading="6"
        text="nowrap"
        contenteditable
        v-html="example"
    ></div>
</template>