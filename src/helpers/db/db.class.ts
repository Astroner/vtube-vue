import { DBModel } from "./db-model.class";
import { initDB } from "./init-db";

export class DB <Model extends DBModel<any, any>> {
    static drop(dbName: string) {
        window.indexedDB.deleteDatabase(dbName);
    }

    private db: Promise<IDBDatabase>;

    private subscriptions: Array<(changedTable: keyof Model['tables']) => void> = [];

    constructor(
        private dbName: string, 
        private model: Model,
    ) {
        this.db = initDB(dbName, model);
    }

    async put<K extends keyof Model['tables']>(
        table: K, 
        key: Model['tables'][K]['autoKey'] extends true ? null : string, 
        value: Model['tables'][K]['type'],
    ) {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readwrite");

        const storage = transaction.objectStore(table as string);
        await new Promise((resolve, reject) => {
            const putReq = storage.put(value, key ?? undefined);
            putReq.onsuccess = () => resolve(null);
            putReq.onerror = () => reject();
        });
        this.update(table);
    }

    async getAll<K extends keyof Model['tables']>(table: K): Promise<Model['tables'][K]['type'][]> {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readonly");

        const storage = transaction.objectStore(table as string);
        return new Promise((resolve) => {
            const request = storage.getAll();
            request.onsuccess = () => {
                resolve(request.result);
            };
        });
    }

    async get<K extends keyof Model['tables']>(table: K, key: string): Promise<Model['tables'][K]['type'] | null> {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readonly");

        const storage = transaction.objectStore(table as string);
        return new Promise((resolve) => {
            const request = storage.get(key);
            request.onsuccess = () => {
                resolve(request.result ?? null);
            };
        });
    }

    async has<K extends keyof Model['tables']>(table: K, key: string): Promise<boolean> {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readonly");

        const storage = transaction.objectStore(table as string);
        return new Promise((resolve) => {
            const request = storage.openCursor(key);
            request.onsuccess = () => {
                resolve(!!request.result);
            };
        });
    }

    async delete<K extends keyof Model['tables']>(table: K, key: string) {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readwrite");

        const storage = transaction.objectStore(table as string);
        return new Promise((resolve) => {
            const request = storage.delete(key);
            request.onsuccess = () => {
                resolve(null);
                this.update(table);
            };
        });
    }

    async deleteAll<K extends keyof Model['tables']>(table: K) {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readwrite");

        const storage = transaction.objectStore(table as string);
        return new Promise((resolve) => {
            const request = storage.clear();
            request.onsuccess = () => {
                resolve(null);
                this.update(table);
            };
        });
    }

    subscribe(cb: (changedTable: keyof Model['tables']) => void) {
        this.subscriptions.push(cb);

        return {
            unsubscribe: () => this.subscriptions.splice(this.subscriptions.indexOf(cb), 1),
        };
    }

    private update(table: keyof Model['tables']) {
        for (const cb of this.subscriptions) {
            cb(table);
        }
    }
}
