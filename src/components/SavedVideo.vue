<template>
  <display-video :code="code" :title="title" :display="display" :active="active">
    <slot></slot>
  </display-video>
</template>

<script>
import { toRefs, computed, watch } from 'vue';
import DisplayVideo from './DisplayVideo.vue';

export default {
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

        const display = computed(() => [{
            url: URL.createObjectURL(thumbnail.value),
            width: 0,
            height: 0,
        }]);

        watch(display, (url, _, onCleanup) => {
            onCleanup(() => {
                URL.revokeObjectURL(url[0].url);
            });
        });

        return {
            display,
        };
    },
};
</script>
