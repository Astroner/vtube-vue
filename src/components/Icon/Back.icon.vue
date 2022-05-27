<template>
    <svg :style="style" :class="className" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M32.75 44 12.75 24 32.75 4 35.55 6.85 18.4 24 35.55 41.15Z"/></svg>
</template>

<script lang="ts">
import { defineComponent, CSSProperties, PropType } from 'vue';

export default defineComponent({
  props: {
    style: Object as PropType<CSSProperties>,
    className: String,
  },
});
</script>
