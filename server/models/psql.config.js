const { Pool } = require('pg')

const { psql } = require('../config/'),
  pool = new Pool(psql)

async function query(text, params) {
  const res = await pool.query(text, params).catch(err => {
    console.log(err)
    throw err
  })
  return res
}

module.exports = { query }
