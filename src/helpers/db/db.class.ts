import { DBTable } from "./db-table.class";

export class DB <Tables extends { [key: string]: DBTable<any> }> {
    private db: Promise<IDBDatabase>;

    private subscriptions: Array<(changedTable: keyof Tables) => void> = [];

    constructor(
        private dbName: string, 
        private dbVersion: number,
        private tables: Tables,
    ) {
        this.db = new Promise<IDBDatabase>((resolve, reject) => {
            const request = window.indexedDB.open(dbName, dbVersion);
            request.onsuccess = () => {
                resolve(request.result);
            };
            request.onerror = () => {
                reject(request.error);
            };
            request.onupgradeneeded = () => {
                const db = request.result;
                for (const key in tables) {
                    if (Object.prototype.hasOwnProperty.call(tables, key)) {
                        db.createObjectStore(key);
                    }
                }
            };
        });
    }

    async put<K extends keyof Tables>(table: K, key: string, value: Tables[K]['type']) {
        const db = await this.db;

        const transaction = db.transaction(table as string, "readwrite");

        const storage = transaction.objectStore(table as string);
        storage.put(value, key);
        this.update(table);
    }

    async getAll<K extends keyof Tables>(table: K): Promise<Tables[K]['type'][]> {
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

    async get<K extends keyof Tables>(table: K, key: string): Promise<Tables[K]['type'] | null> {
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

    async has<K extends keyof Tables>(table: K, key: string): Promise<boolean> {
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

    async delete<K extends keyof Tables>(table: K, key: string) {
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

    async deleteAll<K extends keyof Tables>(table: K) {
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

    subscribe(cb: (changedTable: keyof Tables) => void) {
        this.subscriptions.push(cb);

        return {
            unsubscribe: () => this.subscriptions.splice(this.subscriptions.indexOf(cb), 1),
        };
    }

    private update(table: keyof Tables) {
        for (const cb of this.subscriptions) {
            cb(table);
        }
    }
}
