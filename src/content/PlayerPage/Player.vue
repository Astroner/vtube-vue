<template>
  <div :style="{ margin: margin }" class="player__root">
    <transition name="fade">
      <div
        v-if="info"
        class="player__display"
        :style="{ backgroundImage: `url(${getMidItem(info.displayImage).url})` }"
        @click="interact"
      >
        <div class="player__container" >
          <div class="player__title">
            {{ info.title }}
          </div>
        </div>
        <div v-if="isPlaying && playTouched" class="player__status-bg">
          <icon name="play" />
        </div>
        <div v-else-if="!isPlaying && playTouched" class="player__status-bg">
          <icon name="pause" />
        </div>
        <div
          v-if="formattedLastProgress"
          :key="formattedLastProgress"
          class="player__status-bg player__time"
        >
          {{ formattedLastProgress }}
        </div>
        <div class="player__progress">
          <div class="player__line" @click="handleProgress">
            <div class="player__dot" :style="{ left: `${progress * 100}%` }" />
          </div>
        </div>
      </div>
    </transition>
    <audio
      key="player"
      v-if="media"
      ref="audio"
      @pause="isPlaying = false"
      @play="isPlaying = true"
      @timeupdate="e => progress = e.target.currentTime / e.target.duration"
      @ended="ended"
      autoplay
    >
      <source :src="media.src" :mime="media.mime" />
    </audio>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  toRefs,
  watch,
  watchEffect,
} from 'vue';

import { getFormats, getInfo } from "@/api/main/player";
import { env } from '@/env';
import { getMidItem } from '@/helpers/functions/getMidItem';
import { asyncComputed } from '@/helpers/hooks/asyncComputed';
import Icon from '@/components/Icon/Icon.vue';

export default defineComponent({
  components: { Icon },
  props: {
    code: String,
    margin: String,
  },
  setup(props, { emit }) {
    const { code } = toRefs(props);

    const doubleClickThreshold = 220;
    let prevTimestamp = 0;
    let pauseRequest: null | number = null;

    const isPlaying = ref(true);
    const audio = ref<HTMLAudioElement>();
    const progress = ref(0);
    const lastProgressChange = ref<null | number>(null);
    const playTouched = ref(false);

    const formattedLastProgress = computed(() => {
      if (!lastProgressChange.value) return null;

      const h = Math.floor(lastProgressChange.value / 3600);
      const m = Math.floor(((lastProgressChange.value % 3600) / 60));
      const s = Math.floor(lastProgressChange.value % 60);

      const formatted = [h, m, s].filter((item) => item >= 1).map((item, index) => {
        if (index === 0) return item;
        if ((item + "").length === 2) return item;
        return "0" + item;
      }).join(":");

      return formatted.length > 2 ? formatted : formatted + " s";
    });

    const [, media] = asyncComputed((status) => {
      if (!code.value) return "EXIT";

      return getFormats(code.value, "audio")
        .then((formats) => {
          if (!status.isActive) return "EXIT";
          const url = new URL(`/player/${code.value}/`, env.MAIN_API);

          const midFormat = getMidItem(formats);

          url.searchParams.set("itag", midFormat.itag + "");
          return {
            src: url.toString(),
            mime: midFormat.mime,
          };
        });
    });

    const [, info] = asyncComputed(() => {
      if (!code.value) return "EXIT";
      return getInfo(code.value);
    });

    watchEffect(() => {
      if (!audio.value) return;
      if (isPlaying.value) audio.value.play();
      else audio.value.pause();
    });

    watch(isPlaying, (value) => {
      if (!value) playTouched.value = true;
    });

    // reset and autoplay for dynamic video code
    watch([media, audio], () => {
      if (!audio.value || !media.value) return;
      isPlaying.value = true;
      playTouched.value = false;
      progress.value = 0;
      lastProgressChange.value = null;
    });

    return {
      media,
      audio,
      isPlaying,
      info,
      getMidItem,
      progress,
      formattedLastProgress,
      playTouched,
      handleProgress: (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!audio.value) return;

        const lineWidth = +getComputedStyle(e.target as HTMLDivElement).width.slice(0, -2);
        const nextProgress = e.offsetX / lineWidth;
        const nextTime = nextProgress * audio.value.duration;
        audio.value.currentTime = nextTime;
        lastProgressChange.value = nextTime;
      },
      interact: (e: MouseEvent) => {
        if (!audio.value) return;
        const diff = e.timeStamp - prevTimestamp;
        prevTimestamp = e.timeStamp;
        if (diff < doubleClickThreshold) {
          if (pauseRequest) clearTimeout(pauseRequest);

          const width = e.offsetX
            / +getComputedStyle(e.target as HTMLDivElement).width.slice(0, -2);

          if (width > 0.5) {
            audio.value.currentTime += 10;
          } else {
            audio.value.currentTime -= 10;
          }
          lastProgressChange.value = audio.value.currentTime;
        } else {
          pauseRequest = setTimeout(() => {
            isPlaying.value = !isPlaying.value;
          }, doubleClickThreshold);
        }
      },
      ended: () => {
        emit('ended');
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.player {
  &__root {
    width: 100%;

    border: 1px dashed black;

    position: relative;

    &::after {
      content: "";
      display: block;

      padding-bottom: 55%;
    }
  }
  &__display {
    position: absolute;
    top: 5px;
    left: 5px;

    width: calc(100% - 10px);
    height: calc(100% - 10px);

    background-position: center center;
    background-size: cover;

    border: 1px solid black;

    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
  }
  &__container {
    position: relative;
    width: 100%;
    height: 100%;
  }
  &__title {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;

    font-size: 20px;
    line-height: 30px;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;

    overflow: hidden;

    padding: 0 20px;

    background: rgba($color: #fff, $alpha: .7);

    border-bottom: 1px solid #000;
  }
  &__buttons {
    position: absolute;
    top: calc(50% - 30px);
    left: calc(50% - 100px);

    height: 60px;
    width: 200px;

    display: flex;
    align-items: center;
    justify-content: space-between;

  }
  &__button {
    width: 60px;
    height: 60px;

    border-radius: 50%;

    background: rgba($color: #fff, $alpha: .7);

    border: 1px solid black;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__status-bg {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background: rgb(255,255,255);
    background: radial-gradient(circle, rgba(#fff, .7) 0%, rgba(#fff, 0) 100%);

    animation: player__ping .5s forwards;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__progress {
    position: absolute;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 30px;

    background: rgba(#fff, .7);

    border-top: 1px solid #000;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0 20px;
  }
  &__line {
    width: 100%;
    height: 2px;

    background: #000;

    position: relative;
  }
  &__dot {
    position: absolute;
    top: -4px;

    width: 10px;
    height: 10px;

    background: #fff;

    border: 2px solid black;
    border-radius: 50%;
  }
  &__time {
    font-size: 30px;
    user-select: none;
  }
}

@keyframes player__ping {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
