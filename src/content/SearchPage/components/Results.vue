<template>
    <div>
        <div v-for="(entry, index) of entries" :key="index" style="margin-bottom: 10px">
            <Collection
                v-if="entry.type === 'COLLECTION'"
                :collection="entry.value"
                @select="(entry) => $emit('select', entry)"
            />
            <DisplayEntry v-else :entry="entry" @select="(entry) => $emit('select', entry)" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CollectionSearchEntry, SearchEntry } from '@dogonis/vtube-client';

import DisplayEntry from "./SearchEntry.vue";
import Collection from "./Collection.vue";

export default defineComponent({
    components: { DisplayEntry, Collection },
    props: {
        entries: {
            type: Array as PropType<SearchEntry[]>,
            required: true,
        },
    },
    emits: {
        select: (data: Exclude<SearchEntry, CollectionSearchEntry>) => !!data,
    },
});
</script>
