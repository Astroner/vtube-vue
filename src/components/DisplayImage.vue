<template>
  <div
    :style="{
      minWidth: width,
      maxWidth: width,
      height: height,
      backgroundImage: `url(${getMidItem(display).url})`,
      margin: margin,
    }"
    class="display-image__root"
  >

  </div>
</template>

<script lang="ts">
import { YTImage } from "@/Responses";
import { defineComponent, PropType } from "vue";
import { getMidItem } from "@/helpers/functions/getMidItem";

export default defineComponent({
  props: {
    display: {
      type: Array as PropType<YTImage[]>,
      required: true,
      default: () => [],
    },
    height: String,
    width: String,
    margin: String,
  },
  setup() {
    return {
      getMidItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.display-image__root {
    background-position: center center;
    background-size: cover;

    border: 1px solid black;

    box-shadow: 0 0 10px rgba($color: #000000, $alpha: .3);
}
</style>
