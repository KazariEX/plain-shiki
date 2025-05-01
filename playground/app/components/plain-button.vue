<script lang="ts" setup>
    const { as = "button" } = defineProps<{
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
        b="1 solid slate/40 rounded-md"
        bg="transparent"
        hover:bg="slate/20"
        un-text="4.5"
        cursor="pointer"
    >
        <iconify :name="icon"/>
    </component>
</template>