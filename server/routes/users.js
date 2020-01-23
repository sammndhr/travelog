var express = require('express')
var router = express.Router()

router.post('/register', (req, res) => {
	res.status(200).send({ success: 'Thanks for signing up!' })
})

router.post('/authenticate', (req, res) => {
	const responseJson = {
		id: 1,
		username: 'testo',
		token: 'fake-jwt-token'
	}
	res.status(200).send({ user: JSON.stringify(responseJson), success: 'You are logged in.' })
})

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource')
})

module.exports = router
