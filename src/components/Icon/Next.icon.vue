<template>
    <svg :style="style" :class="className" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M15.2 43.9 12.4 41.05 29.55 23.9 12.4 6.75 15.2 3.9 35.2 23.9Z"/></svg>
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
