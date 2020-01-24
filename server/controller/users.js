// const moment = require('moment'),
// 	uuidv4 = require('uuid/v4'),
// 	db = require('../db')
const { createError } = require('../utils')
const db = require('./../models/psql.config')
const {
	hashPassword,
	comparePassword,
	isValidEmail,
	generateToken
} = require('../utils')

const User = {
	async create(req, res) {
		const email = req.body.email,
			password = req.body.password
		if (!email || !password) {
			return res.status(400).send({ message: 'Some values are missing' })
		}
		if (!isValidEmail(email)) {
			return res
				.status(400)
				.send({ message: 'Please enter a valid email address' })
		}

		const hashedPassword = hashPassword(password)

		// users(id, email, password, created_date, modified_date)
		const createQuery = `INSERT INTO
      users (email, password)
			VALUES ($1, $2)
			returning *;`,
			values = [email, hashedPassword]

		try {
			const { rows } = await db.query(createQuery, values)
			if (rows) {
				const token = generateToken(rows[0].user_id)
				return res.status(201).send({ token })
			}
		} catch (error) {
			const errorToSend = createError(error.code, { email })
			return res.status(errorToSend.code).send({ message: errorToSend.message })
		}
	},

	async login(req, res) {
		if (!req.body.email || !req.body.password) {
			return res.status(400).send({ message: 'Some values are missing' })
		}
		if (!isValidEmail(req.body.email)) {
			return res
				.status(400)
				.send({ message: 'Please enter a valid email address' })
		}
		const text = 'SELECT * FROM users WHERE email = $1'
		try {
			const { rows } = await db.query(text, [req.body.email])
			if (!rows[0]) {
				return res
					.status(400)
					.send({ message: 'The credentials you provided is incorrect' })
			}
			if (!comparePassword(rows[0].password, req.body.password)) {
				return res
					.status(400)
					.send({ message: 'The credentials you provided is incorrect' })
			}
			const token = generateToken(rows[0].user_id)
			return res.status(200).send({ token })
		} catch (error) {
			return res.status(400).send(error)
		}
	},

	async delete(req, res) {
		const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *;'
		try {
			const { rows } = await db.query(deleteQuery, [req.user.id])
			if (!rows[0]) {
				return res.status(404).send({ message: 'user not found' })
			}
			return res.status(204).send({ message: 'deleted' })
		} catch (error) {
			return res.status(400).send(error)
		}
	}
}

module.exports = User
