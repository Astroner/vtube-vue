<template>
  <display-playlist :title="title" :display="display" />
</template>

<script lang="ts">
import {
 defineComponent, toRefs, computed, watch, 
} from 'vue';
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

        const display = computed(() => [{
            url: URL.createObjectURL(thumbnail.value),
            width: 0,
            height: 0,
        }]);

        watch(display, (url, _, onCleanup) => {
            onCleanup(() => {
                URL.revokeObjectURL(url[0].url);
            });
        }, { immediate: true });

        return {
            display,
        };
    },
});
</script>
