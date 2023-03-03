<template>
    <page name="Channel" hidden @payload="setPayload" @leave="leave">
        <fade-in>
            <div v-if="channel && preview">
                <display-image 
                    :display="channel.background"
                    height="80px"
                    class="channel__background"
                />
                <div style="display: flex; margin-top: 20px">
                    <display-image
                        :display="channel.avatar"
                        class="channel__avatar"
                    />
                    <div style="margin-left: 10px">
                        <div class="channel__title">
                            {{ channel.title }}
                        </div>
                        <div v-if="preview.tag">
                            {{ preview.tag }}
                        </div>
                    </div>
                </div>
                <expandable-text 
                    v-if="channel.description"
                    :text="channel.description"
                    style="margin-top: 20px;"
                />
                <div style="margin-top: 20px; border: 1px dashed black; padding: 5px">
                    <display-video
                        v-for="video of videos?.items"
                        :key="video.code" 
                        :display="video.display" 
                        :code="video.code"
                        :title="video.title"
                        :active="video.code === currentPlaying?.code"
                        @click="play(video)"
                        @play="play(video)"
                    />
                </div>
            </div>
        </fade-in>
    </page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import { getChannelInfo, getChannelVideos } from "@/api/main/channel";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import Page from "@/Pages/components/Page.vue";
import { ChannelPreview, YTVideo } from "@/Responses";
import ExpandableText from "@/components/ExpandableText.vue";
import DisplayImage from "@/components/DisplayImage.vue";
import FadeIn from "@/components/FadeIn.vue";
import DisplayVideo from "@/components/DisplayVideo.vue";
import { useStore } from "@/store";
import { useCurrentPlying } from "@/helpers/hooks/use-current-playing";

export default defineComponent({
    components: {
        Page,
        ExpandableText,
        DisplayImage,
        FadeIn,
        DisplayVideo,
    },
    setup() {
        const store = useStore();
        const currentPlaying = useCurrentPlying();

        const preview = ref<ChannelPreview | null>(null);

        const [, channel] = asyncComputed(() => {
            if (!preview.value) return "EXIT";
            return getChannelInfo(preview.value.id);
        });

        const [, videos] = asyncComputed(() => {
            if (!preview.value) return "EXIT";

            return getChannelVideos(preview.value.id);
        });

        return {
            preview,
            channel,
            videos,
            currentPlaying,
            play(video: YTVideo) {
                store.commit("setQueue", [video]);
            },
            setPayload(data: ChannelPreview) {
                preview.value = data;
            },
            leave() {
                preview.value = null;
            },
        };
    },
});
</script>

<style lang="scss" scoped>
.channel {
    &__avatar {
        width: 25%;

        border-radius: 50%;

        &::after {
            content: "";
            display: block;

            padding-bottom: 100%;
        }
    }

    &__background {
        margin-top: 20px;

        &::after {
            content: "";
            display: block;

            padding-bottom: 10%;
        }
    }

    &__title {
        font-size: 24px;
    }
}
</style>
