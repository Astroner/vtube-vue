<template>
  <div
    :style="
      typeof pageIndex === 'number'
        ? { zIndex: pageIndex + 1, width: `calc(100% - ${pageIndex * 2}px)` }
        : { width: '100%' }
    "
    :class="{ root: true, visible: isVisible, hidden: !isVisible, [className]: !!className }"
  >
    <Header />
    <h2 v-if="typeof title === 'string' || (!!title && name)">
      {{ typeof title === "string" ? title : name }}
    </h2>
    <slot />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  PropType,
} from "vue";

import { uuid } from "@/helpers/functions/uuid";
import Header from "@/components/Header.vue";
import { Name } from "@/components/Icon/Icon.model";

import { PagesAPIKey, PagesAPIDefault } from '../providers/Pages.provider';

export default defineComponent({
  components: { Header },
  props: {
    name: String,
    hidden: Boolean,
    shortcut: Boolean,
    shortcutIcon: String as PropType<Name>,
    title: [Boolean, String],
    className: String,
  },
  setup(props) {
    const pagesAPI = inject(PagesAPIKey, PagesAPIDefault);

    const id = uuid();
    const pageIndex = pagesAPI.register(id, {
      shortcut: props.shortcut,
      shortcutIcon: props.shortcutIcon,
      hidden: props.hidden,
      name: props.name,
    });

    const isActive = computed(() => pageIndex === pagesAPI.currentIndex.value);
    const isVisible = computed(() => {
      if (typeof pageIndex === "string") return pageIndex === pagesAPI.currentIndex.value;
      return pageIndex <= pagesAPI.currentIndex.value;
    });

    return {
      isActive,
      pageIndex,
      isVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.root {
  position: absolute;

  height: 100vh;

  background-color: #fff;

  border: 1px solid black;

  transition: right .4s, top .4s;

  padding: 10px;

  overflow-y: auto;
}

.visible {
  right: 0;
  top: 0;
}

.hidden {
  right: -100%;
  top: 50px;
}

h2 {
  font-size: 35px;
  text-align: center;

  margin: 10px 0 20px;
}
</style>
