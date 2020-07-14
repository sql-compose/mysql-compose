const {
  sqlCompose, enclose,
  createTable, createView, createIndex, createUniqueIndex,
  select, count, avg, sum,
  insert, keyValuePairs, keyValue,
  update, sets, set,
  deleteRow,
  column, columns, allColumns, selectColumn,
  integer, varchar,
  autoInc, notNull, defaultValue,
  primaryKey, foreignKey, unique,
  from, into, as, on,
  where, and, or, eq, gt, gte, lt, lte, isNull, between, whereIn, exists, any, all, like,
  orderBy, groupBy, desc,
  joins, join, inner, left, right, full,
  ...src } = require('../build/index')
const { expect } = require('chai')
describe('creating a table', function () {
  it('should return a two-column create table sql cmd', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('Bar', integer, autoInc, notNull),
        column('Baz', varchar(255), defaultValue('Default Value'))
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (Bar int AUTO_INCREMENT NOT NULL, Baz varchar(255) DEFAULT \'Default Value\')')
  })
  it('should return a 1-column table with a primary key sql cmd', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('ID', integer, notNull, autoInc),
        primaryKey('ID')
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT, PRIMARY KEY (ID))')
  })
  it('should return a 2-column table with a primary & foreign key sql cmd', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('ID', integer, notNull, autoInc),
        column('Bar', varchar(255)),
        primaryKey('ID'),
        foreignKey('Bar', 'Baz', 'Bar')
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT, Bar varchar(255), PRIMARY KEY (ID), FOREIGN KEY (Bar) REFERENCES Baz(Bar))')
  })
  it('should return a 1-column table with a NOT NULL argument', function () {
    expect(sqlCompose(
      createTable('Foo'),
      columns(
        column('Bar', integer, notNull, autoInc)
      )
    )).to.include('Bar int NOT NULL AUTO_INCREMENT')
  })
  it('should return \'CREATE TABLE Table1 (ID int, Column2 int, UNIQUE (ID))\'', function () {
    expect(sqlCompose(
      createTable('Table1'),
      columns(
        column('ID', integer),
        column('Column2', integer),
        unique('ID')
      )
    )).to.equal('CREATE TABLE Table1 (ID int, Column2 int, UNIQUE (ID))')
  })
})
describe('selecting', function () {
  let column1Eq, column1gt, column1gte, column1lt, column1lte, column1IsNull,
    column2Eq
  before(function () {
    column1Eq = eq('column1')
    column1gt = gt('column1')
    column1gte = gte('column1')
    column1lt = lt('column1')
    column1lte = lte('column1')
    column1IsNull = isNull('column1')
    column2Eq = eq('column2')
  })
  it('should return \'SELECT (column1, column2) FROM Table1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1'),
        column('column2')
      ),
      from('Table1')
    )).to.equal('SELECT (column1, column2) FROM Table1')
  })
  it('should return \'SELECT ((column1 AS Bar), column2) FROM Table1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1', as('Bar'), enclose),
        column('column2')
      ),
      from('Table1')
    )).to.equal('SELECT ((column1 AS Bar), column2) FROM Table1')
  })
  it('should return \'SELECT ((column1 AS Bar), column2) FROM Table1 WHERE column1 = 1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1', as('Bar'), enclose),
        column('column2')
      ),
      from('Table1'),
      where(
        column1Eq(1)
      )
    )).to.equal('SELECT ((column1 AS Bar), column2) FROM Table1 WHERE column1 = 1')
  })
  it('should return \'SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 AND column2 = 1)\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1', as('Bar'), enclose),
        column('column2')
      ),
      from('Table1'),
      where(
        and(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 AND column2 = 1)')
  })
  it('should return \'SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 AND column2 = 1)\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1', as('Bar'), enclose),
        column('column2')
      ),
      from('Table1'),
      where(
        and(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 AND column2 = 1)')
  })
  it('should return \'SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 OR column2 = 1)\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1', as('Bar'), enclose),
        column('column2')
      ),
      from('Table1'),
      where(
        or(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT ((column1 AS Bar), column2) FROM Table1 WHERE (column1 = 1 OR column2 = 1)')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 > 1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        column1gt(1)
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 > 1')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 >= 1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        column1gte(1)
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 >= 1')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 < 1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        column1lt(1)
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 < 1')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 <= 1\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        column1lte(1)
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 <= 1')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 IS NULL\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        column1IsNull
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 IS NULL')
  })
  it('should return \'SELECT (column1) FROM Table1 WHERE column1 BETWEEN 1 AND 5\'', function () {
    expect(sqlCompose(
      select,
      columns(
        column('column1')
      ),
      from('Table1'),
      where(
        between('column1')(1, 5)
      )
    )).to.equal('SELECT (column1) FROM Table1 WHERE column1 BETWEEN 1 AND 5')
  })
  it('should return \'SELECT * FROM table1 WHERE ID IN (1, 2, 3, 4, 5)\'', function () {
    const whereID = whereIn('ID')
    expect(sqlCompose(
      select,
      allColumns,
      from('table1'),
      where(whereID(1,2,3,4,5))
    )).to.equal('SELECT * FROM table1 WHERE ID IN (1, 2, 3, 4, 5)')
  })
  it('should return \'SELECT * FROM table_name WHERE EXISTS (SELECT (column_name) FROM table_name WHERE ID = 1)\'', function () {
    const selectionExists = exists(
      sqlCompose(
        select,
        columns(
          column('column_name')
        ),
        from('table_name'),
        where(eq('ID')(1))
      )
    )
    const sql = sqlCompose(
      select,
      allColumns,
      from('table_name'),
      where(selectionExists)
    )
    expect(sql).to.equal('SELECT * FROM table_name WHERE EXISTS (SELECT (column_name) FROM table_name WHERE ID = 1)')
  })
  it('should return \'SELECT * FROM table_name WHERE column_name = ANY (SELECT column_name FROM table_name WHERE column_name = 1)\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('table_name'),
      where(
        eq('column_name')(any(
          sqlCompose(
            select,
            selectColumn('column_name'),
            from('table_name'),
            where(
              eq('column_name')(1)
            )
          )
        ))
      )
    )
    expect(sql).to.equal('SELECT * FROM table_name WHERE column_name = ANY (SELECT column_name FROM table_name WHERE column_name = 1)')
  })
  it('should return \'SELECT * FROM table_name WHERE column_name = ALL (SELECT column_name FROM table_name WHERE column_name = 1)\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('table_name'),
      where(
        eq('column_name')(
          all(
            sqlCompose(
              select,
              selectColumn('column_name'),
              from('table_name'),
              where(
                eq('column_name')(1)))))))
    expect(sql).to.equal('SELECT * FROM table_name WHERE column_name = ALL (SELECT column_name FROM table_name WHERE column_name = 1)')
  })
  it('should return \'SELECT * FROM Customers WHERE CustomerName LIKE \'a%\'\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('Customers'),
      where(
        like('CustomerName')('a%')
      )
    )
    expect(sql).to.equal('SELECT * FROM Customers WHERE CustomerName LIKE \'a%\'')
  })
  it('should return \'SELECT * FROM Customers WHERE CustomerName LIKE \'_r%\'\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('Customers'),
      where(
        like('CustomerName')('_r%')
      )
    )
    expect(sql).to.equal('SELECT * FROM Customers WHERE CustomerName LIKE \'_r%\'')
  })
})
describe('inserting rows', function () {
  it('should return \'INSERT INTO table1 (column1, column2) VALUES (1, 2)\'', function () {
    expect(sqlCompose(
      insert,
      into('table1'),
      keyValuePairs(
        keyValue('column1')(1),
        keyValue('column2')(2))))
      .to
      .equal('INSERT INTO table1 (column1, column2) VALUES (1, 2)')
  })
  it('should return \'INSERT INTO table1 (column1, column2) VALUES (1, `Foo Bar`)\'', function () {
    expect(sqlCompose(
      insert,
      into('table1'),
      keyValuePairs(
        keyValue('column1')(1),
        keyValue('column2')('Foo Bar'))))
      .to
      .equal('INSERT INTO table1 (column1, column2) VALUES (1, \'Foo Bar\')')
  })
})
describe('updating rows', function () {
  let setColumn1, setColumn2, whereIDIslteTo
  before(function () {
    setColumn1 = set('column1')
    setColumn2 = set('column2')
    whereIDIslteTo = lte('ID')
  })
  it('should return \'UPDATE table1 SET column1 = 1, column2 = 2 WHERE ID <= 5\'', function () {
    expect(sqlCompose(
      update('table1'),
      sets(
        setColumn1(1),
        setColumn2(2)
      ),
      where(whereIDIslteTo(5))
    )).to.equal('UPDATE table1 SET column1 = 1, column2 = 2 WHERE ID <= 5')
  })
})
describe('sql functions', function () {
  let fromTable1, whereIdEq1, columns
  before(function () {
    fromTable1 = from('table1')
    whereIdEq1 = where(eq('ID')(1))
  })
  it('should return \'SELECT COUNT(column1) FROM table1 WHERE ID = 1\'', function () {
    expect(sqlCompose(
      select,
      selectColumn(count('column1')),
      fromTable1,
      whereIdEq1)).to.equal('SELECT COUNT(column1) FROM table1 WHERE ID = 1')
  })
  it('should return \'SELECT AVG(column1) FROM table1 WHERE ID = 1\'', function () {
    expect(sqlCompose(select, selectColumn(avg('column1')), fromTable1, whereIdEq1)).to.equal('SELECT AVG(column1) FROM table1 WHERE ID = 1')
  })
  it('should return \'SELECT SUM(column1) FROM table1 WHERE ID = 1\'', function () {
    expect(sqlCompose(select, selectColumn(sum('column1')), fromTable1, whereIdEq1)).to.equal('SELECT SUM(column1) FROM table1 WHERE ID = 1')
  })
})
describe('deleting rows', function () {
  it('should return \'DELETE FROM Table1 WHERE ID = 5\'', function () {
    expect(sqlCompose(
      deleteRow,
      from('Table1'),
      where(eq('ID')(5))
    )).to.equal('DELETE FROM Table1 WHERE ID = 5')
  })
  it('should return \'DELETE FROM Table1 WHERE ID BETWEEN 1 AND 5\'', function () {
    expect(sqlCompose(
      deleteRow,
      from('Table1'),
      where(between('ID')(1, 5))
    )).to.equal('DELETE FROM Table1 WHERE ID BETWEEN 1 AND 5')
  })
})
describe('creating a view', function () {
  it('should return \'CREATE VIEW view_name AS SELECT (column1, column2) FROM table_name WHERE column1 = 1', function () {
    const view = sqlCompose(
      select,
      columns(
        column('column1'),
        column('column2')
      ),
      from('table_name'),
      where(eq('column1')(1))
    )
    const sql = sqlCompose(
      createView('view_name'),
      as(view)
    )
    expect(sql).to.equal('CREATE VIEW view_name AS SELECT (column1, column2) FROM table_name WHERE column1 = 1')
  })
})
describe('creating an index', function () {
  it('should return \'CREATE INDEX index_name ON table_name (column1, column2)', function () {
    const sql = sqlCompose(
      createIndex('index_name'),
      on('table_name'),
      columns(
        column('column1'),
        column('column2')
      )
    )
    expect(sql).to.equal('CREATE INDEX index_name ON table_name (column1, column2)')
  })
  it('should return \'CREATE UNIQUE INDEX index_name ON table_name (column1, column2)', function () {
    const sql = sqlCompose(
      createUniqueIndex('index_name'),
      on('table_name'),
      columns(
        column('column1'),
        column('column2')
      )
    )
    expect(sql).to.equal('CREATE UNIQUE INDEX index_name ON table_name (column1, column2)')
  })
})
describe('joining tables', function () {
  it('should return \'SELECT * FROM (table1 INNER JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      joins('table1')(
        inner('table2')(
          eq('table1.column_name')('table2.column_name')
      ))
    )
    expect(sql).to.equal('SELECT * FROM (table1 INNER JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return a double inner join sql cmd', function () {
    const sql = sqlCompose(
      select,
      columns(
        column('Orders.OrderID'),
        column('Customers.CustomerName'),
        column('Shippers.ShipperName')
      ),
      joins('Orders')(
        inner('Customers')(
          eq('Orders.CustomerID')('Customers.CustomerID')
        ),
        inner('Shippers')(
          eq('Orders.ShipperID')('Shippers.ShipperID')
        )
      )
    )
    expect(sql)
      .to
      .equal('SELECT (Orders.OrderID, Customers.CustomerName, Shippers.ShipperName) FROM ((Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID) INNER JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID)')
  })
  it('should return \'SELECT column_name FROM table1 LEFT JOIN table2 ON table1.column_name = table2.column_name\'', function () {
    const sql = sqlCompose(
      select,
      selectColumn('column_name'),
      joins('table1')(
        left('table2')(
          eq('table1.column_name')('table2.column_name')
        )
      )
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select,
      selectColumn('column_name'),
      joins('table1')(
        left('table2')(
          eq('table1.column_name')('table2.column_name')
        )
      )
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select,
      selectColumn('column_name'),
      joins('table1')(
        right('table2')(
          eq('table1.column_name')('table2.column_name')
        )
      )
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 FULL OUTER JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select,
      selectColumn('column_name'),
      joins('table1')(
        full('table2')(
          eq('table1.column_name')('table2.column_name')
        )
      )
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 FULL OUTER JOIN table2 ON table1.column_name = table2.column_name)')
  })
})
describe('ordering and grouping', function () {
  it('should return \'SELECT * FROM CUSTOMERS ORDER BY NAME, SALARY\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('CUSTOMERS'),
      orderBy('NAME', 'SALARY')
    )
    expect(sql).to.equal('SELECT * FROM CUSTOMERS ORDER BY NAME, SALARY')
  })
  it('should return \'SELECT * FROM CUSTOMERS ORDER BY NAME DESC, SALARY\'', function () {
    const sql = sqlCompose(
      select,
      allColumns,
      from('CUSTOMERS'),
      orderBy(
        desc('NAME'),
        'SALARY'
      )
    )
    expect(sql).to.equal('SELECT * FROM CUSTOMERS ORDER BY NAME DESC, SALARY')
  })
  it('should return \'SELECT (NAME, SUM(SALARY)) FROM CUSTOMERS GROUP BY NAME\'', function () {
    const sql = sqlCompose(
      select,
      columns(
        column('NAME'),
        column(sum('SALARY'))
      ),
      from('CUSTOMERS'),
      groupBy('NAME')
    )
    expect(sql).to.equal('SELECT (NAME, SUM(SALARY)) FROM CUSTOMERS GROUP BY NAME')
  })
  it.skip('should return \'\'', function () {
    const sql = null
    expect(sql).to.equal('')
  })
  it.skip('should return \'\'', function () {
    const sql = null
    expect(sql).to.equal('')
  })
})
