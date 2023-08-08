<template>
  <div class="collection__root">
    <div class="collection__title">
        {{ collection.title }}
    </div>
    <SearchEntry 
        v-for="(item, index) of collection.items"
        :key="index"
        :entry="item"
        @select="(entry) => {$emit('select', entry)}"
    />
  </div>
</template>

<script lang="ts">
import { CollectionSearchEntry, SearchEntry as SE } from "@dogonis/vtube-client";
import { defineComponent, PropType } from "vue";
import SearchEntry from "./SearchEntry.vue";

export default defineComponent({
    components: { SearchEntry },
    emits: {
        select: (entry: Exclude<SE, CollectionSearchEntry>) => !!entry,
    },  
    props: {
        collection: {
            type: Object as PropType<CollectionSearchEntry['value']>,
            required: true,
        },
    },
});
</script>

<style lang="scss" scoped>
.collection {
    &__root {
        border: 1px dashed black;

        padding: 5px;
    }
    &__title {
        font-size: 20px;
        line-height: 24px;

        margin-bottom: 5px;
    }
}
</style>
