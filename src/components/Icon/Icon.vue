<template>
  <list v-if="name === 'list'" :style="style" :className="className" />
  <back v-else-if="name === 'back'" :style="style" :className="className" />
  <next v-else-if="name === 'next'" :style="style" :className="className" />
  <pause v-else-if="name === 'pause'" :style="style" :className="className" />
  <play v-else-if="name === 'play'" :style="style" :className="className" />
  <search v-else-if="name === 'search'" :style="style" :className="className" />
  <loading v-else-if="name === 'loading'" :style="style" :className="className" />
</template>

<script lang="ts">
import { CSSProperties, defineComponent, PropType } from "vue";

import { Name } from "./Icon.model";
import List from "./List.icon.vue";
import Play from "./Play.icon.vue";
import Next from "./Next.icon.vue";
import Back from "./Back.icon.vue";
import Pause from "./Pause.icon.vue";
import Search from "./Search.icon.vue";
import Loading from "./Loading.icon.vue";

export default defineComponent({
  components: {
    List, Play, Next, Back, Pause, Search, Loading,
  },
  props: {
    name: {
      type: String as PropType<Name>,
      required: true,
    },
    className: String,
    style: Object as PropType<CSSProperties>,
  },
});
</script>
