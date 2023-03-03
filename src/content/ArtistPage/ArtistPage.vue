<template>
  <page
    name="Artist"
    hidden
    auto-scroll
    @payload="init"
    @leave="leave"
    :title="channel?.title"
  >
    <div class="artist__display">
      <display-image
        v-if="channel"
        :display="channel.display"
        class="artist__image"
      />
      <display-image
        v-if="info"
        :display="info.background"
        class="artist__image artist__image--in"
      />
    </div>
    <fade-in>
      <div v-if="info">
        <expandable-text v-if="info.description" :text="info.description" />
        <div v-for="(category, index) of info.categories" :key="index" class="artist__category">
          <div class="artist__category__title">
            {{ category.title }}
          </div>
          <div v-for="(item, index) of category.items" :key="index" class="artist__category__item">
            <display-video
              v-if="'code' in item"
              :code="item.code"
              :title="item.title"
              :display="item.display"
              @click="play(item)"
              @play="play(item)"
              :active="currentPlaying?.code === item.code"
            />
            <display-playlist 
              v-else-if="'list' in item"
              :display="item.display"
              :title="item.title"
              @click="openPlaylist(item)"
            />
            <display-channel
              v-else-if="'id' in item"
              :display="item.display"
              :username="item.title"
              @click="openChannel(item)"
            />
          </div>
        </div>
      </div>
    </fade-in>
  </page>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import Page from "@/Pages/components/Page.vue";
import { ChannelPreview, YTPlaylistWithID, YTVideo } from "@/Responses";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import { getArtist } from "@/api/main/getArtist";
import DisplayImage from "@/components/DisplayImage.vue";
import FadeIn from "@/components/FadeIn.vue";
import ExpandableText from "@/components/ExpandableText.vue";
import DisplayVideo from "@/components/DisplayVideo.vue";
import DisplayPlaylist from "@/components/DisplayPlaylist.vue";
import { useCurrentPlying } from "@/helpers/hooks/use-current-playing";
import { useStore } from "@/store";
import { usePages } from "@/Pages/hooks/usePages";

import DisplayChannel from "../SearchPage/components/DisplayChannel.vue";

export default defineComponent({
  components: {
    Page,
    DisplayImage,
    FadeIn,
    ExpandableText,
    DisplayVideo,
    DisplayPlaylist,
    DisplayChannel,
  },
  setup() {
    const currentPlaying = useCurrentPlying();
    const store = useStore();
    const pages = usePages();

    const channel = ref<null | ChannelPreview>(null);

    const [, info] = asyncComputed(() => {
      if (!channel.value) return "EXIT";
      return getArtist(channel.value.id);
    });

    return {
      channel,
      info,
      currentPlaying,
      init(data: ChannelPreview) {
        channel.value = data;
      },
      leave() {
        channel.value = null;
      },
      play(item: YTVideo) {
        store.commit('setQueue', [item]);
      },
      openPlaylist(item: YTPlaylistWithID) {
        pages.goToPage('Playlist', {
          list: item.list,
          title: item.title,
          display: item.display,
        });
      },
      openChannel(item: ChannelPreview) {
        pages.goToPage('Artist', item);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.artist {
  &__display {
    width: 100%;

    position: relative;

    border: 1px dashed black;

    &::after {
      content: "";
      display: block;
      padding-bottom: 50%;
    }
  }

  &__image {
    position: absolute;
    top: 5px;
    left: 5px;

    width: calc(100% - 10px);
    height: calc(100% - 10px);

    &--in {
      animation: fade-in .5s forwards;
    }
  }

  &__category {
    margin-top: 20px;

    border: 1px dashed black;

    padding: 5px;

    &__title {
      font-size: 24px;
      line-height: 26px;

      margin-bottom: 5px;
    }

    &__item {
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}

@keyframes fade-in{
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
