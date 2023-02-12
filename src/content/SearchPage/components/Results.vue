<template>
    <div>
        <div v-for="(entry, index) of entries" :key="index" style="margin-bottom: 10px">
            <Collection v-if="entry.type === 'COLLECTION'" :collection="entry.value" />
            <DisplayEntry v-else :entry="entry" />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType } from 'vue';

import { SearchEntry } from '@/Responses';
import DisplayEntry from "./SearchEntry.vue";
import Collection from "./Collection.vue";

export default {
    components: { DisplayEntry, Collection },
    props: {
        entries: {
            type: Array as PropType<SearchEntry[]>,
            required: true,
        },
    },
};
</script>
