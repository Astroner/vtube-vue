<template>
    <div ref="el"></div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";

export default defineComponent({
    emits: ["continue"],
    setup(_, { emit }) {
        const el = ref<HTMLDivElement>();

        watchEffect((onCleanup) => {
            if (!el.value) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        emit("continue");
                    }
                },
            );
            observer.observe(el.value);
            onCleanup(() => observer.disconnect());
        });

        return {
            el,
        };
    },
});
</script>
