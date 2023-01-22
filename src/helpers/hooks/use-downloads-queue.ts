import { musicStorage } from "@/music-storage";
import { ref, watchEffect } from "vue";

export const useDownloadsQueue = () => {
    const state = ref(musicStorage.downloadQueue.getQueueState());

    watchEffect((onCleanup) => {
        const sub = musicStorage.downloadQueue.subscribe((next) => {
            state.value = next;
        });

        onCleanup(() => sub.unsubscribe());
    });

    return state;
};
