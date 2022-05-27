<template>
  <page name="Player" shortcut shortcutIcon="play" hidden className="player-page__root">
    <player margin="10px 0 20px" :code="currentItem?.code" @ended="nextItem" />
    <div class="player-page__queue">
      <div v-show="queue.length === 0" class="player-page__placeholder">
        Empty Queue
      </div>
      <div
        v-for="(item, index) of queue"
        :key="item.code"
        :class="{
          'player-page__item': true,
          'player-page__item--active': item.code === currentItem.code,
          'player-page__item--default': item.code !== currentItem.code
        }"
        @click="setCursor(index)"
      >
        <display-image
          :display="item.display"
          width="25%"
          height="calc(100% - 15px)"
          margin="7px 10px 0px 5px"
        />
        {{ item.title }}
      </div>
    </div>
  </page>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import Page from "@/Pages/components/Page.vue";
import DisplayImage from "@/components/DisplayImage.vue";
import { useStore } from "@/store";

import Player from "./Player.vue";

export default defineComponent({
  components: { Page, Player, DisplayImage },
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
    border: 1px solid black;

    font-size: 20px;
    line-height: 24px;

    height: 72px;
    width: 100%;

    display: flex;

    transition: color .5s, background-color .5s;

    &--active {
      background-color: black;

      color: white;
    }

    &--default {
      background-color: white;

      color: black;
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
