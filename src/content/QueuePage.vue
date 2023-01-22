<template>
    <page hidden name="Queue" title="Downloads Queue" @enter="enter" @leave="leave">
        <heading v-if="queueState.length > 0">
            {{ queueState.length }} items to download
        </heading>
        <div 
            v-if="items.length > 0"
            style="padding: 5px; border: 1px dashed black"
        >
            <display-video-code
                v-for="item of items"
                :key="item.code"
                :code="item.code"
                :active="item.status === 'DOWNLOADING'"
            />
            <continue @continue="more" />
        </div>
        <heading v-else-if="isOpen" secondary center>
            Empty
        </heading>
    </page>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Page from "@/Pages/components/Page.vue";
import { useDownloadsQueue } from "@/helpers/hooks/use-downloads-queue";
import Heading from "@/components/Heading.vue";
import DisplayVideoCode from "@/components/DisplayVideoCode.vue";
import Continue from "@/components/Continue.vue";

export default defineComponent({
    components: {
        Page,
        Heading,
        DisplayVideoCode,
        Continue,
    },
    setup() {
        const isOpen = ref(false);

        const queueState = useDownloadsQueue();

        const limit = ref(10);

        const items = computed(() => queueState.value.slice(0, limit.value));

        return {
            items,
            isOpen,
            queueState,
            enter() {
                isOpen.value = true;
                limit.value = 10;
            },
            leave() {
                isOpen.value = false;
                limit.value = 0;
            },
            more() {
                limit.value += 10;
            },
        };
    },
});
</script>
