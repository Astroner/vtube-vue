<template>
  <page name="Saved" title shortcut shortcut-icon="download" >
    <div class="saved__nothing" v-if="saved?.length === 0">
        Nothing saved yet
    </div>
    <div v-else-if="saved">
        <div style="display: flex">
            <Button @click="play">Play</Button>
            <Button @click="shuffle" style="margin-left: 10px">Shuffle</Button>
        </div>
        <Button style="margin-top: 10px" @click="clear">Clear</Button>
        <div class="saved__container">
            <saved-video 
                v-for="(item, index) of saved"
                :key="item.code"
                :code="item.code"
                :title="item.title"
                :thumbnail="item.thumbnail" 
                @click="playFromIndex(index)"
                :active="item.code === activeAudio"
            >
                <Button @click="playFromIndex(index)">Play</Button>
                <Button @click="remove(item.code)" style="margin-left: 5px">Delete</Button>
            </saved-video>
        </div>
    </div>
  </page>
</template>

<script lang="ts">
import { computed } from 'vue';
import { useSaved } from '@/music-storage/use-saved';
import Page from '@/Pages/components/Page.vue';
import Button from '@/components/Button.vue';
import SavedVideo from '@/components/SavedVideo.vue';
import { useStore } from '@/store';
import { usePages } from '@/Pages/hooks/usePages';
import { QueueItem } from '@/store/modules/modules';
import { musicStorage } from '@/music-storage';

export default {
    components: { Page, SavedVideo, Button },
    setup() {
        const saved = useSaved();
        const store = useStore();
        const pages = usePages();

        const activeAudio = computed<string | null>(
            () => store.state.queue.items[store.state.queue.cursor]?.code ?? null,
        );

        return {
            saved,
            activeAudio,
            play() {
                if (!saved.value) return;
                store.commit("setPlaylist", {
                    list: "saved",
                    items: saved.value.map<QueueItem>((item) => ({
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
                if (!saved.value) return;
                store.commit("setPlaylist", {
                    list: "saved",
                    items: saved.value.map<QueueItem>((item) => ({
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
                if (!saved.value) return;
                store.commit("setPlaylist", {
                    list: "saved",
                    items: saved.value.map<QueueItem>((item) => ({
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
            remove(code: string) {
                musicStorage.deleteSaved(code);
                if (activeAudio.value === code) {
                    store.commit("next");
                }
            },
            clear() {
                musicStorage.deleteAllSaved();
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
