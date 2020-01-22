var express = require('express')
var router = express.Router()
require('../controller/user')

// router.post('/signin', user.signin)
router.post('/signup', (req, res) => {
	console.log(req.body, res.params)
	res.send('Thanks for signing up!')
})

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource')
})

module.exports = router
