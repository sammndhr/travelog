const { Client, Pool } = require('pg')
const db = require('../config/DO_NOT_COMMIT.env.vars')

// const pool = new Pool(db)

const client = new Client(db)

client.connect()

const createImageExif = (request, response) => {
	const { name, exif } = request.body
	// client.query('CREATE TABLE images ( image_id SERIAL PRIMARY KEY, name VARCHAR (355) NOT NULL,exif json NOT NULL);')
	client.query('INSERT INTO images (name, exif) VALUES ($1, $2) RETURNING *', [name, exif], (error, results) => {
		if (error) {
			throw error
		}
		response.status(201).send({ res: results })
		client.end()
	})
}

module.exports = { createImageExif }
