<template>
  <div class="display-channel__root">
    <display-image 
        class="display-channel__avatar"
        :display="display"
    />
    <div class="display-channel__text">
        <div class="display-channel__username">
            {{ username }}
        </div>
        <div v-if="tag" class="display-channel__tag">
            {{ tag }}
        </div>
        <div v-if="description" class="display-channel__description">
            {{ description }}
        </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { YTImage } from "@dogonis/vtube-client";

import DisplayImage from "@/components/DisplayImage.vue";

export default defineComponent({
  components: { DisplayImage },
    props: {
        display: {
            type: Array as PropType<YTImage[]>,
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        description: String,
        tag: String,
    },
});
</script>

<style lang="scss" scoped>
.display-channel {
    &__root {
        border: 1px solid black;

        padding: 5px;

        display: flex;
        align-items: flex-start;

        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }
    &__avatar {
        min-width: 25%;
        max-width: 25%;

        border-radius: 50%;

        &::after {
            content: "";
            display: block;
            padding-bottom: 100%;
        }
    }
    &__text {
        margin-left: 10px;
        
        flex-grow: 1;
        overflow: hidden;
    }
    &__username {
        font-size: 26px;
        line-height: 26px;
    }
    &__tag {
        font-size: 20px;
        line-height: 20px;
        color: rgba($color: #3e3e3e, $alpha: 0.5);
    }
    &__description {
        width: 100%;
        
        margin-top: 15px;
    }
}
</style>
