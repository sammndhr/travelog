const { Pool } = require('pg')

const { connectionString } = require('../config/DO_NOT_COMMIT.env.vars'),
	pool = new Pool({
		connectionString
	})

async function query(text, params) {
	return await pool.query(text, params)
}

module.exports = { query }
