<template>
    <display-video
        v-if="entry.type === 'VIDEO'"
        :code="entry.value.code"
        :title="entry.value.title"
        :active="entry.value.code === currentPlaying?.code"
        :display="entry.value.display"
        @click="action(entry)"
        @play="action(entry)"
    />
    <display-playlist
        v-else-if="entry.type === 'PLAYLIST' || entry.type === 'DYNAMIC_PLAYLIST'"
        :display="entry.value.display"
        :title="entry.value.title"
        @click="action(entry)"
    />
    <display-channel 
        v-else-if="entry.type === 'CHANNEL'"
        :username="entry.value.title"
        :display="entry.value.display"
        :description="entry.value.description ?? undefined"
        :tag="entry.value.tag ?? undefined"
    />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

import { CollectionSearchEntry, SearchEntry } from "@/Responses";
import DisplayVideo from "@/components/DisplayVideo.vue";
import DisplayPlaylist from "@/components/DisplayPlaylist.vue";
import { useStore } from "@/store";
import { useCurrentPlying } from "@/helpers/hooks/use-current-playing";
import { usePages } from "@/Pages/hooks/usePages";

import DisplayChannel from "./DisplayChannel.vue";

export default defineComponent({
  components: { DisplayVideo, DisplayPlaylist, DisplayChannel },
    props: {
        entry: {
            type: Object as PropType<Exclude<SearchEntry, CollectionSearchEntry>>,
            required: true,
        },
    },
    setup() {
        const store = useStore();
        const currentPlaying = useCurrentPlying();
        const pages = usePages();

        return {
            currentPlaying,
            action(entry: SearchEntry) {
                if (entry.type === "VIDEO") {
                    store.commit('setQueue', [{
                        title: entry.value.title,
                        display: entry.value.display,
                        code: entry.value.code,
                    }]);
                } else if (entry.type === "PLAYLIST") {
                    pages.goToPage('Playlist', {
                        list: entry.value.list,
                        title: entry.value.title,
                        display: entry.value.display,
                    });
                } else if (entry.type === "DYNAMIC_PLAYLIST") {
                    store.dispatch('playDynamicPlaylist', {
                        list: entry.value.list,
                        code: entry.value.code,
                    });
                    pages.goToPage("Player");
                }
            },
        };
    },
});
</script>
