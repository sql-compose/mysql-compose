export declare const curry: (fn: Function, arity?: number, ...args: any[]) => any;
export interface KVObject {
    key: string;
    value: any;
}
export declare const sqlCompose: (...args: string[]) => string;
export declare const as: any;
export declare const createTable: any;
export declare const createView: any;
export declare const createIndex: any;
export declare const createUniqueIndex: any;
export declare const column: any;
export declare const columns: (...columns: string[]) => string;
export declare const varchar: (length: number) => string;
export declare const integer = "int";
export declare const autoInc = "AUTO_INCREMENT";
export declare const notNull = "NOT NULL";
export declare const unique: (key: string) => string;
export declare const defaultValue: (defaultValue: string) => string;
export declare const primaryKey: (key: string) => string;
export declare const foreignKey: any;
export declare const select: (...columns: string[]) => string;
export declare const insertInto: (table: string) => string;
export declare const update: (table: string) => string;
export declare const deleteFrom: (table: string) => string;
export declare const selectFn: any;
export declare const count: any;
export declare const avg: any;
export declare const sum: any;
export declare const from: (table: string) => string;
export declare const on: (arg: string) => string;
export declare const keyValuePairs: (...values: KVObject[]) => string;
export declare const keyValue: any;
export declare const set: any;
export declare const updates: (...sets: string[]) => string;
export declare const where: (...conditions: string[]) => string;
export declare const and: (...conditions: string[]) => string;
export declare const or: (...conditions: string[]) => string;
export declare const operate: any;
export declare const eq: any;
export declare const gt: any;
export declare const gte: any;
export declare const lt: any;
export declare const lte: any;
export declare const isNull: (key: string) => string;
export declare const whereIn: any;
export declare const like: any;
export declare const between: any;
export declare const exists: (sql: string) => string;
export declare const any: (sql: string) => string;
export declare const all: (sql: string) => string;
export declare const groupBy: (column: string) => string;
export declare const orderBy: (...columns: string[]) => string;
export declare const desc: (column: string) => string;
export declare const joins: any;
export declare const join: any;
export declare const inner: any;
export declare const left: any;
export declare const right: any;
export declare const full: any;
export declare const fromForeign: any;
//# sourceMappingURL=index.d.ts.map