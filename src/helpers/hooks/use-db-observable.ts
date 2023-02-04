import { DBObservable, DBObservableType } from "@dogonis/db";
import { Ref, ref, watchEffect } from "vue";

export const useDBObservable = <
    OBT extends DBObservable<any, any, any>,
>(observable: OBT): Ref<DBObservableType<OBT> | null> => {
    const value = ref<null | DBObservableType<OBT>>(null);

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
