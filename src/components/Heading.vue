<template>
    <h2 
        :class="{
            heading__root: true,
            heading__center: center,
            heading__secondary: secondary,
        }"
    >
        <slot></slot>
    </h2>
</template>

<script lang="ts">
export default {
    props: {
        secondary: Boolean,
        center: Boolean,
    },
};
</script>

<style lang="scss">
.heading {
    &__root {
        font-size: 30px;
    }
    &__secondary {
        color: rgba($color: #3e3e3e, $alpha: 0.5);
    }
    &__center {
        text-align: center;
    }
}
</style>
