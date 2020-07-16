[![Build Status](https://travis-ci.com/enokson/mysql-compose.svg?branch=master)](https://travis-ci.com/enokson/mysql-compose) 
[![codecov](https://codecov.io/gh/enokson/mysql-compose/branch/master/graph/badge.svg)](https://codecov.io/gh/enokson/mysql-compose)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Known Vulnerabilities](https://snyk.io/test/github/enokson/mysql-compose/badge.svg?targetFile=package.json)](https://snyk.io/test/github/enokson/mysql-compose?targetFile=package.json)
# sql-compose
The best elegance and speed have to offer

## Install
```shell script
$ npm i mysql-compose
$ npm i mysql2
```

## Examples  
### Getting Started  
```javascript
const mysql = require('mysql2')
const { sqlCompose, select, from, where } = require('sql-compose')

// connect to a mysql server
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'test'
})

// create a select sql cmd to send to the server
const sql = sqlCompose(
  select('Column1'),
  from('Table1'),
  where(
    eq('Column1', 1)
  )
) // => 'SELECT column1 FROM Table1 WHERE Column1 = 1'

// send the query
conn.query(sql, (err, results) => { /* do things */ })
````

### Composing Functions  
Each function returns a string and functions that take multiple
arguments are curried allowing for easy, flexible, and fast composition.

Since each function returns a string, when you partially compose a sql
command ahead of when you need it (such as, before a route declaration
in the express or fastify frameworks) it has the effect of being memorized.
Allowing you to build only what is needed when time matters most
(such as in a route declaration).
```javascript
const { select, from, where, eq } = require('mysql-compose')

// select all columns
const selectAll = select('*') // => 'SELECT *'

// create a function that selects all columns from a given table
const selectAllFrom = table => sqlCompose(selectAll, from(table))

// select all columns from Table1
const selectAllFromTable1 = selectAllFrom('Table1') // => 'SELECT * FROM Table1'

// this function returns another function
const whereFooEquals = eq('Foo') // (value) => `Foo = ${value}`

// returning a where condition
whereFooEquals(1) // => 'Foo = 1'

// returning a condition with the WHERE clause
where(whereFooEquals(2)) // => 'WHERE Foo = 2'
```

### Creating Tables
```javascript
const { 
  sqlCompose, createTable, columns, column, 
  integer, autoInc, notNull, varchar, defaultValue } = require('mysql-compose')

// create a table named Foo with two columns
sqlCompose(
  createTable('Foo'),
  columns(
    column('Bar', integer, autoInc, notNull),
    column('Baz', varchar(255), defaultValue('Default Value'))
  )
) // => "CREATE TABLE Foo (Bar int AUTO_INCREMENT NOT NULL,Baz varchar(255) DEFAULT 'Default Value')"

// Create a foreign key constraint
const idReferences = foreignKey('Foo_ID')
// Create a table with a primary and foreign key
sqlCompose(
  createTable('Foo'),
  columns(
    column('Foo_ID', integer, notNull, autoInc),
    column('Bar', varchar(255)),
    primaryKey('Foo_ID'),
    idReferences('Baz', 'Baz_ID')
  )
) // => 'CREATE TABLE Foo (Foo_ID int NOT NULL AUTO_INCREMENT,Bar varchar(255),PRIMARY KEY (Foo_ID),FOREIGN KEY (Foo_ID) REFERENCES Baz(Baz_ID))'
```

### Conditions  
```javascript
const { select, from, where, eq, gt, gte, whereIn, or, and } = require('mysql-compose')

const IdEquals1 = eq('Id', 1) // => 'Id = 1'
const whereIdEquals1 = where(IdEquals1) // => 'WHERE Id = 1'

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

### Don't see a function a you need? Make one.
mysql-compose does not encompass all the vast possible functions that mysql
has to offer. So, feel free to fill in the gaps with your code easily
with no plugin-glue required.
```javascript
// here is one example

const { sqlCompose, select, from } = require('mysql-compose')

// my plugin
const date = str => `DATE(${str})`

sqlCompose(select(date('YYYY-MM-DD')), from('MyDates')) // => "SELECT DATE('YYYY-MM-DD') FROM MyDates"

```
```javascript
// and another
// mysql-compose comes with a curry function to help with building queries

const { curry, sqlCompose, select } = require('mysql-compose')

const interval = curry((fnName, interval, value, date) => `${fnName}("${date}", INTERVAL ${value} ${interval})`)

// using our new interval function to create the DATE_ADD function
const dateAdd = interval('DATE_ADD')
const addDays = dateAdd('DAY')
const addMinutes = dateAdd('MINUTE')
const tenDaysAfter = addDays(10)
const sixDaysAfter = addDays(6)
const fiveMinutesAfter = addMinutes(5)

sqlCompose(select(tenDaysAfter('2017-06-15'))) // => SELECT DATE_ADD("2017-06-15", INTERVAL 10 DAY)
sqlCompose(select(fiveMinutesAfter('2017-06-15'))) // => SELECT DATE_ADD("2017-06-15", INTERVAL 10 MINUTE)
sqlCompose(select(sixDaysAfter('2017-06-15'))) // => SELECT DATE_ADD("2017-06-15", INTERVAL 6 DAY)

// using the same interval function to create the DATE_SUB function
const dateSub = interval('DATE_SUB')
const subtractDays = dateSub('DAY')
const tenDaysBefore = subtractDays(10)
const oneDayBefore = subtractDays(1)

sqlCompose(select(tenDaysBefore('2017-06-15'))) // => SELECT DATE_SUB("2017-06-15", INTERVAL 10 DAY)
sqlCompose(select(oneDayBefore('2017-06-15'))) // => SELECT DATE_SUB("2017-06-15", INTERVAL 1 DAY)

```

### So, how fast is it? Very...
#### Generating a simple select query with a single condition
mysql-compose (w/ partial memorization): 3,740,971 queries/sec  
mysql-compose (w/o any memorization): 3,134,941 queries/sec  
knex: 172,600 queries/sec

#### Generating an inner join sql query
mysql-compose (w/o any memorization): 1,586,707 queries/sec  
knex: 106,207 queries/sec

Run your own benchmark tests with:
```
npm run benchmark
```

### Acknowledgements
The [curry](https://www.30secondsofcode.org/js/s/curry) function was shamelessly taken from the 30 seconds of code website.  
This project also uses [sqlstring](https://www.npmjs.com/package/sqlstring) to escape values in sql queries.