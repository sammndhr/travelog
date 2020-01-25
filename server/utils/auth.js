const bcrypt = require('bcrypt'),
	jwt = require('jsonwebtoken'),
	db = require('./../models/psql.config')

const AuthHelper = {
	hashPassword(password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
	},

	comparePassword(hashPassword, password) {
		return bcrypt.compareSync(password, hashPassword)
	},

	isValidEmail(email) {
		return /\S+@\S+\.\S+/.test(email)
	},

	generateToken(id) {
		const token = jwt.sign(
			{
				userId: id
			},
			process.env.SECRET,
			{ expiresIn: '7d' }
		)
		return token
	},

	async verifyToken(req, res, next) {
		const token = req.headers['x-access-token']
		if (!token) {
			console.log('Unable to verify token. Token is not provided.')
			return res.status(400).send({ message: 'Token is not provided' })
		}
		try {
			const decoded = await jwt.verify(token, process.env.SECRET)
			const text = 'SELECT * FROM users WHERE user_id = $1'
			await db.query(text, [decoded.userId])
			req.user = { id: decoded.userId }
			next()
		} catch (error) {
			return res
				.status(400)
				.send({ message: 'The token you provided is invalid' })
		}
	}
}

module.exports = AuthHelper
