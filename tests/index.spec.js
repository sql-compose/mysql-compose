const {
  sqlCompose,
  createTable, createView, createIndex, createUniqueIndex,
  select, count, avg, sum,
  insertInto, keyValuePairs, keyValue,
  update, updates, set,
  deleteFrom,
  column, columns,
  integer, varchar,
  autoInc, notNull, defaultValue,
  primaryKey, foreignKey, unique,
  from, as, on,
  where, and, or, eq, gt, gte, lt, lte, isNull, between, whereIn, exists, any, all, like,
  orderBy, groupBy, desc,
  joins, inner, left, right, full  } = require('../build/index')
const { expect } = require('chai')
describe('creating a table', function () {
  it('should return \'CREATE TABLE Foo (Bar int AUTO_INCREMENT NOT NULL,Baz varchar(255) DEFAULT \'Default Value\'\'', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('Bar', integer, autoInc, notNull),
        column('Baz', varchar(255), defaultValue('Default Value'))
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (Bar int AUTO_INCREMENT NOT NULL,Baz varchar(255) DEFAULT \'Default Value\')')
  })
  it('should return \'CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT,PRIMARY KEY (ID))\'', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('ID', integer, notNull, autoInc),
        primaryKey('ID')
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT,PRIMARY KEY (ID))')
  })
  it('should return \'CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT,Bar varchar(255),PRIMARY KEY (ID),FOREIGN KEY (Bar) REFERENCES Baz(Bar))\'', function () {
    const sql = sqlCompose(
      createTable('Foo'),
      columns(
        column('ID', integer, notNull, autoInc),
        column('Bar', varchar(255)),
        primaryKey('ID'),
        foreignKey('Bar', 'Baz', 'Bar')
      )
    )
    expect(sql).to.equal('CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT,Bar varchar(255),PRIMARY KEY (ID),FOREIGN KEY (Bar) REFERENCES Baz(Bar))')
  })
  it('should return \'CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT)\'', function () {
    expect(sqlCompose(
      createTable('Foo'),
      columns(
        column('ID', integer, notNull, autoInc)
      )
    )).to.equal('CREATE TABLE Foo (ID int NOT NULL AUTO_INCREMENT)')
  })
  it('should return \'CREATE TABLE Table1 (ID int,Column2 int,UNIQUE (ID))\'', function () {
    expect(sqlCompose(
      createTable('Table1'),
      columns(
        column('ID', integer),
        column('Column2', integer),
        unique('ID')
      )
    )).to.equal('CREATE TABLE Table1 (ID int,Column2 int,UNIQUE (ID))')
  })
})
describe('selecting', function () {
  const selectAll = select('*')
  const selectAllFrom = table => sqlCompose(selectAll, from(table))
  const selectAllFromTable1 = selectAllFrom('table1')
  const selectAllFromTable_name = selectAllFrom('table_name')
  const selectAllFromCustomers = selectAllFrom('Customers')
  const column1Eq = eq('column1')
  const column1gt = gt('column1')
  const column1gte = gte('column1')
  const column1lt = lt('column1')
  const column1lte = lte('column1')
  const column1IsNull = isNull('column1')
  const column2Eq = eq('column2')
  it('should return \'SELECT column1,column2 FROM Table1\'', function () {
    const sql = sqlCompose(
      select('column1', 'column2'),
      from('Table1')
    )
    expect(sql).to.equal('SELECT column1,column2 FROM Table1')
  })
  it('should return \'SELECT column1 AS Bar,column2 FROM Table1\'', function () {
    expect(sqlCompose(
      select(as('column1', 'Bar'), 'column2'),
      from('Table1')
    )).to.equal('SELECT column1 AS Bar,column2 FROM Table1')
  })
  it('should return \'SELECT column1 AS Bar,column2 FROM Table1 WHERE column1 = 1\'', function () {
    expect(sqlCompose(
      select(as('column1', 'Bar'), 'column2'),
      from('Table1'),
      where(
        column1Eq(1)
      )
    )).to.equal('SELECT column1 AS Bar,column2 FROM Table1 WHERE column1 = 1')
  })
  it('should return \'SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 AND column2 = 1)\'', function () {
    expect(sqlCompose(
      select(as('column1', 'Bar'), 'column2'),
      from('Table1'),
      where(
        and(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 AND column2 = 1)')
  })
  it('should return \'SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 AND column2 = 1)\'', function () {
    expect(sqlCompose(
      select(as('column1', 'Bar'), 'column2'),
      from('Table1'),
      where(
        and(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 AND column2 = 1)')
  })
  it('should return \'SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 OR column2 = 1)\'', function () {
    expect(sqlCompose(
      select(as('column1', 'Bar'), 'column2'),
      from('Table1'),
      where(
        or(
          column1Eq(1),
          column2Eq(1)
        )
      )
    )).to.equal('SELECT column1 AS Bar,column2 FROM Table1 WHERE (column1 = 1 OR column2 = 1)')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 > 1\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        column1gt(1)
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 > 1')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 >= 1\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        column1gte(1)
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 >= 1')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 < 1\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        column1lt(1)
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 < 1')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 <= 1\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        column1lte(1)
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 <= 1')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 IS NULL\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        column1IsNull
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 IS NULL')
  })
  it('should return \'SELECT column1 FROM Table1 WHERE column1 BETWEEN 1 AND 5\'', function () {
    expect(sqlCompose(
      select('column1'),
      from('Table1'),
      where(
        between('column1')(1, 5)
      )
    )).to.equal('SELECT column1 FROM Table1 WHERE column1 BETWEEN 1 AND 5')
  })
  it('should return \'SELECT * FROM table1 WHERE ID IN (1, 2, 3, 4, 5)\'', function () {
    expect(sqlCompose(
      selectAllFromTable1,
      where(whereIn('ID', 1, 2, 3, 4, 5))
    )).to.equal('SELECT * FROM table1 WHERE ID IN (1, 2, 3, 4, 5)')
  })
  it('should return \'SELECT * FROM table_name WHERE EXISTS (SELECT column_name FROM table_name WHERE ID = 1)\'', function () {
    const selectionExists = exists(
      sqlCompose(
        select('column_name'),
        from('table_name'),
        where(eq('ID', 1))
      )
    )
    const sql = sqlCompose(
      selectAllFromTable_name,
      where(selectionExists)
    )
    expect(sql).to.equal('SELECT * FROM table_name WHERE EXISTS (SELECT column_name FROM table_name WHERE ID = 1)')
  })
  it('should return \'SELECT * FROM table_name WHERE column_name = ANY (SELECT column_name FROM table_name WHERE column_name = 1)\'', function () {
    const sql = sqlCompose(
      selectAllFromTable_name,
      where(
        eq('column_name')(any(
          sqlCompose(
            select('column_name'),
            from('table_name'),
            where(
              eq('column_name', 1)
            )
          )
        ))
      )
    )
    expect(sql).to.equal('SELECT * FROM table_name WHERE column_name = ANY (SELECT column_name FROM table_name WHERE column_name = 1)')
  })
  it('should return \'SELECT * FROM table_name WHERE column_name = ALL (SELECT column_name FROM table_name WHERE column_name = 1)\'', function () {
    const sql = sqlCompose(
      selectAllFromTable_name,
      where(
        eq('column_name')(
          all(
            sqlCompose(
              select('column_name'),
              from('table_name'),
              where(
                eq('column_name')(1)))))))
    expect(sql).to.equal('SELECT * FROM table_name WHERE column_name = ALL (SELECT column_name FROM table_name WHERE column_name = 1)')
  })
  it('should return \'SELECT * FROM Customers WHERE CustomerName LIKE \'a%\'\'', function () {
    const sql = sqlCompose(
      selectAllFromCustomers,
      where(
        like('CustomerName')('a%')
      )
    )
    expect(sql).to.equal('SELECT * FROM Customers WHERE CustomerName LIKE \'a%\'')
  })
  it('should return \'SELECT * FROM Customers WHERE CustomerName LIKE \'_r%\'\'', function () {
    const sql = sqlCompose(
      selectAllFromCustomers,
      where(
        like('CustomerName')('_r%')
      )
    )
    expect(sql).to.equal('SELECT * FROM Customers WHERE CustomerName LIKE \'_r%\'')
  })
})
describe('inserting rows', function () {
  it('should return \'INSERT INTO table1 (column1,column2) VALUES (1,2)\'', function () {
    const sql = sqlCompose(
      insertInto('table1'),
      keyValuePairs(
        keyValue('column1', 1),
        keyValue('column2', 2)
      )
    )
    expect(sql).to.equal('INSERT INTO table1 (column1,column2) VALUES (1,2)')
  })
  it('should return \'INSERT INTO table1 (column1,column2) VALUES (1,`Foo Bar`)\'', function () {
    const sql = sqlCompose(
      insertInto('table1'),
      keyValuePairs(
        keyValue('column1', 1),
        keyValue('column2', 'Foo Bar')
      )
    )
    expect(sql).to.equal('INSERT INTO table1 (column1,column2) VALUES (1,\'Foo Bar\')')
  })
})
describe('updating rows', function () {
  it('should return \'UPDATE table1 SET column1 = 1, column2 = 2 WHERE ID <= 5\'', function () {
    expect(sqlCompose(
      update('table1'),
      updates(
        set('column1', 1),
        set('column2', 2)
      ),
      where(lte('ID', 5))
    )).to.equal('UPDATE table1 SET column1 = 1, column2 = 2 WHERE ID <= 5')
  })
})
describe('sql functions', function () {
  it('should return \'SELECT COUNT(column1) FROM table1 WHERE ID = 1\'', function () {
    const sql = sqlCompose(
      select(count('column1')),
      from('table1'),
      where(eq('ID', 1))
    )
    expect(sql).to.equal('SELECT COUNT(column1) FROM table1 WHERE ID = 1')
  })
  it('should return \'SELECT AVG(column1) FROM table1 WHERE ID = 1\'', function () {
    const sql = sqlCompose(
      select(avg('column1')),
      from('table1'),
      where(eq('ID', 1))
    )
    expect(sql).to.equal('SELECT AVG(column1) FROM table1 WHERE ID = 1')
  })
  it('should return \'SELECT SUM(column1) FROM table1 WHERE ID = 1\'', function () {
    const sql = sqlCompose(
      select(sum('column1')),
      from('table1'),
      where(eq('ID', 1))
    )
    expect(sql).to.equal('SELECT SUM(column1) FROM table1 WHERE ID = 1')
  })
})
describe('deleting rows', function () {
  it('should return \'DELETE FROM Table1 WHERE ID = 5\'', function () {
    const sql = sqlCompose(
      deleteFrom('Table1'),
      where(eq('ID', 5))
    )
    expect(sql).to.equal('DELETE FROM Table1 WHERE ID = 5')
  })
  it('should return \'DELETE FROM Table1 WHERE ID BETWEEN 1 AND 5\'', function () {
    const sql = sqlCompose(
      deleteFrom('Table1'),
      where(between('ID', 1, 5))
    )
    expect(sql).to.equal('DELETE FROM Table1 WHERE ID BETWEEN 1 AND 5')
  })
})
describe('creating a view', function () {
  it('should return \'CREATE VIEW view_name AS SELECT (column1, column2) FROM table_name WHERE column1 = 1', function () {
    const view = sqlCompose(
      select('column1', 'column2'),
      from('table_name'),
      where(eq('column1', 1))
    )
    const sql = createView('view_name', view)
    expect(sql).to.equal('CREATE VIEW view_name AS SELECT column1,column2 FROM table_name WHERE column1 = 1')
  })
})
describe('creating an index', function () {
  it('should return \'CREATE INDEX index_name ON table_name (column1,column2)', function () {
    const sql = sqlCompose(
      createIndex('index_name'),
      on('table_name'),
      columns('column1', 'column2')
    )
    expect(sql).to.equal('CREATE INDEX index_name ON table_name (column1,column2)')
  })
  it('should return \'CREATE UNIQUE INDEX index_name ON table_name (column1,column2)', function () {
    const sql = sqlCompose(
      createUniqueIndex('index_name'),
      on('table_name'),
      columns('column1', 'column2')
    )
    expect(sql).to.equal('CREATE UNIQUE INDEX index_name ON table_name (column1,column2)')
  })
})
describe('joining tables', function () {
  it('should return \'SELECT * FROM (table1 INNER JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select('*'),
      joins('table1',
        inner('table2',
          eq('table1.column_name', 'table2.column_name')
        )
      )
    )
    expect(sql).to.equal('SELECT * FROM (table1 INNER JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return a double inner join sql cmd', function () {
    const sql = sqlCompose(
      select('Orders.OrderID', 'Customers.CustomerName', 'Shippers.ShipperName'),
      joins('Orders',
        inner('Customers', eq('Orders.CustomerID', 'Customers.CustomerID')),
        inner('Shippers', eq('Orders.ShipperID', 'Shippers.ShipperID'))
      )
    )
    expect(sql)
      .to
      .equal('SELECT Orders.OrderID,Customers.CustomerName,Shippers.ShipperName FROM ((Orders INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID) INNER JOIN Shippers ON Orders.ShipperID = Shippers.ShipperID)')
  })
  it('should return \'SELECT column_name FROM table1 LEFT JOIN table2 ON table1.column_name = table2.column_name\'', function () {
    const sql = sqlCompose(
      select('column_name'),
      joins('table1', left('table2', eq('table1.column_name', 'table2.column_name')))
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select('column_name'),
      joins('table1', left('table2', eq('table1.column_name', 'table2.column_name')))
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 LEFT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select('column_name'),
      joins('table1', right('table2', eq('table1.column_name', 'table2.column_name')))
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 RIGHT JOIN table2 ON table1.column_name = table2.column_name)')
  })
  it('should return \'SELECT column_name FROM (table1 FULL OUTER JOIN table2 ON table1.column_name = table2.column_name)\'', function () {
    const sql = sqlCompose(
      select('column_name'),
      joins('table1', full('table2', eq('table1.column_name', 'table2.column_name')))
    )
    expect(sql).to.equal('SELECT column_name FROM (table1 FULL OUTER JOIN table2 ON table1.column_name = table2.column_name)')
  })
})
describe('ordering and grouping', function () {
  it('should return \'SELECT * FROM CUSTOMERS ORDER BY NAME, SALARY\'', function () {
    const sql = sqlCompose(
      select('*'),
      from('CUSTOMERS'),
      orderBy('NAME', 'SALARY')
    )
    expect(sql).to.equal('SELECT * FROM CUSTOMERS ORDER BY NAME, SALARY')
  })
  it('should return \'SELECT * FROM CUSTOMERS ORDER BY NAME DESC, SALARY\'', function () {
    const sql = sqlCompose(
      select('*'),
      from('CUSTOMERS'),
      orderBy(
        desc('NAME'),
        'SALARY'
      )
    )
    expect(sql).to.equal('SELECT * FROM CUSTOMERS ORDER BY NAME DESC, SALARY')
  })
  it('should return \'SELECT NAME,SUM(SALARY) FROM CUSTOMERS GROUP BY NAME\'', function () {
    const sql = sqlCompose(
      select('NAME', sum('SALARY')),
      from('CUSTOMERS'),
      groupBy('NAME')
    )
    expect(sql).to.equal('SELECT NAME,SUM(SALARY) FROM CUSTOMERS GROUP BY NAME')
  })
})
