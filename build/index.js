"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromForeign = exports.full = exports.right = exports.left = exports.inner = exports.join = exports.joins = exports.desc = exports.orderBy = exports.groupBy = exports.all = exports.any = exports.exists = exports.between = exports.like = exports.whereIn = exports.isNull = exports.lte = exports.lt = exports.gte = exports.gt = exports.eq = exports.operate = exports.or = exports.and = exports.where = exports.updates = exports.set = exports.keyValue = exports.keyValuePairs = exports.on = exports.from = exports.sum = exports.avg = exports.count = exports.selectFn = exports.deleteFrom = exports.update = exports.insertInto = exports.select = exports.foreignKey = exports.primaryKey = exports.defaultValue = exports.unique = exports.notNull = exports.autoInc = exports.integer = exports.varchar = exports.columns = exports.column = exports.createUniqueIndex = exports.createIndex = exports.createView = exports.createTable = exports.as = exports.sqlCompose = exports.curry = void 0;
var sqlString = require("sqlstring");
exports.curry = function (fn, arity) {
    if (arity === void 0) { arity = fn.length; }
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return arity <= args.length
        ? fn.apply(void 0, args) : exports.curry.bind.apply(exports.curry, __spreadArrays([null, fn, arity], args));
};
exports.sqlCompose = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return args.join(' ');
};
exports.as = exports.curry(function (key, alias) { return key + " AS " + alias; });
// TABLE QUERIES
var create = exports.curry(function (type, name) { return "CREATE " + type + " " + name; });
exports.createTable = create('TABLE');
exports.createView = exports.curry(function (name, view) { return exports.as(create('VIEW', name), view); });
exports.createIndex = exports.curry(create('INDEX'));
exports.createUniqueIndex = create('UNIQUE INDEX');
exports.column = exports.curry(function (key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return key + " " + args.join(' ');
});
exports.columns = function () {
    var columns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        columns[_i] = arguments[_i];
    }
    return "(" + columns.join(',') + ")";
};
exports.varchar = function (length) { return "varchar(" + length + ")"; };
exports.integer = 'int';
exports.autoInc = 'AUTO_INCREMENT';
exports.notNull = 'NOT NULL';
exports.unique = function (key) { return "UNIQUE (" + key + ")"; };
exports.defaultValue = function (defaultValue) { return "DEFAULT " + sqlString.escape(defaultValue); };
exports.primaryKey = function (key) { return "PRIMARY KEY (" + key + ")"; };
exports.foreignKey = exports.curry(function (key, fTable, fKey) { return "FOREIGN KEY (" + key + ") REFERENCES " + fTable + "(" + fKey + ")"; });
// Queries
exports.select = function () {
    var columns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        columns[_i] = arguments[_i];
    }
    return "SELECT " + columns.join(',');
};
exports.insertInto = function (table) { return "INSERT INTO " + table; };
exports.update = function (table) { return "UPDATE " + table; };
exports.deleteFrom = function (table) { return "DELETE FROM " + table; };
exports.selectFn = exports.curry(function (fn, key) { return fn + "(" + key + ")"; });
exports.count = exports.selectFn('COUNT');
exports.avg = exports.selectFn('AVG');
exports.sum = exports.selectFn('SUM');
exports.from = function (table) { return "FROM " + table; };
exports.on = function (arg) { return "ON " + arg; };
exports.keyValuePairs = function () {
    var values = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        values[_i] = arguments[_i];
    }
    var o = { keys: [], values: [] };
    for (var _a = 0, values_1 = values; _a < values_1.length; _a++) {
        var kv = values_1[_a];
        o.keys.push(kv.key);
        o.values.push(kv.value);
    }
    return "(" + o.keys.join(',') + ") VALUES (" + o.values.join(',') + ")";
};
exports.keyValue = exports.curry(function (key, value) { return ({ key: key, value: sqlString.escape(value) }); });
exports.set = exports.curry(function (key, value) { return key + " = " + sqlString.escape(value); });
exports.updates = function () {
    var sets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sets[_i] = arguments[_i];
    }
    return "SET " + sets.join(', ');
};
exports.where = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return "WHERE " + conditions.join(' ');
};
exports.and = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return "(" + conditions.join(' AND ') + ")";
};
exports.or = function () {
    var conditions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        conditions[_i] = arguments[_i];
    }
    return "(" + conditions.join(' OR ') + ")";
};
exports.operate = exports.curry(function (operator, key, value) { return key + " " + operator + " " + value; });
exports.eq = exports.operate('=');
exports.gt = exports.operate('>');
exports.gte = exports.operate('>=');
exports.lt = exports.operate('<');
exports.lte = exports.operate('<=');
exports.isNull = function (key) { return key + " IS NULL"; };
exports.whereIn = exports.curry(function (key) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        values[_i - 1] = arguments[_i];
    }
    return key + " IN (" + values.map(function (v) { return "" + sqlString.escape(v); }).join(', ') + ")";
});
exports.like = exports.curry(function (key, pattern) { return key + " LIKE " + sqlString.escape(pattern); });
exports.between = exports.curry(function (key, value1, value2) { return key + " BETWEEN " + sqlString.escape(value1) + " AND " + sqlString.escape(value2); });
exports.exists = function (sql) { return "EXISTS (" + sql + ")"; };
exports.any = function (sql) { return "ANY (" + sql + ")"; };
exports.all = function (sql) { return "ALL (" + sql + ")"; };
exports.groupBy = function (column) { return "GROUP BY " + column; };
exports.orderBy = function () {
    var columns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        columns[_i] = arguments[_i];
    }
    return "ORDER BY " + columns.join(', ');
};
exports.desc = function (column) { return column + " DESC"; };
// joins
exports.joins = exports.curry(function (table) {
    var joins = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        joins[_i - 1] = arguments[_i];
    }
    return "FROM " + joins.reduce(function (acc, str) { return "(" + acc + " " + str + ")"; }, table);
});
exports.join = exports.curry(function (type, table, condition) { return type + " JOIN " + table + " ON " + condition; });
exports.inner = exports.join('INNER');
exports.left = exports.join('LEFT');
exports.right = exports.join('RIGHT');
exports.full = exports.join('FULL OUTER');
exports.fromForeign = exports.curry(function (table, key) { return table + "." + key; });
//# sourceMappingURL=index.js.map