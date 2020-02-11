const { createError } = require('../utils')
const { query } = require('../models/psql.config')
const {
	hashPassword,
	comparePassword,
	isValidEmail,
	generateToken
} = require('../utils')

const User = {
	async create(req, res, next) {
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

		const createQuery = `INSERT INTO
      users (email, password)
			VALUES ($1, $2)
			RETURNING *;`
		const hashedPassword = hashPassword(password),
			values = [email, hashedPassword]

		try {
			const results = await query(createQuery, values)
			const rows = results.rows
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
			const { rows } = await query(text, [req.body.email])
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
			const userId = rows[0].user_id,
				token = generateToken(userId)
			return res.status(200).send({ token, userId })
		} catch (error) {
			return res.status(400).send(error)
		}
	},

	async delete(req, res) {
		const deleteQuery = 'DELETE FROM users WHERE id=$1 returning *;'
		try {
			const { rows } = await query(deleteQuery, [req.user.id])
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
