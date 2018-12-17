
const pg = require('pg')
const connectionString = process.env.DATABASE_URL || 'postgres://mztppqbh:StdhwJjD0igRdeiVWkNYd2zd076421uT@stampy.db.elephantsql.com:5432/mztppqbh'
const query = async (query) => {
  const client = new pg.Client(connectionString)
  client.connect()
  const res = await client.query(query)
  client.on('end', () => { client.end() })
  return res.rows
}
module.exports = {
  query
}
