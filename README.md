## Install
`npm i sql-compose`  
`npm i mysql` or `npm i mysql2`

##Examples
###Getting Started
```
const mysql = require('mysql2')
const { sqlCompose, select, from, where, gt, gt } = require('sql-compose')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
})

const sql = sqlCompose(
  select('column1'),
  from('Table1'),
  where(
    eq('Column1', 1)
  )
) // => 'SELECT column1 FROM Table1 WHERE Column1 = 1'

conn.query(sql, (err, results) => { /* do things */ })
````

###Composing Functions

Each function returns a string and functions that take multiple arguments are curried allowing for easy and fast composing
```
const { select, from, where, eq } = require('sql-compose')
cosnt selectAll = select('*') // => 'SELECT *'
const selectAllFrom = table => sqlCompose(selectAll, from(table))
const selectAllFromTable1 = selectAllFrom('Table1') // => 'SELECT * FROM Table1'
const whereFooEquals = eq('Foo')
whereFooEquals(1) // => 'Foo = 1'
where(whereFooEquals(2)) // => 'WHERE Foo = 2'
```

###Conditions
```
const { select, from, where, eq, gt, gte, in, or, and } = require('mysql-compose')
const whereIdEquals1 = where(
    eq('Id', 1)
) // => 'WHERE Id = 1'
const whereFooEquals = eq('Foo') 
const whereBarIsGt = eq('Bar')
const condition = where(
    or(
        whereFooEquals('Fizz'),
        whereBarIsGt(5)
    )
) // => 'WHERE (Foo = `Fizz` OR Bar > 5)'

sqlCompose(
    select('Foo', 'Bar'),
    from('MyTable'),
    condition
) // => 'SELECT Foo,Bar FROM MyTable WHERE (Foo = `Fizz` OR Bar > 5)'

sqlCompose(
    select('*'),
    from('MyTable'),
    where(in('Id', 1, 2, 3, 4, 5))
) // => 'SELECT * FROM MyTable WHERE Id IN (1,2,3,4,5)'


const whereColumn1Equals = eq('Column1')
const whereColumn2IsGte = gte('Column2')
const whereColumn3Equals = eq('Column3')
where(
    and(
        or(
            whereColumn1Equals(1),
            whereColumn2IsGte(5)
        ),
        whereColumn3Equals(3)
    )
) // => 'WHERE ((Column1 = 1 OR Column2 >= 5) AND Column3 = 3)'
```