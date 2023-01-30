<template>
  <display-playlist :title="title" :display="display" />
</template>

<script lang="ts">
import {
 defineComponent, toRefs, computed, watch, 
} from 'vue';

import { ObjectURL } from '@/helpers/classes/object-url.class';

import DisplayPlaylist from './DisplayPlaylist.vue';

export default defineComponent({
    components: { DisplayPlaylist },
    props: {
        title: {
            required: true,
            type: String,
        },
        thumbnail: {
            required: true,
            type: Blob,
        },
    },
    setup(props) {
        const { thumbnail } = toRefs(props);

        const url = computed(() => new ObjectURL(thumbnail.value));

        const display = computed(() => [{
            url: url.value.url,
            height: 0,
            width: 0,
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
