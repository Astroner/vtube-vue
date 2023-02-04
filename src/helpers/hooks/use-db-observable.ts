import { DBObservable } from "@dogonis/db";
import { ref, watchEffect } from "vue";

type PromiseType<P> = P extends Promise<infer T> ? T : any;

export const useDBObservable = <
    OBT extends DBObservable<any, any>,
>(observable: OBT) => {
    const value = ref<null | PromiseType<ReturnType<OBT['getValue']>>>(null);

    watchEffect((onCleanup) => {
        observable.getValue()
            .then((state) => {
                value.value = state as any;
            });
        
        const sub = observable.subscribe((nextState) => {
            value.value = nextState as any;
        });

        onCleanup(() => sub.unsubscribe());
    });

    return value;
};
