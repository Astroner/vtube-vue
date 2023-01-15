<template>
    <div
        class="playlist__root"
        :style="{ backgroundImage: `url(${url})` }"
    >
        <div class="playlist__title">
            {{ title }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { YTImage } from '@/Responses';
import { getMidItem } from '@/helpers/functions/getMidItem';

export default defineComponent({
    props: {
        title: {
            required: true,
            type: String,
        },
        display: {
            required: true,
            type: Array as PropType<Array<YTImage>>,
        },
    },
    computed: {
        url() {
            return getMidItem(this.display).url;
        },
    },
});
</script>

<style lang="scss" scoped>
.playlist {
    &__root {
        height: 72px;

        border: 1px solid black;

        font-size: 20px;
        line-height: 24px;

        background-position: center center;
        background-size: cover;

        position: relative;

        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }
    &__title {
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 100%;

        background-color: rgba($color: #fff, $alpha: .4);

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 25px;
    }
}
</style>
