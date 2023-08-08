<template>
    <display-video
        v-if="entry.type === 'VIDEO'"
        :code="entry.value.code"
        :title="entry.value.title"
        :active="entry.value.code === currentPlaying?.code"
        :display="entry.value.display"
        @click="$emit('select', entry)"
        @play="$emit('select', entry)"
    />
    <display-playlist
        v-else-if="entry.type === 'PLAYLIST' || entry.type === 'DYNAMIC_PLAYLIST'"
        :display="entry.value.display"
        :title="entry.value.title"
        @click="$emit('select', entry)"
    />
    <display-channel 
        v-else-if="entry.type === 'CHANNEL'"
        :username="entry.value.title"
        :display="entry.value.display"
        :description="entry.value.description ?? undefined"
        :tag="entry.value.tag ?? undefined"
        @click="$emit('select', entry)"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CollectionSearchEntry, SearchEntry } from "@dogonis/vtube-client";

import DisplayVideo from "@/components/DisplayVideo.vue";
import DisplayPlaylist from "@/components/DisplayPlaylist.vue";
import { useCurrentPlying } from "@/helpers/hooks/use-current-playing";

import DisplayChannel from "./DisplayChannel.vue";

export default defineComponent({
    components: { DisplayVideo, DisplayPlaylist, DisplayChannel },
    props: {
        entry: {
            type: Object as PropType<Exclude<SearchEntry, CollectionSearchEntry>>,
            required: true,
        },
    },
    emits: {
        select: (entry: Exclude<SearchEntry, CollectionSearchEntry>) => !!entry,
    },
    setup() {
        const currentPlaying = useCurrentPlying();

        return {
            currentPlaying,
        };
    },
});
</script>
