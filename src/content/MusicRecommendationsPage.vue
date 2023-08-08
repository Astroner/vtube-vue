<template>
  <page 
    name="Music recommendations" 
    title="Music" 
    shortcut 
    shortcut-icon="favorite" 
    :shortcut-icon-left-shift="-1"
  >
    <heading v-if="!isOnline" secondary center>
      Offline
    </heading>
    <div v-if="categories">
      <div v-for="category of categories" :key="category.title" class="music__category">
        <h3>
          {{ category.title }}
        </h3>
        <div>
          <div
            v-for="item of category.items"
            :key="item.type === 'VIDEO' ? item.value.code : item.value.list"
            class="music__item"
            @click="play(item)"
          >
            <display-image
              :display="item.value.display"
              width="25%"
              height="calc(100% - 10px)"
              margin="5px 10px 0 5px"
            />
            {{ item.value.title }}
          </div>
        </div>
      </div>
    </div>
  </page>
</template>

<script lang="ts">
import {
  computed, defineComponent,
} from "vue";
import { Recommendation } from "@dogonis/vtube-client";

import Page from "@/Pages/components/Page.vue";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { useStore } from "@/store";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import DisplayImage from "@/components/DisplayImage.vue";
import { usePages } from "@/Pages/hooks/usePages";
import { useIsOnline } from "@/helpers/hooks/use-is-online";
import Heading from "@/components/Heading.vue";

export default defineComponent({
  components: { Page, DisplayImage, Heading },
  setup() {
    const store = useStore();
    const pages = usePages();

    const isOnline = useIsOnline();

    const session = computed(() => store.state.user.session);

    const [, categories] = asyncComputed(async () => {
      if (!session.value || !isOnline.value) return "EXIT";
      const result = await session.value.recommendations.music();
      return result.categories;
    });

    return {
      categories,
      getMidItem,
      isOnline,
      play: (item: Recommendation) => {
        pages.goToPage("Player");
        if (item.type === "VIDEO") {
          store.commit("setQueue", [item.value]);
        } else {
          store.dispatch('playDynamicPlaylist', {
            list: item.value.list, code: item.value.code,
          });
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
h3 {
  font-size: 30px;
  margin: 0 0 10px;
}

.music {
  &__category {

    &:not(:last-child) {
      margin-bottom: 20px;
    }
  }
  &__item {
    border: 1px dashed black;

    font-size: 20px;
    line-height: 24px;

    height: 72px;

    display: flex;

    &:not(:last-child) {
      margin-bottom: 5px;
    }
  }
}
</style>
