const { Pool } = require('pg')

const { connectionString } = require('../config/DO_NOT_COMMIT.env.vars'),
	pool = new Pool({
		connectionString
	})

async function query(text, params) {
	const res = await pool.query(text, params).catch(err => {
		throw err
	})
	return res
}

module.exports = { query }
