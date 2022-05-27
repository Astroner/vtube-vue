<template>
  <span>
    <span :class="['dots__dot', counter > 0 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
    <span :class="['dots__dot', counter > 1 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
    <span :class="['dots__dot', counter > 2 ? 'dots__dot--visible' : 'dots__dot--hidden']">.</span>
  </span>
</template>

<script lang="ts">
import {
  defineComponent, onMounted, ref, toRefs, watchEffect,
} from "vue";

export default defineComponent({
  props: {
    active: Boolean,
  },
  setup(props) {
    const { active } = toRefs(props);

    const counter = ref(0);
    const interval = ref<null | number>(null);

    onMounted(() => {
      interval.value = setInterval(() => {
        counter.value = (counter.value + 1) % 4;
      }, 300);
    });

    watchEffect(() => {
      if (active.value) return;
      if (interval.value) clearInterval(interval.value);
      counter.value = 4;
    });

    return {
      counter,
    };
  },
});
</script>

<style lang="scss" scoped>
.dots {
  &__dot {
    transition: opacity .3s;

    &--visible {
      opacity: 1;
    }

    &--hidden {
      opacity: 0;
    }
  }
}
</style>
