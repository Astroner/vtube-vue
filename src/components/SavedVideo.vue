<template>
  <display-video :code="code" :title="title" :display="display" :active="active">
    <slot></slot>
  </display-video>
</template>

<script lang="ts">
import {
    toRefs,
    computed,
    watch,
    defineComponent,
} from 'vue';

import { ObjectURL } from '@/helpers/classes/object-url.class';

import DisplayVideo from './DisplayVideo.vue';

export default defineComponent({
    components: { DisplayVideo },
    props: {
        code: {
            required: true,
            type: String,
        },
        title: {
            required: true,
            type: String,
        },
        thumbnail: {
            required: true,
            type: Blob,
        },
        active: Boolean,
    },
    setup(props) {
        const { thumbnail } = toRefs(props);

        const url = computed(() => new ObjectURL(thumbnail.value));

        const display = computed(() => [{
            url: url.value.url,
            width: 0,
            height: 0,
        }]);

        watch(url, (urlValue, _, onCleanup) => {
            onCleanup(() => {
                urlValue.destroy();
            });
        }, { immediate: true });

        return {
            display,
        };
    },
});
</script>
