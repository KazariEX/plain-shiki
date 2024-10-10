<script lang="ts" setup>
    const props = defineProps<{
        mode: string;
        icon: string;
    }>();

    const colorMode = useColorMode();

    function setColorMode() {
        tryStartViewTransition(() => {
            colorMode.preference = props.mode;
        });
    }
</script>

<template>
    <nav-button
        :icon
        :class="{
            [`is-checked`]: colorMode.preference === mode
        }"
        @click="setColorMode"
    />
</template>

<style scoped>
    .is-checked {
        --uno: outline-primary outline outline-2 outline-offset--1;
    }
</style>