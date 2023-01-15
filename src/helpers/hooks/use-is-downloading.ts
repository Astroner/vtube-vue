import { computed, Ref } from "vue";

import { musicStorage } from "@/music-storage";
import { useDBObservable } from "./use-db-observable";

export const useIsDownloading = (code: Ref<string>) => {
    const queue = useDBObservable(musicStorage.queue);

    return computed(() => !!queue.value?.find((item) => item === code.value));
};
