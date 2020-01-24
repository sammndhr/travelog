const express = require('express'),
	router = express.Router(),
	UserControllter = require('../controller/users'),
	{ create, login } = UserControllter

router.post('/register', create)
router.post('/authenticate', login)
// router.post('/register', (req, res, next) => {
// 	console.log(req.body)
// 	console.log('this works')
// 	res.status(200).send({ success: 'Thanks for signing up!' })
// })

// router.post('/authenticate', (req, res) => {
// 	const responseJson = {
// 		id: 1,
// 		email: 'testo',
// 		token: 'fake-jwt-token'
// 	}
// 	res
// 		.status(200)
// 		.send({ user: JSON.stringify(responseJson), success: 'You are logged in.' })
// })

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource')
})

module.exports = router
