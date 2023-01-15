<template>
  <page hidden name="Playlist" @payload="setPayload" @leave="cleanup">
    <div v-if="playlist">
        <div class="playlist__title">
            <div class="playlist__text">
                {{ playlist.title  }}
            </div>
        </div>
        <div class="playlist__image">
            <display-image 
                @click="play"
                :display="playlist.display"
                height="100%"
            />
            <fade-in>
                <div v-if="isCurrentPlaylist" class="playlist__holder">
                    <icon name="loading" class="playlist__loading" />
                </div>
            </fade-in>
        </div>
        <div class="playlist__buttons">
            <Button @click="play">Play</Button>
            <Button 
                @click="save" 
                :disabled="isDownloaded" 
                style="margin-left: 10px"
            >
                {{ isDownloaded ? "Saved" : "Save"}}
            </Button>
        </div>
        <Button @click="shuffle" style="margin-top: 10px">Shuffle</Button>
        <fade-in>
            <div v-if="items" class="playlist__items">
                <display-video 
                    v-for="(item, index) of items"
                    class="playlist__item"
                    :style="{ animationDelay: `${index < 10 ? index * 100 : 0}ms` }"
                    :key="item.code"
                    :code="item.code"
                    :display="item.display"
                    :title="item.title"
                    :active="item.code === currentVideo?.code"
                    @click="playFromPosition(index)"
                />
            </div> 
        </fade-in>
    </div>
  </page>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';

import { getPlaylist } from '@/api/main/playlists';
import { asyncComputed } from '@/helpers/hooks/asyncComputed';
import Page from '@/Pages/components/Page.vue';
import { PlaylistWithID } from '@/Responses';
import DisplayVideo from '@/components/DisplayVideo.vue';
import DisplayImage from '@/components/DisplayImage.vue';
import Button from '@/components/Button.vue';
import FadeIn from '@/components/FadeIn.vue';
import { useStore } from '@/store';
import { usePages } from '@/Pages/hooks/usePages';
import { QueueItem } from '@/store/modules/modules';
import Icon from '@/components/Icon/Icon.vue';
import { musicStorage } from '@/music-storage';
import { useDBObservable } from '@/helpers/hooks/use-db-observable';

export default {
    components: { 
        Page, 
        DisplayVideo, 
        DisplayImage, 
        Button, 
        FadeIn,
        Icon,
    },
    setup() {
        const store = useStore();
        const pages = usePages();
        const savedPlaylists = useDBObservable(musicStorage.savedPlaylists);

        const playlist = ref<PlaylistWithID | null>(null);
        
        const playRequest = ref<null | { type: "P" | "S", i: number | null }>(null);

        const isDownloaded = computed(
            () => !!savedPlaylists.value?.find((item) => item.list === playlist.value?.list),
        );

        const isCurrentPlaylist = computed(
            () => store.state.queue.currentPlaylist === playlist.value?.list,
        );
        const currentVideo = computed<QueueItem | null>(
            () => store.state.queue.items[store.state.queue.cursor] ?? null,
        );
    
        const [, items] = asyncComputed(async () => {
            if (!playlist.value) return "EXIT";
            const { list } = await getPlaylist(playlist.value.list);
            return list;
        });

        watch([playRequest, items], ([request, list]) => {
            if (!request || !list) return;

            if (request.type === "S") {
                store.commit("setPlaylist", {
                    items: list,
                    list: playlist.value?.list,
                    shuffle: true,
                });
                pages.goToPage("Player");
            } else if (request.i === null) {
                store.commit("setPlaylist", {
                    items: list,
                    list: playlist.value?.list,
                });
                pages.goToPage("Player");
            } else {
                store.commit("setPlaylist", {
                    items: list,
                    cursor: request.i,
                    list: playlist.value?.list,
                });
            }
        });

        return {
            playlist,
            items,
            currentVideo,
            isCurrentPlaylist,
            isDownloaded,
            save() {
                if (!playlist.value?.list) return;

                musicStorage.savePlaylist(playlist.value.list);
            },
            setPayload(payload: PlaylistWithID | null) {
                playlist.value = payload;
            },
            play() {
                playRequest.value = {
                    i: null,
                    type: "P",
                };
            },
            shuffle() {
                playRequest.value = {
                    type: "S",
                    i: null,
                };
            },
            cleanup() {
                playRequest.value = null;
            },
            playFromPosition(index: number) {
                playRequest.value = {
                    i: index,
                    type: "P",
                };
            },
        };
    },
};

</script>

<style lang="scss" scoped>
.playlist {
    &__image {
        margin-top: 10px;

        position: relative;

        border: 1px dashed black;

        padding: 5px;

        height: calc((100vw - 20px) / 2);
        width: 100%;
    }
    &__title {
        margin-top: 10px;

        text-align: center;
        font-size: 30px;
        line-height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;
    }
    &__text {
        position: relative;
    }
    &__holder {
        position: absolute;
        top: 6px;
        left: 6px;

        width: calc(100% - 12px);
        height: calc(100% - 12px);

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba($color: #fff, $alpha: 0.5);
    }
    &__loading {
        animation: rotation 1s linear infinite;
    }
    &__buttons {

        margin-top: 10px;

        display: flex;
    }
    &__items {
        margin-top: 20px;

        border: 1px dashed black;

        padding: 5px;
    }
    &__item {
        animation: slide-in .3s ease-in-out forwards;
        opacity: 0;
    }
}
@keyframes slide-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0px);
    }
}

@keyframes rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
</style>
