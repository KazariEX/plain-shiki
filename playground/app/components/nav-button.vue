<script lang="ts" setup>
    const {
        as = "a"
    } = defineProps<{
        as?: string;
        icon: string;
    }>();

    const attrs = computed(() => (as === "a" ? {
        rel: "noopener noreferrer",
        target: "_blank"
    } : {}));
</script>

<template>
    <component
        :is="as"
        v-bind="attrs"
        grid="~ place-items-center"
        size="9"
        b="1 solid gray op-40 rounded-md"
        bg="transparent"
        un-text="5"
        transition="250"
        cursor="pointer"
    >
        <iconify :name="icon"/>
    </component>
</template>

<style scoped>
    .is-checked {
        --uno: outline-primary outline outline-2 outline-offset--1;
    }
</style>