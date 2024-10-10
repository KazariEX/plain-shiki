<script lang="ts" setup>
    import { repository, version } from "../../package.json";

    const repoUrl = "https://github.com/" + repository;
</script>

<template>
    <header flex="~ items-center justify-between" m="x-auto y-3" p="x-3" max-w="screen-lg">
        <hgroup flex="~ gap-2 items-center">
            <h1>Plain Shiki Playground</h1>
            <span
                p="x-1 y-.5"
                b="rounded-1"
                bg="primary op-20"
                text="3 primary"
            >v{{ version }}</span>
        </hgroup>
        <nav flex="~ gap-2">
            <nav-button icon="ph:github-logo" as="a" :href="repoUrl"/>
            <theme-button mode="light" icon="solar:sun-2-outline"/>
            <theme-button mode="system" icon="solar:monitor-outline"/>
            <theme-button mode="dark" icon="solar:moon-outline"/>
        </nav>
    </header>
    <main m="x-auto" max-w="screen-lg">
        <div m="3" b="1 solid gray op-40 rounded-md">
            <div
                flex="~ gap-2 items-center"
                p="x-3 y-2"
                b-b="~ solid gray op-40"
            >
                <plain-select :items="['javascript', 'typescript', 'html', 'css', 'json']"/>
            </div>
            <plain-shiki />
        </div>
    </main>
</template>