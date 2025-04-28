<script lang="ts" setup>
    defineProps<{
        options: string[];
        label: string;
    }>();

    const modelValue = defineModel<string>();
</script>

<template>
    <prime-float-label variant="on">
        <prime-select
            w="full"
            editable
            size="small"
            :options
            :virtual-scroller-options="{ itemSize: 28 }"
            v-model="modelValue"
        />
        <label>{{ label }}</label>
    </prime-float-label>
</template>