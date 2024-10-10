<script lang="ts" setup>
    const props = defineProps<{
        items: string[];
    }>();
    const modelValue = defineModel<string>();
</script>

<template>
    <select-root v-model="modelValue">
        <select-trigger
            flex="inline justify-between items-center gap-1"
            h="8"
            min-w="40"
            bg="inherit"
            font="mono"
            text="sm"
        >
            <select-value />
            <select-icon />
        </select-trigger>
        <select-portal>
            <select-content font="mono" bg="inherit">
                <select-scroll-up-button />
                <select-viewport>
                    <select-item v-for="item, i in items" :key="i" :value="item">
                        <select-item-text>{{ item }}</select-item-text>
                    </select-item>
                </select-viewport>
                <select-scroll-down-button />
            </select-content>
        </select-portal>
    </select-root>
</template>