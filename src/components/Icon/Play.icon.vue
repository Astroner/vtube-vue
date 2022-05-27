<template>
    <svg :style="style" :class="className" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M16 37.85V9.85L38 23.85ZM19 23.85ZM19 32.4 32.45 23.85 19 15.3Z"/></svg>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    style: Object as PropType<CSSProperties>,
    className: String,
  },
});
</script>

<style lang="scss" scoped>

</style>
