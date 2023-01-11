<template>
  <div
    v-touch:swipe.left="nextPage"
    v-touch:swipe.right="prevPage"
    class="pages__root"
  >
    <Menu @itemSelect="handleMenu">
      <contents :items="content" @select="(index) => currentIndex = index" />

      <slot></slot>

      <template #items>
        <menu-item
          v-for="(shortcut, index) of shortcuts"
          :key="index" :name="shortcut.name"
          :value="shortcut.value"
        >
          <Icon
            v-if="shortcut.icon"
            :style="{ 
              transform: 'scale(.7)', 
              marginLeft: shortcut.leftShift ? shortcut.leftShift : -3 
            }"
            :name="shortcut.icon"
          />
          <span v-else>
            {{ shortcut.name[0] }}
          </span>
        </menu-item>
      </template>
    </Menu>
  </div>
  <!-- TODO: remove this shit with desktop version -->
  <div class="pages__buttons">
    <Button @click="nextPage">
      Next page
    </Button>
    <Button style="margin-bottom: 20px" @click="prevPage">
      Prev page
    </Button>
    <Button v-for="item of shortcuts" :key="item.name" @click="handleMenu(item.value)">
      {{ item.name }}
    </Button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, provide, ref, watch,
} from 'vue';

import { Name } from '@/components/Icon/Icon.model';
import Icon from '@/components/Icon/Icon.vue';
import Button from '@/components/Button.vue';

import Contents from './components/Contents.vue';
import Menu from './components/Menu.vue';
import MenuItem from './components/MenuItem.vue';
import { PagesAPIKey } from "./providers/Pages.provider";

export default defineComponent({
  components: {
    Menu,
    MenuItem,
    Contents,
    Icon,
    Button,
  },
  setup() {
    let ID = 0;

    const idMap = new Map<string, number | string>();
    const nameIdMap = new Map<string, number | string>();

    const currentIndex = ref<number | string>(1);
    const shortcuts = ref<Array<{ 
      name: string, 
      icon?: Name, 
      value: string | number, 
      leftShift?: number 
    }>>([]);
    const content = ref(new Array<{ label: string, index: number }>());
    const pagePayload = ref<any>(null);

    const prevNumericIndex = ref<number | null>(null);

    watch(currentIndex, (_, prevValue) => {
      if (typeof prevValue === "number") prevNumericIndex.value = prevValue;
    });

    provide(PagesAPIKey, {
      register: (id, options) => {
        if (!idMap.has(id)) {
          const currentID = options?.hidden ? id : ID++;

          idMap.set(id, currentID);

          if (options?.name) {
            nameIdMap.set(options.name, currentID);
          }
          if (typeof currentID === "number" && options?.name) {
            content.value.push({ label: options.name, index: currentID });
          }

          if (options?.shortcut && options?.name) {
            shortcuts.value.push({
              name: options.name,
              icon: options.shortcutIcon,
              value: currentID,
              leftShift: options.leftShift,
            });
          }
        }

        return idMap.get(id) ?? 0;
      },
      currentIndex,
      goToPage: (pageName: string, payload?: any) => {
        const pageId = nameIdMap.get(pageName);
        if (!pageId) return;
        if (payload) {
          pagePayload.value = payload;
        } else {
          pagePayload.value = null;
        }
        currentIndex.value = pageId;
      },
      pagePayload,
    });
    return {
      nextPage: () => {
        if (typeof currentIndex.value === "string") currentIndex.value = prevNumericIndex.value ?? 0;
        else if (currentIndex.value < ID - 1) currentIndex.value++;
      },
      prevPage: () => {
        if (typeof currentIndex.value === "string") currentIndex.value = prevNumericIndex.value ?? 0;
        else if (currentIndex.value > 0) currentIndex.value--;
      },
      shortcuts,
      handleMenu: (id: string | number) => {
        currentIndex.value = id;
      },
      content,
      currentIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.pages {
  &__root {
    min-height: 100%;

    max-width: 100%;

    overflow: hidden;

    position: relative;
  }
  &__buttons {
    position: fixed;
    left: 0;
    top: 0;

    width: 200px;

    @media screen and (max-width: 525px) {
      display: none;
    }
  }
}
</style>
