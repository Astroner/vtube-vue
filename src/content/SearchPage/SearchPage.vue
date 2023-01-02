<template>
  <page name="Search" shortcut shortcutIcon="search" title>
    <div class="search__request">
      - I'm trying to find <span
        tabindex="0"
        role="textbox"
        contenteditable
        :class="[
          'search__value',
          !value && 'search__value--placeholder'
        ]"
        @input="value = $event.currentTarget.textContent"
      >
        {{ value }}
      </span>
    </div>
    <transition name="question">
      <div class="search__second" v-if="processed">
        - Is it a {{
          processed.type === "DYNAMIC_PLAYLIST"
          ? "dynamic playlist"
          : processed.type === "PLAYLIST"
          ? "playlist"
          : "video"
        }}?
      </div>
    </transition>
    <transition name="answers">
      <div class="search__result search__answers" v-if="processed">
        <button
          :class="[isSearching && 'active']"
          @click="isSearching = true"
          :disabled="isSearching"
        >
          Yes
        </button>
        <button
          @click="value = ''"
          :disabled="isSearching"
        >
          Clear
        </button>
      </div>
    </transition>
    <transition name="question">
      <div class="search__second" v-if="isSearching">
        - Ok, searching<dots :active="isLoading" />
      </div>
    </transition>
    <transition name="question">
      <div v-if="info" class="search__second">
        - Found!
      </div>
    </transition>
    <transition name="answers">
      <div v-if="info" class="search__second search__info__border">
        <display-image
          class="search__info__image"
          :display="info.type === 'VIDEO' ? info.info.displayImage : info.info.display"
        />
        <div class="search__info__title">
          {{ info.info.title }}
        </div>
      </div>
    </transition>
    <transition name="answers">
      <div v-if="info" class="search__result search__answers">
        <button
          @click="play()"
        >
          Play
        </button>
        <button
          @click="reset()"
        >
          Clear
        </button>
        <button
          v-if="info.type === 'PLAYLIST'"
          @click="shuffle()"
        >
          Shuffle
        </button>
        <button
          v-if="info.type === 'PLAYLIST'"
          @click="save()"
        >
          Save
        </button>
      </div>
    </transition>
  </page>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import Page from "@/Pages/components/Page.vue";
import { useStore } from "@/store";
import DisplayImage from "@/components/DisplayImage.vue";
import { usePages } from "@/Pages/hooks/usePages";

import Dots from "./Dots.vue";
import { useSearch } from "./useSearch";

export default defineComponent({
  components: { Page, Dots, DisplayImage },
  setup() {
    const store = useStore();
    const pages = usePages();

    const {
      value,
      processed,
      isLoading,
      isSearching,
      info,
      reset,
    } = useSearch();

    return {
      value,
      processed,
      isSearching,
      isLoading,
      info,
      play: () => {
        if (!info.value) return;
        if (info.value.type === "VIDEO") {
          store.commit("setQueue", [{
            title: info.value.info.title,
            display: info.value.info.displayImage,
            code: info.value.code,
          }]);
        }
        if (info.value.type === "DYNAMIC_PLAYLIST" || info.value.type === "PLAYLIST") {
          store.commit("setQueue", info.value.info.list);
        }
        reset();
        pages.gotToPage("Player");
      },
      reset,
      shuffle: () => {
        if (info.value?.type === "PLAYLIST") {
          store.commit("setQueue", info.value.info.list.sort(() => Math.random() * 2 - 1));
          reset();
          pages.gotToPage("Player");
        }
      },
      save: () => {
        if (info.value?.type === "PLAYLIST") {
          store.commit("addPlaylist", {
            id: info.value.id,
            title: info.value.info.title,
            display: info.value.info.display,
          });
          reset();
          pages.gotToPage("Playlists");
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.question-enter-active,
.question-leave-active,
.answers-enter-active,
.answers-leave-active {
  transition: opacity .3s, transform .3s;
}

.question-leave-active,
.answers-enter-active {
  transition-delay: .2s;
}

.question-enter-from,
.question-leave-to,
.answers-enter-from,
.answers-leave-to  {
  opacity: 0;
  transform: translateY(10px);
}
.search {
  &__value {
    text-decoration: underline;

    word-wrap: break-word;

    background-color: transparent;

    outline: none;

    border: none;

    &--placeholder {
      &::after {
        content: "Print";

        color: #919191;

        text-decoration: underline;
      }
    }
  }
  &__request {
    font-size: 30px;
  }
  &__second {
    font-size: 30px;

    margin-top: 20px;
  }
  &__answers {
    font-size: 30px;

    margin-top: 20px;

    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    button {
      background-color: #fff;

      border: 1px solid black;

      width: calc(50% - 5px);

      transition: background-color .3s, color .3s;

      &.active {
        background-color: #000;
        color: white;
      }

      &:active:not(:disabled) {
        background-color: #000;

        color: white;
      }

      &:nth-child(n + 3) {
        margin-top: 10px;
      }
    }
  }
  &__info {
    &__border {
      width: 100%;

      border: 1px dashed black;

      padding: 5px;
    }
    &__image {
      width: 100%;

      &::after {
        content: "";

        display: block;

        padding-bottom: 55%;
      }
    }
    &__title {
      font-size: 25px;
      text-align: center;

      margin-top: 10px;
      margin-bottom: 10px;

      text-align: center;

      padding: 0 10px;
    }
  }
}
</style>
