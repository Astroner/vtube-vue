<template>
  <div class="dots__root">
    <span :class="['dots__dot', counter > 0 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
    <span :class="['dots__dot', counter > 1 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
    <span :class="['dots__dot', counter > 2 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, onUnmounted, ref,
} from "vue";

export default defineComponent({
  setup() {
    const counter = ref(0);
    const interval = ref<null | number>(null);

    onMounted(() => {
      interval.value = setInterval(() => {
        counter.value = (counter.value + 1) % 4;
      }, 300);
    });
    
    onUnmounted(() => {
      if (interval.value) {
        clearInterval(interval.value);
      }
    });

    return {
      counter,
    };
  },
});
</script>

<style lang="scss" scoped>
.dots {
  &__root {
    width: 100%;

    display: flex;
    justify-content: center;
  }
  &__dot {
    transition: opacity .3s;

    font-size: 30px;
    line-height: 5px;

    &--visible {
      opacity: 1;
    }

    &--hidden {
      opacity: 0;
    }
  }
}
</style>
