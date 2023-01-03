<template>
  <page name="Playlists" title>
    <div v-if="playlists">
      <div
        v-for="item of playlists"
        :key="item.list"
        class="playlists__list"
        :style="{ backgroundImage: `url(${item.display[item.display.length - 1].url})` }"
        @click="play(item)"
      >
        <div class="playlists__title">
          {{ item.title }}
        </div>
      </div>
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

export default defineComponent({
  components: { Page },
  setup() {
    const pages = usePages();
    const store = useStore();

    const token = computed(() => store.state.user.token);

    const [, playlists] = asyncComputed(async () => {
      if (!token.value) return "EXIT";
      const data = await getUserPlaylists(token.value);
      return data;
    });

    return {
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
