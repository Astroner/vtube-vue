<template>
  <Page name="Search" title>
    <Input style="margin-bottom: 20px" v-model:value="input" placeholder="I'm searching..." />
    <fade-in>
      <div
        v-if="results?.music.length && results?.youtube.length" 
        style="display: flex; margin-bottom: 20px"
      >
        <Button 
          :class="{
            search__button: true,
            'search__button--active': shows === 'm',
            'search__button--default': shows === 'yt',
          }"
          @click="shows = 'm'"
        >
          Music
        </Button>
        <Button
          :class="{
            search__button: true,
            'search__button--active': shows === 'yt',
            'search__button--default': shows === 'm',
          }"
          style="margin-left: 10px"
          @click="shows = 'yt'"
        >
          Videos
        </Button>
      </div>
    </fade-in>
    <fade-in>
      <div v-if="results" style="position: relative">
        <results
          :class="{
            search__group: true,
            'search__group--visible': shows === 'm',
            'search__group--hidden': shows === 'yt',
          }"
          :entries="results.music"
          @select="action"
        />
        <results
          :class="{
            search__group: true,
            'search__group--visible': shows === 'yt',
            'search__group--hidden': shows === 'm',
          }"
          :entries="results.youtube"
          @select="action"
        />
      </div>
    </fade-in>
    <fade-in>
      <dots v-if="!results" />
    </fade-in>
  </page>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  watchEffect,
} from "vue";

import Page from "@/Pages/components/Page.vue";
import Input from "@/components/Input.vue";
import { debounce } from "@/helpers/functions/debounce";
import { searchMusic, searchYoutube } from "@/api/main/search";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import FadeIn from "@/components/FadeIn.vue";
import Button from "@/components/Button.vue";
import { CollectionSearchEntry, SearchEntry } from "@/Responses";
import { useStore } from "@/store";
import { usePages } from "@/Pages/hooks/usePages";

import Dots from "./components/Dots.vue";
import Results from "./components/Results.vue";

export default defineComponent({
  components: {
    Page,
    Input,
    FadeIn,
    Dots,
    Button,
    Results,
  },
  setup() {
    const store = useStore();
    const pages = usePages();

    const shows = ref<"yt" | "m">("m");

    const input = ref("");
    const query = ref("");

    const [, results] = asyncComputed(async () => {
      if (!query.value) {
        return {
          music: [],
          youtube: [],
        };
      }

      const [youtube, music] = await Promise.all([
        searchYoutube(query.value),
        searchMusic(query.value),
      ]);

      return {
        youtube, music,
      };
    });

    const search = debounce(async (text: string) => {
      query.value = text.trim();
    }, 500);

    watch(input, (value) => {
      search(value);
    });

    watchEffect(() => {
      if (
        !results.value 
        || (results.value.music.length === 0 && results.value.youtube.length === 0)
      ) return;
      
      if (results.value.music.length === 0) {
        shows.value = 'yt';
      } else if (results.value.youtube.length === 0) {
        shows.value = 'm';
      }
    });

    return {
      input,
      results,
      shows,
      action(entry: Exclude<SearchEntry, CollectionSearchEntry>) {
        if (entry.type === "VIDEO") {
          store.commit('setQueue', [{
            title: entry.value.title,
            display: entry.value.display,
            code: entry.value.code,
          }]);
        } else if (entry.type === "PLAYLIST") {
          pages.goToPage('Playlist', {
            list: entry.value.list,
            title: entry.value.title,
            display: entry.value.display,
          });
        } else if (entry.type === "DYNAMIC_PLAYLIST") {
          store.dispatch('playDynamicPlaylist', {
            list: entry.value.list,
            code: entry.value.code,
          });
          pages.goToPage("Player");
        } else if (entry.type === "CHANNEL") {
          if (shows.value === 'm') {
            pages.goToPage("Artist", entry.value);
          } else {
            pages.goToPage("Channel", entry.value);
          }
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.search {
  &__button {
    transition: width .3s ease;

    &--active {
      width: calc(75%);
    }
    &--default {
      width: calc(25%);
    }
  }

  &__group {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;

    overflow: hidden;
    
    &--visible {
      transition: opacity .3s .5s, max-height .3s;

      opacity: 1;
      
      z-index: 1;

      max-height: 20000px;
    }
    &--hidden {
      transition: opacity .3s, max-height .3s;

      opacity: 0;

      z-index: 0;

      max-height: 0;
    }
  }
}
</style>
