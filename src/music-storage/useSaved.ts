import { ref, watchEffect } from "vue";
import { getAllSaved, SavedVideo, subscribe } from ".";

export const useSaved = () => {
    const value = ref<null | SavedVideo[]>(null);

    watchEffect((onCleanup) => {
        let mounted = true;

        getAllSaved()
            .then((val) => {
                if (!mounted) return;
                value.value = val;
            });
        
        onCleanup(() => {
            mounted = false;
        });
    });

    watchEffect((onCleanup) => {
        const sub = subscribe((next) => {
            value.value = next;
        });

        onCleanup(() => sub.unsubscribe());
    });

    return value;
};
