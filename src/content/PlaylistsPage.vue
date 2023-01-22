<template>
  <page name="Playlists" title>
    <heading v-if="!isOnline" center secondary>
      Offline
    </heading>
    <div v-if="playlists">
      <display-playlist 
        v-for="item of playlists"
        :key="item.list"
        :title="item.title"
        :display="item.display"
        @click="play(item)"
      />
    </div>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import Page from "@/Pages/components/Page.vue";
import { useStore } from "@/store";
import { usePages } from "@/Pages/hooks/usePages";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import { getUserPlaylists } from "@/api/main/playlists";
import { PlaylistWithID } from "@/Responses";
import DisplayPlaylist from "@/components/DisplayPlaylist.vue";
import { useIsOnline } from "@/helpers/hooks/use-is-online";
import Heading from "@/components/Heading.vue";

export default defineComponent({
  components: { Page, DisplayPlaylist, Heading },
  setup() {
    const pages = usePages();
    const store = useStore();

    const isOnline = useIsOnline();

    const token = computed(() => store.state.user.token);

    const [, playlists] = asyncComputed(async () => {
      if (!token.value || !isOnline.value) return "EXIT";
      const data = await getUserPlaylists(token.value);
      return data;
    });

    return {
      isOnline,
      playlists,
      play: (list: PlaylistWithID) => {
        pages.goToPage("Playlist", list);
      },
      getMidItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.playlists {
  &__list {
    height: 72px;

    border: 1px solid black;

    font-size: 20px;
    line-height: 24px;

    background-position: center center;
    background-size: cover;

    position: relative;

    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  &__title {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba($color: #fff, $alpha: .4);

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 25px;
  }
}
</style>
