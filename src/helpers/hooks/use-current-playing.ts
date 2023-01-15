import { useStore } from "@/store";
import { QueueItem } from "@/store/modules/modules";
import { computed } from "vue";

export const useCurrentPlying = () => {
    const store = useStore();

    return computed<QueueItem | null>(
        () => store.state.queue.items[store.state.queue.cursor] ?? null,
    );
};
