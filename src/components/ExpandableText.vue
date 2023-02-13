<template>
    <div class="expandable__root">
        {{ short }}
        <span
            v-if="expandable"
            style="color: rgba(62, 62, 62, .5)"
            @click.stop="expanded = true"
        >
            more
        </span>
        <click-away-listener
            v-if="expandable"
            :class="{
                expandable__full: true,
                'expandable__full--visible': expanded,
                'expandable__full--hidden': !expanded,
            }"
            @click-away="expanded = false"
        >
            {{ text }}
            <div
                style="color: rgba(62, 62, 62, .5); margin-top: 5px; text-align: center;"
                @click="expanded = false"
            >
                Hide
            </div>
        </click-away-listener>
    </div>
</template>

<script lang="ts">
import {
    computed, defineComponent, ref, toRefs,
} from "vue";
import ClickAwayListener from "./ClickAwayListener.vue";

export default defineComponent({
  components: { ClickAwayListener },
    props: {
        text: {
            type: String,
            required: true,
        },
        limit: {
            type: Number,
            default: 100,
        },
    },
    setup(props) {
        const { limit, text } = toRefs(props);

        const expanded = ref(false);

        const short = computed(() => text.value.length > limit.value ? text.value.slice(0, limit.value) + '...' : text.value);

        const expandable = computed(() => text.value.length > limit.value);

        return {
            expandable,
            short,
            expanded,
        };
    },
});
</script>

<style lang="scss" scoped>
.expandable {
    &__root {
        margin-top: 10px;

        font-size: 20px;
        line-height: 24px;

        position: relative;
    }
    &__full {
        position: absolute;
        top: 0;
        left: 0;

        padding: 5px;

        width: 100%;

        transition: opacity .3s, box-shadow .3s, transform .3s;

        background-color: #fff;

        border: 1px solid black;

        box-shadow: 0 0 10px rgba($color: #000000, $alpha: .5);

        z-index: 1;

        &--hidden {
            opacity: 0;

            pointer-events: none;

            transform: translate(40px, 70px) rotate(-5deg) scale(1.05);
        }

        &--visible {
            opacity: 1;

            transform: translate(0, 0) rotate(0) scale(1);
        }
    }
}
</style>
