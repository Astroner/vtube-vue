import { DBModel } from "./db-model.class";
import { DB } from "./db.class";

export class DBObservable<
    Model extends DBModel<Record<string, any>, any>, 
    TableKey extends keyof Model['tables'],
> {
    type!: Model['tables'][TableKey]['type'][];

    private subscriptions: Array<(next: Model['tables'][TableKey]['type'][]) => void> = [];

    private value: Promise<Model['tables'][TableKey]['type'][]>;

    constructor(
        private db: DB<Model>,
        private tableKey: TableKey,
    ) {
        this.value = this.db.getAll(tableKey);

        this.db.subscribe((changedTable) => {
            if (changedTable !== tableKey) return;
            this.update();
        });
    }

    getValue() {
        return this.value;
    }

    subscribe(cb: (next: Model['tables'][TableKey]['type'][]) => void) {
        this.subscriptions.push(cb);

        return {
            unsubscribe: () => this.subscriptions.splice(this.subscriptions.indexOf(cb), 1),
        };
    }

    private async update() {
        this.value = this.db.getAll(this.tableKey);

        const nextState = await this.value;

        for (const cb of this.subscriptions) {
            cb(nextState);
        }
    }
}
