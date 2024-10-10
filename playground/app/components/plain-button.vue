<script lang="ts" setup>
    const { as = "a" } = defineProps<{
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
        hover:bg="gray op-20"
        un-text="4.5"
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