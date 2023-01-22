<template>
  <div
    ref="el"
    :style="{
      minWidth: width,
      maxWidth: width,
      height: height,
      backgroundImage: url && `url(${url})`,
      margin: margin,
    }"
    class="display-image__root"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { YTImage } from "@/Responses";
import {
  computed,
  defineComponent,
  PropType,
  ref,
  toRefs,
} from "vue";

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
  setup(props) {
    const { display } = toRefs(props);

    const el = ref<HTMLDivElement>();
    const url = computed<string | undefined>(() => {
      if (!el.value) return undefined;

      const rect = el.value.getBoundingClientRect();
      
      const rectSize = rect.width * rect.height;
      
      for (const [index, image] of display.value.entries()) {
        const imageSize = image.width * image.height;

        const diff = Math.abs(imageSize - rectSize);

        if (diff / rectSize < 0.2) {
          return image.url;
        }
        if (index === display.value.length - 1) {
          return image.url;
        }
      }
      return undefined;
    });

    return {
      el,
      url,
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
