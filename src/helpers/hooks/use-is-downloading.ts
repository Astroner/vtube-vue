import { musicStorage } from "@/music-storage";
import { Ref, ref, watch } from "vue";

export const useIsDownloading = (code: Ref<string>) => {
    const status = ref(false);

    watch(code, (value, _, onCleanup) => {
        musicStorage.queue.getValue()
            .then((queue) => {
                status.value = queue.includes(value);
            });

        const sub = musicStorage.queue.subscribe((next) => {
            status.value = next.includes(value);
        });

        onCleanup(() => sub.unsubscribe());
    }, { immediate: true });

    return status;
};
