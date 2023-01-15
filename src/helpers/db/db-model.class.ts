import { DBTable } from "./db-table.class";

export type TablesType<Tables extends Record<string, DBTable<any, boolean>>> = {
    [K in keyof Tables]: Array<{ 
        key: Tables[K]['autoKey'] extends true ? number : string, 
        value: Tables[K]['type'] 
    }>
}

export class DBModel<
    CurrentTables extends Record<string, DBTable<any, boolean>>,
    PrevModel extends DBModel<any, any> | null = null,
> {
    static create<T extends Record<string, DBTable<any, boolean>>>(
        tables: T, 
        version = 1,
    ) {
        return new DBModel(tables, version, null, null);
    }

    constructor(
        public tables: CurrentTables,
        public version: number,
        public prevModel: PrevModel,
        public migrate: PrevModel extends DBModel<any, any> 
            ? (data: TablesType<PrevModel['tables']>) => Partial<TablesType<CurrentTables>> 
            : null,
    ) {}

    next<NextTables extends Record<string, DBTable<any, boolean>>>(
        tables: NextTables,
        migrate: (data: TablesType<CurrentTables>) => Partial<TablesType<NextTables>>,
    ): DBModel<NextTables, DBModel<CurrentTables, PrevModel>> {
        return new DBModel(tables, this.version + 1, this, migrate as any);
    }
}