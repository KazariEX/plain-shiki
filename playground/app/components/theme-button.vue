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
    <button
        grid="~ place-items-center"
        size="10"
        b="1 solid gray op-40 rounded-md"
        bg="transparent"
        text="5"
        transition="250"
        cursor="pointer"
        :class="{
            [`is-checked`]: colorMode.preference === mode
        }"
        @click="setColorMode"
    >
        <iconify :name="icon"/>
    </button>
</template>

<style scoped>
    .is-checked {
        outline: 2px solid rgb(79 155 122);
        outline-offset: -1px;
    }
</style>