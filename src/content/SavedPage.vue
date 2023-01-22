<template>
  <page name="Saved" title shortcut shortcut-icon="download" >
    <div 
        v-if="saved?.length === 0 && (queueState.length === 0 || !isOnline)"
        class="saved__nothing"
    >
        Nothing saved yet
    </div>
    <display-playlist 
        v-if="queueState.length > 0 && isOnline"
        title="Downloads Queue"
        :display="[{ url: '/queue1.jpeg', width: 0, height: 0 }]"
        @click="goToQueue"
    />
    <display-playlist 
        v-if="saved?.length ?? 0 > 0"
        title="Everything"
        :display="[{ url: '/saved-background.jpeg', width: 0, height: 0 }]"
        @click="open('all')"
    />
    <div v-if="savedPlaylists">
        <saved-playlist
            v-for="playlist of savedPlaylists"
            :key="playlist.list"
            :title="playlist.title"
            :thumbnail="playlist.thumbnail"
            @click="open(playlist.list)"
        />
    </div>
  </page>
</template>

<script lang="ts">
import { useSaved } from '@/music-storage/use-saved';
import Page from '@/Pages/components/Page.vue';
import { usePages } from '@/Pages/hooks/usePages';
import { musicStorage } from '@/music-storage';
import { useDBObservable } from '@/helpers/hooks/use-db-observable';
import SavedPlaylist from '@/components/SavedPlaylist.vue';
import DisplayPlaylist from '@/components/DisplayPlaylist.vue';
import { useIsOnline } from '@/helpers/hooks/use-is-online';
import { useDownloadsQueue } from '@/helpers/hooks/use-downloads-queue';

export default {
    components: { Page, SavedPlaylist, DisplayPlaylist },
    setup() {
        const pages = usePages();
        const saved = useSaved();
        const savedPlaylists = useDBObservable(musicStorage.savedPlaylists);
        const isOnline = useIsOnline();

        const queueState = useDownloadsQueue();

        return {
            queueState,
            saved,
            savedPlaylists,
            isOnline,
            open(list: string) {
                pages.goToPage("SavedPlaylist", list);
            },
            goToQueue() {
                pages.goToPage("Queue");
            },
        };
    },
};
</script>

<style scoped lang="scss">
.saved {
    &__nothing {
        font-size: 30px;
        text-align: center;
        color: rgba($color: #3e3e3e, $alpha: 0.5);
    }
    &__container {
        border: 1px dashed black;

        padding: 5px;

        margin-top: 20px;
    }
}
</style>
