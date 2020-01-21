const { Pool } = require('pg')
const { connectionString } = require('../config/DO_NOT_COMMIT.env.vars')

const pool = new Pool({ connectionString })

module.exports = pool
