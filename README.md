![alt text](https://travis-ci.com/enokson/mysql-compose.svg?branch=master)
# sql-compose


## Install
`npm i mysql-compose`  
`npm i mysql2`

## Examples  
### Getting Started  
```javascript
const mysql = require('mysql2')
const { sqlCompose, select, from, where } = require('sql-compose')

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
})

const sql = sqlCompose(
  select('Column1'),
  from('Table1'),
  where(
    eq('Column1', 1)
  )
) // => 'SELECT column1 FROM Table1 WHERE Column1 = 1'

conn.query(sql, (err, results) => { /* do things */ })
````

### Composing Functions  
Each function returns a string and functions that take multiple arguments are curried allowing for easy and fast composing
```javascript
const { select, from, where, eq } = require('sql-compose')
const selectAll = select('*') // => 'SELECT *'
const selectAllFrom = table => sqlCompose(selectAll, from(table))
const selectAllFromTable1 = selectAllFrom('Table1') // => 'SELECT * FROM Table1'
const whereFooEquals = eq('Foo')
whereFooEquals(1) // => 'Foo = 1'
where(whereFooEquals(2)) // => 'WHERE Foo = 2'
```

### Conditions  
```javascript
const { select, from, where, eq, gt, gte, whereIn, or, and } = require('mysql-compose')
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
  where(whereIn('Id', 1, 2, 3, 4, 5))
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

### Joins
```javascript
const { sqlCompose, joins, left, right, inner, full } = require('mysql-compose')

// inner join
sqlCompose(
  select('*'),
  joins('table1',
    inner('table2',
      eq('table1.column_name', 'table2.column_name')
    )
  )
) // => 'SELECT * FROM (table1 INNER JOIN table2 ON table1.column_name = table2.column_name)'

// left join
sqlCompose(
  select('column_name'),
  joins('table1', left('table2', eq('table1.column_name', 'table2.column_name')))
) // => 'SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)'

// right join
sqlCompose(
  select('column_name'),
  joins('table1', right('table2', eq('table1.column_name', 'table2.column_name')))
) // => 'SELECT column_name FROM (table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name)'

// full outer join
sqlCompose(
  select('column_name'),
  joins('table1', full('table2', eq('table1.column_name', 'table2.column_name')))
) // => 'SELECT column_name FROM (table1 FULL OUTER JOIN table2 ON table1.column_name = table2.column_name)'

// double inner join
sqlCompose(
  select('Orders.OrderID', 'Customers.CustomerName', 'Shippers.ShipperName'),
  joins('Orders',
    inner('Customers', eq('Orders.CustomerID', 'Customers.CustomerID')),
    inner('Shippers', eq('Orders.ShipperID', 'Shippers.ShipperID'))
  )
) // => 'SELECT Orders.OrderID,Customers.CustomerName,Shippers.ShipperName FROM ((Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID) INNER JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID)'

```

