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
            :options
            editable
            size="small"
            v-model="modelValue"
        />
        <label>{{ label }}</label>
    </prime-float-label>
</template>