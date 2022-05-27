<template>
  <div
    class="item__root"
    :style="{
      left: `calc(50% + ${position.x - 20}px)`,
      top: `calc(50% + ${position.y - 20}px)`,
    }"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { MenuAPIKey, MenuAPIKeyDefaultValue } from "../providers/Menu.provider";

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
  setup(props) {
    const api = inject(MenuAPIKey, MenuAPIKeyDefaultValue);
    const index = api.register(props.value, props.name);

    const position = computed(() => api.calcPosition(index, api.total.value));

    const isSelected = computed(() => api.currentItem.value === index);

    return {
      position,
      isSelected,
    };
  },
});
</script>

<style lang="scss" scoped>
.item {
  &__root {
    position: absolute;

    width: 40px;
    height: 40px;

    background-color: #fff;

    border-radius: 50%;
    border: 1px solid black;

    display: flex;
    align-items: center;
    justify-content: center;

    animation: item__pop .3s linear .3s;

    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
  }
}

@keyframes item__pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
