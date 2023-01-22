import { ref, watchEffect } from "vue";
import { onlineObservable } from "../online-observable";

export const useIsOnline = () => {
    const state = ref(onlineObservable.getStatus());

    watchEffect((onCleanup) => {
        const sub = onlineObservable.subscribe((next) => {
            state.value = next;
        });
        onCleanup(() => sub.unsubscribe());
    });

    return state;
};
