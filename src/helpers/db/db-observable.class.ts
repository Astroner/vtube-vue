import { DBTable } from "./db-table.class";
import { DB } from "./db.class";

export class DBObservable<
    Tables extends { [key: string]: DBTable<any> }, 
    TableKey extends keyof Tables,
> {
    private subscriptions: Array<(next: Tables[TableKey]['type'][]) => void> = [];

    private value: Promise<Tables[TableKey]['type'][]>;

    constructor(
        private db: DB<Tables>,
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

    subscribe(cb: (next: Tables[TableKey]['type'][]) => void) {
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
