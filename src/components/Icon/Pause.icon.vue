<template>
    <svg :style="style" :class="className" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M28.25 38V10H36V38ZM12 38V10H19.75V38Z"/></svg>
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
