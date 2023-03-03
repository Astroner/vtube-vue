<template>
  <display-video 
    disable-menu
    :active="active"
    :code="code"
    :title="info?.title ?? ''"
    :display="info?.display ?? []"
  />
</template>

<script lang="ts">
import { getInfo } from "@/api/main/player";
import { asyncComputed } from "@/helpers/hooks/asyncComputed";
import { defineComponent, toRef } from "vue";
import DisplayVideo from "./DisplayVideo.vue";

export default defineComponent({
    components: { DisplayVideo },
    props: {
        code: {
            type: String,
            required: true,
        },
        active: Boolean,
    },
    setup(props) {
        const code = toRef(props, "code");

        const [, info] = asyncComputed(() => getInfo(code.value));

        return {
            info,
        };
    },
});
</script>
