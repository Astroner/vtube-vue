import { ref, watchEffect } from "vue";
import { musicStorage } from ".";
import { SavedVideo } from "./music-storage.model";

export const useSaved = () => {
    const value = ref<null | SavedVideo[]>(null);

    watchEffect((onCleanup) => {
        let mounted = true;

        musicStorage.getAllSaved()
            .then((val) => {
                if (!mounted) return;
                value.value = val;
            });
        
        onCleanup(() => {
            mounted = false;
        });
    });

    watchEffect((onCleanup) => {
        const sub = musicStorage.all.subscribe((next) => {
            value.value = next;
        });

        onCleanup(() => sub.unsubscribe());
    });

    return value;
};
