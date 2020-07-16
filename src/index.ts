import sqlString = require('sqlstring')

export const curry = (fn: Function, arity: number = fn.length, ...args: any[]): any =>
  arity <= args.length
    ? fn(...args)
    : curry.bind(null, fn, arity, ...args)

export interface KVObject {
  key: string,
  value: any
}
type Operator = '=' | '<' | '>' | '<=' | '>='

const joinStr = (withStr: string, arr: string[]) => {
  let str = `${arr[0]}`
  for (let i = 1; i < arr.length; i++) {
    str += `${withStr}${arr[i]}`
  }
  return str
}
const reduceArr = (fn: (acc: string, value: string) => string, arr: string[], acc: string) => {
  for (let i = 0; i < arr.length; i++) {
    acc = fn(acc, arr[i])
  }
  return acc
}
export const sqlCompose = (...args: string[]) => joinStr(' ', args)
export const as = curry((key: string, alias: string) => `${key} AS ${alias}`)

// TABLE QUERIES
const create = curry((type: string, name: string) => `CREATE ${type} ${name}`)
export const createTable = create('TABLE')
export const createView = curry((name: string, view: string) => as(create('VIEW', name), view))
export const createIndex = curry(create('INDEX'))
export const createUniqueIndex = create('UNIQUE INDEX')
export const column = curry((key: string, ...args: string[]) => `${key} ${joinStr(' ', args)}`)
export const columns = (...columns: string[]) => `(${joinStr(',', columns)})`
export const varchar = (length: number) => `varchar(${length})`
export const integer = 'int'
export const autoInc = 'AUTO_INCREMENT'
export const notNull = 'NOT NULL'
export const unique = (key: string) => `UNIQUE (${key})`
export const defaultValue = (defaultValue: string) => `DEFAULT ${sqlString.escape(defaultValue)}`
export const primaryKey = (key: string) => `PRIMARY KEY (${key})`
export const foreignKey = curry((key: string, fTable: string, fKey: string) => `FOREIGN KEY (${key}) REFERENCES ${fTable}(${fKey})`)

// Queries

export const select = (...columns: string[]) => `SELECT ${joinStr(',', columns)}`
export const insertInto = (table: string) => `INSERT INTO ${table}`
export const update = (table: string) => `UPDATE ${table}`
export const deleteFrom = (table: string) => `DELETE FROM ${table}`
export const selectFn = curry((fn: string, key: string) => `${fn}(${key})`)
export const count = selectFn('COUNT')
export const avg = selectFn('AVG')
export const sum = selectFn('SUM')
export const from = (table: string) => `FROM ${table}`
export const on = (arg: string) => `ON ${arg}`

export const keyValuePairs = (...values: KVObject[]) => {
  let keyStr = values[0].key
  let valueStr = values[0].value
  for (let i = 1; i < values.length; i++) {
    keyStr += `,${values[i].key}`
    valueStr += `,${values[i].value}`
  }
  return `(${keyStr}) VALUES (${valueStr})`
}
export const keyValue = curry((key: string, value: any) => ({ key, value: sqlString.escape(value) }))
export const set = curry((key: string, value: string) => `${key} = ${sqlString.escape(value)}`)
export const updates = (...sets: string[]) => `SET ${sets.join(', ')}`
export const where = (...conditions: string[]) => `WHERE ${conditions.join(' ')}`
export const and = (...conditions: string[]) => `(${conditions.join(' AND ')})`
export const or = (...conditions: string[]) => `(${conditions.join(' OR ')})`
export const operate = curry((operator: Operator, key: string, value: any) => `${key} ${operator} ${value}`)
export const eq = operate('=')
export const gt = operate('>')
export const gte = operate('>=')
export const lt = operate('<')
export const lte = operate('<=')
export const isNull = (key: string) => `${key} IS NULL`
// export const whereIn = curry((key: string, ...values: any[]) => `${key} IN (${values.map(v => `${sqlString.escape(v)}`).join(', ')})`)
export const whereIn = curry((key: string, ...values: any[]) => `${key} IN (${joinStr(',', values)})`)
export const like = curry((key: string, pattern: string) => `${key} LIKE ${sqlString.escape(pattern)}`)
export const between = curry((key: string, value1: any, value2: any) => `${key} BETWEEN ${sqlString.escape(value1)} AND ${sqlString.escape(value2)}`)
export const exists = (sql: string) => `EXISTS (${sql})`
export const any = (sql: string) => `ANY (${sql})`
export const all = (sql: string) => `ALL (${sql})`
export const groupBy = (column: string) => `GROUP BY ${column}`
export const orderBy = (...columns: string[]) => `ORDER BY ${joinStr(', ', columns)}`
export const desc = (column: string) => `${column} DESC`

// joins
// export const joins = curry((table: string, ...joins: string[]) => `FROM ${joins.reduce((acc, str) => `(${acc} ${str})`, table)}`)
export const joins = curry((table: string, ...joins: string[]) => `FROM ${reduceArr((acc, str) => `(${acc} ${str})`, joins, table)}`)
export const join = curry((type: string, table: string, condition: string) => `${type} JOIN ${table} ON ${condition}`)
export const inner = join('INNER')
export const left = join('LEFT')
export const right = join('RIGHT')
export const full = join('FULL OUTER')
export const fromForeign = curry((table: string, key: string) => `${table}.${key}`)
