<template>
  <page name="Playlists" title>
    <div
      v-for="item of list"
      :key="item.id"
      class="playlists__list"
      :style="{ backgroundImage: `url(${item.display[item.display.length - 1].url})` }"
      @click="play(item.id)"
    >
      <div class="playlists__title">
        {{ item.title }}
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

export default defineComponent({
  components: { Page },
  setup() {
    const pages = usePages();
    const store = useStore();

    const list = computed(() => store.state.playlists.items);

    return {
      list,
      play: (id: string) => {
        store.dispatch("playPlaylist", id);
        pages.gotToPage("Player");
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
