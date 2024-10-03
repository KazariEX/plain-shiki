<script lang="ts" setup>
    import { createHighlighter } from "shiki";
    import { onMounted, ref } from "vue";
    import { createPlainShiki } from "../src";
    import example from "./assets/example.ts?raw";

    const el = ref<HTMLElement>();

    onMounted(async () => {
        const shiki = await createHighlighter({
            langs: ["html", "css", "js", "ts"],
            themes: ["vitesse-light", "vitesse-dark"]
        });

        createPlainShiki(shiki).mount(el.value!, {
            lang: "ts",
            themes: {
                light: "vitesse-light",
                dark: "vitesse-dark"
            }
        });
    });
</script>

<template>
    <div ref="el" class="plain-shiki" contenteditable v-html="example"></div>
</template>

<style>
    .plain-shiki {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        outline: none;
        font-family: monospace;
        font-size: 16px;
        line-height: 1.5;
        white-space: break-spaces;
        resize: none;
    }
</style>