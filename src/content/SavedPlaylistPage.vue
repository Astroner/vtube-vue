<template>
    <page 
        hidden 
        name="SavedPlaylist" 
        @payload="setPayload" 
        @leave="leave"
        :title="list === 'all' ? 'Everything' : playlist?.title"
    >
        <div class="saved-playlist__image">
            <display-image
                v-if="display"
                :display="display"
                height="100%"
            />
            <fade-in>
                <div v-if="currentPlaylist === list" class="saved-playlist__holder">
                    <Icon name="loading" class="saved-playlist__loading" />
                </div>
            </fade-in>
        </div>
        <div style="display: flex; margin-top: 10px;">
            <Button @click="play">Play</Button>
            <Button @click="remove" style="margin-left: 10px">Delete</Button>
        </div>
        <Button @click="shuffle" style="margin-top: 10px">Shuffle</Button>
        <fade-in>
            <div v-if="displayItems" class="saved-playlist__items">
                <saved-video
                    v-for="(item, index) of displayItems"
                    class="saved-playlist__item"
                    :style="{ animationDelay: `${index < 10 ? index * 100 : 0}ms` }"
                    :key="item.code"
                    :code="item.code"
                    :thumbnail="item.thumbnail"
                    :title="item.title"
                    @click="playFromIndex(index)"
                    :active="item.code === currentPlying?.code"
                />
            </div> 
        </fade-in>
        <continue
            v-if="displayItems && items && displayItems.length < items.length"
            @continue="more"
        />
    </page>
</template>

<script lang="ts">
import { 
    computed, defineComponent, ref, watch,
} from 'vue';

import Page from '@/Pages/components/Page.vue';
import { asyncComputed } from '@/helpers/hooks/asyncComputed';
import { useCurrentPlying } from '@/helpers/hooks/use-current-playing';
import { musicStorage } from '@/music-storage';
import DisplayImage from '@/components/DisplayImage.vue';
import { SavedVideo as SavedVideoType } from '@/music-storage/music-storage.model';
import SavedVideo from '@/components/SavedVideo.vue';
import Button from '@/components/Button.vue';
import { useStore } from '@/store';
import { QueueItem } from '@/store/modules/modules';
import { usePages } from '@/Pages/hooks/usePages';
import FadeIn from '@/components/FadeIn.vue';
import Icon from '@/components/Icon/Icon.vue';
import Continue from '@/components/Continue.vue';
import { ObjectURL } from '@/helpers/classes/object-url.class';

export default defineComponent({
    components: { 
        Page,
        DisplayImage,
        SavedVideo,
        Button,
        FadeIn,
        Icon,
        Continue,
    },
    setup() {
        const store = useStore();
        const pages = usePages();
        const currentPlying = useCurrentPlying();

        const list = ref<string | null>(null);
        const displayLimit = ref(10);

        const [, playlist] = asyncComputed(async () => {
            if (!list.value) return "EXIT";

            if (list.value === "all") return "EXIT";

            return musicStorage.getPlaylist(list.value);
        });

        const currentPlaylist = computed(() => store.state.queue.currentPlaylist);

        const url = computed(() => {
            if (!playlist.value || list.value === "all") return null;
            return new ObjectURL(playlist.value.thumbnail);
        });

        const display = computed(() => {
            if (list.value === "all") {
                return [{
                    url: '/saved-background.jpeg',
                    width: 0,
                    height: 0,
                }];
            }
            if (!url.value) return null;
            return [{
                url: url.value.url,
                width: 0,
                height: 0,
            }];
        });

        const [, items] = asyncComputed(async () => {
            if (!list.value) return "EXIT";

            if (list.value === "all") {
                return musicStorage.getAllSaved();
            }

            const audios = await musicStorage.getPlaylistAudios(list.value);
            
            const info = await Promise.all(
                audios.map((code) => musicStorage.getSavedInfo(code)),
            );

            return info.filter((a): a is SavedVideoType => !!a);
        });

        const displayItems = computed(() => items.value?.slice(0, displayLimit.value));

        watch(url, (urlValue, _, onCleanup) => {
            if (!urlValue) return;
            onCleanup(() => {
                urlValue.destroy();
            });
        }, { immediate: true });

        return {
            list,
            playlist,
            display,
            items,
            displayItems,
            currentPlying,
            currentPlaylist,
            setPayload(payload: string) {
                list.value = payload;
            },
            play() {
                if (!items.value || !list.value) return;
                store.commit("setPlaylist", {
                    list: list.value,
                    items: items.value.map<QueueItem>((item) => ({
                        code: item.code,
                        title: item.title,
                        display: [],
                        saved: {
                            thumbnail: item.thumbnail,
                        },
                    })),
                });
                pages.goToPage("Player");
            },
            shuffle() {
                if (!items.value || !list.value) return;
                store.commit("setPlaylist", {
                    list: list.value,
                    items: items.value.map<QueueItem>((item) => ({
                        code: item.code,
                        title: item.title,
                        display: [],
                        saved: {
                            thumbnail: item.thumbnail,
                        },
                    })),
                    shuffle: true,
                });
                pages.goToPage("Player");
            },
            playFromIndex(cursor: number) {
                if (!items.value || !list.value) return;
                store.commit("setPlaylist", {
                    list: list.value,
                    items: items.value.map<QueueItem>((item) => ({
                        code: item.code,
                        title: item.title,
                        display: [],
                        saved: {
                            thumbnail: item.thumbnail,
                        },
                    })),
                    cursor,
                });
            },
            remove() {
                if (!list.value) return;
                if (list.value === "all") {
                    musicStorage.deleteAllSaved();
                } else {
                    musicStorage.deletePlaylist(list.value);
                }
                if (currentPlaylist.value === list.value) {
                    store.commit("clear");
                }
                pages.goToPage("Saved");
            },
            more() {
                displayLimit.value += 10;
            },
            leave() {
                list.value = null;
                displayLimit.value = 10;
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.saved-playlist {
    &__image {
        margin-top: 10px;

        position: relative;

        border: 1px dashed black;

        padding: 5px;

        height: calc((100vw - 20px) / 2);
        width: 100%;
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
