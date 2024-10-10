<script lang="ts" setup>
    defineProps<{
        items: string[];
    }>();
    const modelValue = defineModel<string>();
</script>

<template>
    <select-root v-model="modelValue">
        <select-trigger
            flex="inline items-center gap-1.5"
            w="45"
            h="8"
            outline="none"
            bg="inherit"
            font="mono"
            text="sm nowrap truncate"
            cursor="pointer"
        >
            <select-icon flex="~" text="3 gray">
                <iconify name="fa6-solid:chevron-down"/>
            </select-icon>
            <select-value />
        </select-trigger>
        <select-portal>
            <select-content
                class="select-content"
                p="y-2"
                b="~ solid gray op-40 rounded-md"
                backdrop="blur-6"
                font="mono"
                position="popper"
            >
                <select-scroll-up-button flex="~ justify-center" text="3 gray">
                    <iconify name="fa6-solid:chevron-up"/>
                </select-scroll-up-button>
                <select-viewport>
                    <select-item
                        v-for="item, i in items"
                        :key="i"
                        class="select-item"
                        p="x-3.5"
                        leading="6"
                        text="sm"
                        :value="item"
                    >
                        <select-item-text>{{ item }}</select-item-text>
                    </select-item>
                </select-viewport>
                <select-scroll-down-button flex="~ justify-center" text="3 gray">
                    <iconify name="fa6-solid:chevron-down"/>
                </select-scroll-down-button>
            </select-content>
        </select-portal>
    </select-root>
</template>

<style>
    .select-content {
        min-width: var(--radix-select-trigger-width);
        max-height: var(--radix-select-content-available-height);
    }

    .select-item[data-highlighted] {
        --uno: outline-none bg-gray bg-op-30 text-primary;
    }
</style>