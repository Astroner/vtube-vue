<template>
    <page name="Table of content" shortcut shortcutIcon="list" title="Table of content">
      <div>
        <div
          class="item"
          v-for="item of items"
          :key="item.index"
          @click="() => handleSelect(item.index)"
        >
          <div>
            {{ item.label }}
          </div>
          <div class="line" />
          <div>
            {{ item.index + 1 }}
          </div>
        </div>
      </div>
    </page>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import Page from "./Page.vue";

export default defineComponent({
  components: { Page },
  props: {
    items: {
      type: Array as PropType<Array<{
        label: string,
        index: number,
      }>>,
      default: () => [],
    },
  },
  methods: {
    handleSelect(index: number) {
      this.$emit("select", index);
    },
  },
});
</script>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: flex-end;

  font-size: 20px;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
}
.line {
  flex-grow: 1;

  border-bottom: 1px dashed #000;
}
</style>
