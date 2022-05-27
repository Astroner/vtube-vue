<template>
  <page name="Music recommendations" title="Music">
    <div v-if="categories">
      <div v-for="category of categories" :key="category.title" class="music__category">
        <h3>
          {{ category.title }}
        </h3>
        <div>
          <div
            v-for="item of category.items"
            :key="item.list"
            class="music__item"
            @click="play(item.list, item.code)"
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

export default defineComponent({
  components: { Page, DisplayImage },
  setup() {
    const store = useStore();
    const pages = usePages();

    const psid = computed(() => store.state.user.psid);
    const [, categories] = asyncComputed(() => {
      if (!psid.value) return "EXIT";
      return getMusicRecommendations(psid.value)
        .then((res) => Promise.resolve(res.categories));
    });

    return {
      categories,
      getMidItem,
      psid,
      play: (list: string, code: string) => {
        pages.gotToPage("Player");
        store.dispatch('playDynamicPlaylist', {
          list, code,
        });
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
