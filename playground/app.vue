<script lang="ts" setup>
    import { onMounted, ref } from "vue";
    import { createPlainShiki } from "../src";

    const el = ref<HTMLElement>();

    onMounted(() => {
        createPlainShiki(el.value!, {
            lang: "ts",
            themes: {
                light: "vitesse-light",
                dark: "vitesse-dark"
            }
        });
    });

    const initialCode = /* TS */
`import { createPlainShiki } from "plain-shiki";

const el = document.querySelector(".plain-shiki") as HTMLElement;

createPlainShiki(el, {
    lang: "ts",
    themes: {
        light: "vitesse-light",
        dark: "vitesse-dark"
    }
});`;
</script>

<template>
    <div ref="el" class="plain-shiki" contenteditable="plaintext-only" v-html="initialCode"></div>
</template>

<style>
    .plain-shiki {
        padding: 0.5rem 0.75rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-family: monospace;
        font-size: 16px;
        line-height: 1.5;
        outline: none;
        resize: none;
    }
</style>