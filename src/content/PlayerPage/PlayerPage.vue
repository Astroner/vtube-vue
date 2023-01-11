<template>
  <page name="Player" shortcut shortcutIcon="play" hidden className="player-page__root">
    <player
      margin="10px 0 20px"
      :code="currentItem?.code"
      @ended="nextItem"
      :saved="!!currentItem?.saved" 
    />
    <div class="player-page__queue">
      <div v-show="queue.length === 0" class="player-page__placeholder">
        Empty Queue
      </div>
      <div
        v-for="(item, index) of queue"
        :key="item.code"
        class="player-page__item"
      >
        <display-video 
          v-if="!item.saved"
          :active="item.code === currentItem.code"
          @click="setCursor(index)"
          :display="item.display"
          :code="item.code"
          :title="item.title"
        />
        <saved-video
          v-else
          :active="item.code === currentItem.code"
          @click="setCursor(index)"
          :code="item.code"
          :title="item.title"
          :thumbnail="item.saved.thumbnail"
          disable-menu
        />
      </div>
    </div>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import Page from "@/Pages/components/Page.vue";
import { useStore } from "@/store";
import DisplayVideo from "@/components/DisplayVideo.vue";
import SavedVideo from "@/components/SavedVideo.vue";

import Player from "./Player.vue";

export default defineComponent({
  components: {
 Page, Player, DisplayVideo, SavedVideo, 
},
  setup() {
    const store = useStore();

    const currentItem = computed(() => store.state.queue.items[store.state.queue.cursor]);

    const queue = computed(() => store.state.queue.items);

    return {
      currentItem,
      queue,
      setCursor: (index: number) => store.commit('setCursor', index),
      nextItem: () => store.commit('next'),
    };
  },
});
</script>

<style lang="scss" scoped>
.player-page {
  &__root {
    display: flex;
    flex-direction: column;
  }
  &__queue {
    border: 1px dashed black;

    position: relative;

    padding: 5px;

    flex-grow: 1;

    display: flex;
    align-items: center;

    flex-direction: column;
  }
  &__placeholder {
    font-size: 30px;
    color: #919191;

    margin-top: 10px;
  }
  &__item {
    width: 100%;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
