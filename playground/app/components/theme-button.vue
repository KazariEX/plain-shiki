<script lang="ts" setup>
    const { mode } = defineProps<{
        mode: string;
        icon: string;
    }>();

    const colorMode = useColorMode();

    function setColorMode() {
        tryStartViewTransition(() => {
            colorMode.preference = mode;
        });
    }
</script>

<template>
    <plain-button
        :icon
        :class="{
            [`outline-(~ 2 primary offset--1)`]: colorMode.preference === mode
        }"
        @click="setColorMode"
    />
</template>