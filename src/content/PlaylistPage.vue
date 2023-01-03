<template>
  <page hidden name="Playlist" @payload="setPayload" @leave="cleanup">
    <div v-if="playlist">
        <div class="playlist__title">
            {{ playlist.title  }}
        </div>
        <div class="playlist__image">
            <display-image 
                @click="play"
                :display="playlist.display"
                height="100%"
            />
        </div>
        <div class="playlist__buttons">
            <Button @click="play">Play</Button>
            <Button @click="shuffle" style="margin-left: 5px">Shuffle</Button>
        </div>
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
                />
                
            </div>
        </fade-in>
    </div>
  </page>
</template>

<script lang="ts">
import { ref, watch } from 'vue';

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

export default {
    components: { 
        Page, 
        DisplayVideo, 
        DisplayImage, 
        Button, 
        FadeIn,
    },
    setup() {
        const store = useStore();
        const pages = usePages();

        const playlist = ref<PlaylistWithID | null>(null);
        
        const playRequest = ref<null | "S" | "P">(null);

        const [, items] = asyncComputed(async () => {
            if (!playlist.value) return "EXIT";
            const { list } = await getPlaylist(playlist.value.list);
            return list;
        });

        watch([playRequest, items], ([request, list]) => {
            if (!request || !list) return;

            if (request === "P") store.commit("setQueue", list);
            else store.commit("setQueueAndShuffle", list);

            pages.goToPage("Player");
        });

        return {
            setPayload(payload: PlaylistWithID | null) {
                playlist.value = payload;
            },
            playlist,
            items,
            play() {
                playRequest.value = "P";
            },
            shuffle() {
                playRequest.value = "S";
            },
            cleanup() {
                playRequest.value = null;
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
</style>
