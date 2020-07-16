const microtime = require('microtime')
const { sqlCompose, select, from, where, or, eq, joins, inner, fromForeign } = require('../build/index')
const knex = require('knex')

const toString = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
const suites = (...fns) => (name, benchmarkFn) => fns.reduce((acc, fn) => Object.assign(acc, { ...(fn(benchmarkFn)) }),{ name })
const cycleCount = iterations => (fn) => {
  const stats = {  }
  const startTime = microtime.now()
  for(let i = 1; i <= iterations; i++) {
    fn()
  }
  const endTime = microtime.now()
  stats.duration = `${toString((endTime - startTime) / 1000)} milliseconds`
  return stats
}
const within = milliseconds => fn => {
  const stats = { count: 0 }
  const endTime = microtime.now() + (milliseconds * 1000)
  while (true) {
    fn()
    stats.count++
    if (microtime.now() >= endTime) {
      break
    }
  }
  stats.countString = `${toString(stats.count)} queries/sec`
  return stats
}
const getSql = fn => ({ sql: fn() })
const sortByCount = (a, b) => b.count - a.count
const toPercentFixed = (acc, obj) => ((obj.count / acc.count) * 100).toFixed(1)
const getPercent = (acc, obj) => `${obj.countString} ${acc.count ? toPercentFixed(acc, obj) : 100}%`
const getCount = (acc, obj) => acc.count ? acc.count : obj.count
const reducer = (acc, obj) => ({ ...acc, [`${obj.name}`]: getPercent(acc, obj), count: getCount(acc, obj) })

const conn = knex({
  client: 'mysql',
  version: '5.7',
  connection: {
    host : '127.0.0.1',
    user : 'your_database_user',
    password : 'your_database_password',
    database : 'myapp_test'
  }
})
const sqlComposeFunction = () => sqlCompose(select('*'), from('users'), where(eq('id', 1)))
const knexFunction = () => conn.select('*').from('users').where('id', 1).toString()
const knexInnerJoin = () => conn('users').innerJoin('accounts', function() {
  this.on('accounts.id', '=', 'users.account_id').orOn('accounts.owner_id', '=', 'users.id')
}).toString()
const sqlComposeInnerJoin = () => sqlCompose(
  select('*'),
  joins('users',
    inner('accounts',
      or(
        eq('accounts.id', 'users.account_id'),
        eq('accounts.owner_id', 'users.id')
      )
    )
  )
)

const memorizedSql = sqlCompose(select('*'), from('users'))
const selectAllFromUsersWhereIdEquals1 = () => sqlCompose(memorizedSql, where(eq('id', 1)))

const bench = (report) => {
  const oneThousandIterations = cycleCount(1000)
  const within1000 = within(1000)
  const suite = suites(getSql, oneThousandIterations, within1000)
  const selectResults = [
    suite('sql-compose', sqlComposeFunction),
    suite('knex', knexFunction),
    suite('partial memorized sql-compose', selectAllFromUsersWhereIdEquals1 )
  ]
    .sort(sortByCount)
    .reduce(reducer, { name: 'select', count: null })
  const innerJoinResults = [
    suite('sql-compose', sqlComposeInnerJoin),
    suite('knex', knexInnerJoin)
  ]
    .sort(sortByCount)
    .reduce(reducer, { name: 'inner join', count: null })
  if (report) {
    console.log(JSON.stringify(selectResults, null, 2))
    console.log(JSON.stringify(innerJoinResults, null, 2))
  }
}

bench()
bench(true)

