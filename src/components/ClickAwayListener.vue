<template>
    <div ref="elRef">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";

export default defineComponent({
  emits: ['click-away'],
  setup(_, { emit }) {
    const elRef = ref<HTMLDivElement>();

    watchEffect((onCleanup) => {
        if (!elRef.value) return;
        const el = elRef.value;
        const handler = (e: MouseEvent) => {
            if (!el.contains(e.target as any)) {
                emit('click-away');
            }
        };

        document.addEventListener('click', handler);
        onCleanup(() => {
            document.removeEventListener('click', handler);
        });
    });

    return {
        elRef,
    };
  },
});
</script>
