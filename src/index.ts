import sqlString = require('sqlstring')

export interface WhereObj {
  [prop: string]: any
}
type Operator = '=' | '<' | '>' | '<=' | '>='

export const sqlCompose = (...fns: Function[]) => fns.reduce((acc, fn) => fn(acc), '')
export const enclose = (sql: string) => `(${sql})`

// TABLE QUERIES
const create = (type: string) => (name: string) => () => `CREATE ${type} ${name}`
export const createTable = create('TABLE')
export const createView = create('VIEW')
export const createIndex = create('INDEX')
export const createUniqueIndex = create('UNIQUE INDEX')
export const column = (key: string, ...args: Function[]) => () => `${args.reduce((acc, fn) => fn(acc), key)}`
export const columns = (...columns: Function[]) => (sql: string) => `${sql} (${columns.map(column => column()).join(', ')})`
export const selectColumn = (column: string) => (sql: string) => `${sql} ${column}`
export const allColumns = (sql: string) => `${sql} *`
export const varchar = (length: number) => (sql: string) => `${sql} varchar(${length})`
export const integer = (sql: string) => `${sql} int`
export const autoInc = (sql: string) => `${sql} AUTO_INCREMENT`
export const notNull = (sql: string) => `${sql} NOT NULL`
export const unique = (key: string) => () => `UNIQUE (${key})`
export const defaultValue = (defaultValue: string) => (sql: string) => `${sql} DEFAULT ${sqlString.escape(defaultValue)}`
export const primaryKey = (key: string) => () => `PRIMARY KEY (${key})`
export const foreignKey = (key: string, fTable: string, fKey: string) => () => `FOREIGN KEY (${key}) REFERENCES ${fTable}(${fKey})`

// Queries
export const select = () => `SELECT`
export const insert = () => `INSERT`
export const update = (table: string) => () => `UPDATE ${table}`
export const deleteRow = () => `DELETE`
export const selectFn = (fn: string) => (key: string) => `${fn}(${key})`
export const count = selectFn('COUNT')
export const avg = selectFn('AVG')
export const sum = selectFn('SUM')
export const into = (table: string) => (sql: string) => `${sql} INTO ${table}`
export const from = (table: string) => (sql: string) => `${sql} FROM ${table}`
export const on = (arg: string) => (sql: string) => `${sql} ON ${arg}`
export const as = (key: string) => (sql: string) => `${sql} AS ${key}`

export const keyValuePairs = (...values: [string, any][]) => (sql: string) => `${sql} (${values.map(kv => kv[0]).join(', ')}) VALUES (${values.map(kv => kv[1]).join(', ')})`
export const keyValue = (key: string) => (value: any) => [key, sqlString.escape(value)]
export const set = (key: string) => (value: string) => `${key} = ${sqlString.escape(value)}`
export const sets = (...sets: string[]) => (sql: string) => `${sql} SET ${sets.join(', ')}`
export const where = (fn: Function) => (sql: string) => `${sql} WHERE ${fn()}`
export const and = (...fns: Function[]) => () => `(${fns.map(fn => fn()).join(' AND ')})`
export const or = (...fns: Function[]) => () => `(${fns.map(fn => fn()).join(' OR ')})`
const operate = (operator: Operator) => (key: string) => (value: any) => () => `${key} ${operator} ${value}`
export const eq = operate('=')
export const gt = operate('>')
export const gte = operate('>=')
export const lt = operate('<')
export const lte = operate('<=')
export const isNull = (key: string) => () => `${key} IS NULL`
export const whereIn = (key: string) => (...values: any[]) => () => `${key} IN (${values.map(v => `${sqlString.escape(v)}`).join(', ')})`
export const like = (key: string) => (pattern: string) => () => `${key} LIKE ${sqlString.escape(pattern)}`
export const between = (key: string) => (value1: any, value2: any) => () => `${key} BETWEEN ${sqlString.escape(value1)} AND ${sqlString.escape(value2)}`
export const exists = (sqlCompose: string) => () => `EXISTS (${sqlCompose})`
export const any = (sql: string) => `ANY (${sql})`
export const all = (sql: string) => `ALL (${sql})`
export const groupBy = (column: string) => (sql: string) => `${sql} GROUP BY ${column}`
export const orderBy = (...columns: string[]) => (sql: string) => `${sql} ORDER BY ${columns.join(', ')}`
export const desc = (column: string) => `${column} DESC`

// joins
export const joins = (table: string) => (...joins: string[]) => (sql: string) => `${sql} FROM ${joins.reduce((acc, str) => `(${acc} ${str})`, table)}`
export const join = (type: string) => (table: string) => (where: Function) => `${type} JOIN ${table} ON ${where()}`
export const inner = join('INNER')
export const left = join('LEFT')
export const right = join('RIGHT')
export const full = join('FULL OUTER')

