<template>
  <page 
    name="Music recommendations" 
    title="Music" 
    shortcut 
    shortcut-icon="favorite" 
    :shortcut-icon-left-shift="-1"
  >
    <div v-if="categories">
      <div v-for="category of categories" :key="category.title" class="music__category">
        <h3>
          {{ category.title }}
        </h3>
        <div>
          <div
            v-for="item of category.items"
            :key="item.type === 'VIDEO' ? item.code : item.list"
            class="music__item"
            @click="play(item)"
          >
            <display-image
              :display="item.display"
              width="25%"
              height="calc(100% - 10px)"
              margin="5px 10px 0 5px"
            />
            {{ item.title }}
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

import Page from "@/Pages/components/Page.vue";
import { getMusicRecommendations } from "@/api/main/getRecommendations";
import { getMidItem } from "@/helpers/functions/getMidItem";
import { useStore } from "@/store";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import DisplayImage from "@/components/DisplayImage.vue";
import { usePages } from "@/Pages/hooks/usePages";
import { Recommendation } from "@/Responses";

export default defineComponent({
  components: { Page, DisplayImage },
  setup() {
    const store = useStore();
    const pages = usePages();

    const token = computed(() => store.state.user.token);

    const [, categories] = asyncComputed(async () => {
      if (!token.value) return "EXIT";
      const result = await getMusicRecommendations(token.value);
      return result.categories;
    });

    return {
      categories,
      getMidItem,
      play: (item: Recommendation) => {
        pages.goToPage("Player");
        if (item.type === "VIDEO") {
          store.commit("setQueue", [item]);
        } else {
          store.dispatch('playDynamicPlaylist', {
            list: item.list, code: item.code,
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
