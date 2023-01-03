<template>
    <div
        :class="{
            'video': true,
            'video--active': active,
            'video--default': !active,
        }"
    >
        <display-image
            :display="display"
            width="25%"
            height="calc(100% - 15px)"
            margin="7px 10px 0px 5px"
        />
        {{ title }}
    </div>
</template>

<script lang="ts">
import { YTImage } from "@/Responses";
import { PropType } from "vue";
import DisplayImage from './DisplayImage.vue';

export default {
  components: { DisplayImage },
    props: {
        display: {
            type: Array as PropType<YTImage[]>,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        active: Boolean,
    },
};
</script>

<style lang="scss" scoped>
.video {
    border: 1px solid black;

    font-size: 20px;
    line-height: 24px;

    height: 72px;
    width: 100%;

    display: flex;

    transition: color .5s, background-color .5s;

    &--active {
        background-color: black;

        color: white;
    }

    &--default {
        background-color: white;

        color: black;
    }

    &:not(:last-child) {
      margin-bottom: 5px;
    }
}
</style>
