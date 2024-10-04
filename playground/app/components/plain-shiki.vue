<script lang="ts" setup>
    import example from "~/assets/example.ts?raw";

    const editorEl = useTemplateRef("editor");
    usePlainShiki(editorEl, {
        lang: "ts",
        themes: {
            light: "catppuccin-latte",
            dark: "one-dark-pro"
        }
    });
</script>

<template>
    <div
        ref="editor"
        class="plain-shiki"
        p="x-3 y-2"
        b="1 solid gray op-40 rounded-md"
        outline="none"
        whitespace="break-spaces"
        lh="6"
        text="4"
        contenteditable
        v-html="example"
    ></div>
</template>

<style>
    .plain-shiki {
        font-family: consolas, var(--font);
    }
</style>