const { Pool } = require('pg')

const { psql } = require('../config/DO_NOT_COMMIT.env.vars'),
	pool = new Pool(psql)

async function query(text, params) {
	const res = await pool.query(text, params).catch(err => {
		console.log(err)
		throw err
	})
	return res
}

module.exports = { query }
