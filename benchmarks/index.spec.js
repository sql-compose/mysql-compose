const microtime = require('microtime')
const { sqlCompose, select, from, where, eq } = require('../build/index')
const knex = require('knex')

const cycleCount = iterations => fn => {
  const stats = { }
  stats.startTime = microtime.now()
  for(let i = 1; i <= iterations; i++) {
    fn()
  }
  stats.endTime = microtime.now()
  stats.duration = stats.endTime - stats.startTime
  return stats
}
const within = milliseconds => fn => {
  const stats = { count: 0, result: fn() }
  const endTime = microtime.now() + (milliseconds * 1000)
  while (true) {
    fn()
    stats.count++
    if (microtime.now() >= endTime) {
      break
    }
  }
  return stats
}
const combineStats = (obj1, obj2) => Object.assign({ ...obj1 }, { ...obj2 })
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
const sqlComposeFunction2 = () => select('*') + ' ' + from('users') + ' ' + where(eq('id', 1))
const knexFunction = () => conn.select('*').from('users').where('id', 1).toString()

const bench = (report) => {
  const oneThousandIterations = cycleCount(1000)
  const within1000 = within(1000)
  const sqlCompose1Stats = combineStats(oneThousandIterations(sqlComposeFunction), within1000(sqlComposeFunction))
  const sqlCompose2Stats = combineStats(oneThousandIterations(sqlComposeFunction2), within1000(sqlComposeFunction2))
  const knexStats = combineStats(oneThousandIterations(knexFunction), within1000(knexFunction))
  if (report === true) {
    console.log(sqlCompose1Stats)
    console.log(sqlCompose2Stats)
    console.log(knexStats)
  }
}

bench()
bench(true)

