<template>
  <div
    v-touch:hold="initMenu"
    v-touch:release="hideMenu"
    v-touch:drag.once="touchMove"
  >
    <slot />
    <div
      v-if="menuCoordinates"
      class="menu__root"
      :style="{ left:`${menuCoordinates.x - 30}px`, top: `${menuCoordinates.y - 30}px` }"
    >
      <div class="menu__container">
        <div
          class="menu__center"
          :style="{ transform: `translate(${centerShift.x}px, ${centerShift.y}px)` }"
        >
          <div style="width: 100%; height: 100%; position: relative;">
            <div class="menu__label" v-if="displayLabel">
              {{ displayLabel }}
            </div>
          </div>
        </div>
        <slot name="items" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  ref,
} from "vue";

import { clamp } from "@/helpers/functions/clamp";

import { MenuAPIKey } from "../providers/Menu.provider";

export default defineComponent({
  props: {
    range: {
      type: Number,
      default: 100,
    },
    salve: {
      type: Number,
      default: Math.PI / 4,
    },
    allowedIndexRange: {
      type: Number,
      default: 0.2,
    },
    activationThreshold: {
      type: Number,
      default: 0.3,
    },
  },
  setup(props, { emit }) {
    const indexMap = new Map<string | number, number>();
    const indexItemMap = new Map<number, { label: string, value: string | number }>();

    const total = ref(0);
    const menuCoordinates = ref<null | { x: number, y: number }>(null);
    const moveCoordinates = ref<null | { x: number, y: number }>(null);

    const diffs = computed(() => {
      if (!moveCoordinates.value || !menuCoordinates.value) return null;
      return {
        x: moveCoordinates.value.x - menuCoordinates.value.x,
        y: moveCoordinates.value.y - menuCoordinates.value.y,
      };
    });

    const centerShift = computed(() => {
      if (!diffs.value) {
        return {
          x: 0,
          y: 0,
        };
      }

      const normalizedX = clamp(-1, diffs.value.x / props.range, 1);
      const normalizedY = clamp(-1, diffs.value.y / props.range, 1);

      return {
        x: normalizedX * 30,
        y: normalizedY * 30,
      };
    });

    const currentItem = computed(() => {
      if (!diffs.value) return null;

      const { x: xDiff, y: yDiff } = diffs.value;

      const progress = Math.sqrt(xDiff ** 2 + yDiff ** 2) / props.range;

      if (progress < props.activationThreshold) return null;

      const atan = Math.atan2(yDiff, xDiff);

      const shift = ((total.value - 1) * props.salve) / 2;

      const angle = (yDiff < 0 ? atan + Math.PI : atan - Math.PI);

      const firstItemAngle = -shift + Math.PI / 2;

      const normalizedAngle = angle - firstItemAngle;

      const index = normalizedAngle / props.salve;
      const roundedIndex = Math.round(index);

      if (Math.abs(roundedIndex - index) > props.allowedIndexRange) return null;

      return roundedIndex;
    });

    const displayLabel = computed(() => {
      if (currentItem.value === null) return null;

      return indexItemMap.get(currentItem.value)?.label;
    });

    provide(MenuAPIKey, {
      currentItem,
      total,
      register: (value, label) => {
        if (!indexMap.has(value)) {
          const current = total.value++;
          indexItemMap.set(current, { label, value });
          indexMap.set(value, current);
        }

        return indexMap.get(value) ?? 0;
      },
      calcPosition: (index: number, totalItems: number) => {
        const shift = ((totalItems - 1) * props.salve) / 2;
        const angle = props.salve * index;

        return {
          x: props.range * Math.cos(angle - Math.PI / 2 - shift),
          y: props.range * Math.sin(angle - Math.PI / 2 - shift),
        };
      },
    });

    return {
      centerShift,
      displayLabel,
      menuCoordinates,
      moveCoordinates,
      initMenu: (e: TouchEvent) => {
        if (!e.touches) return;
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;

        const nX = x / window.innerWidth;
        const nY = y / window.innerHeight;

        if (nX > 0.2 && nX < 0.8 && nY > 0.5 && nY < 0.9) {
          menuCoordinates.value = {
            x, y,
          };
        }
      },
      hideMenu: () => {
        if (currentItem.value !== null) {
          const item = indexItemMap.get(currentItem.value);
          if (item) emit("itemSelect", item.value);
        }
        moveCoordinates.value = null;
        menuCoordinates.value = null;
      },
      touchMove: (e: TouchEvent) => {
        moveCoordinates.value = {
          x: e.changedTouches[0].pageX,
          y: e.changedTouches[0].pageY,
        };
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.menu {
  &__root {
    position: fixed;

    width: 60px;
    height: 60px;

    animation: pages__pop-in .4s ease-out forwards;

    z-index: 40;
  }

  &__container {
    width: 100%;
    height: 100%;

    position: relative;
  }

  &__center {
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: #fff;

    border: 1px dashed black;

    border-radius: 50%;

    transition: transform .3s;

    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
  }
  &__label {
    position: absolute;
    top: calc(100% + 10px);
    left: calc(50% - 100px);

    width: 200px;

    font-size: 30px;
    text-align: center;

    animation: pages__pop-in .2s ease-out forwards;

    background: rgb(255,255,255);
    background: radial-gradient(circle, rgba(#fff, .5) 0%, rgba(#fff, 0) 100%);
  }
}

@keyframes pages__pop-in {
  from {
    opacity: 0;

    transform: scale(0);
  }

  to {
    opacity: 1;

    transform: scale(1);
  }
}
</style>
