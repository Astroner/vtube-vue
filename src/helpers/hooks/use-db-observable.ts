import { ref, watchEffect } from "vue";
import { DBModel } from "../db/db-model.class";

import { DBObservable } from "../db/db-observable.class";

export const useDBObservable = <
    Model extends DBModel<Record<string, any>, any>, 
    TableKey extends keyof Model['tables']
>(observable: DBObservable<Model, TableKey>) => {
    const value = ref<null | Model['tables'][TableKey]['type'][]>(null);

    watchEffect((onCleanup) => {
        observable.getValue()
            .then((state) => {
                value.value = state;
            });
        
        const sub = observable.subscribe((nextState) => {
            value.value = nextState;
        });

        onCleanup(() => sub.unsubscribe());
    });

    return value;
};
