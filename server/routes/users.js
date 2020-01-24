const express = require('express'),
	router = express.Router(),
	UserControllter = require('../controller/users'),
	{ create, login } = UserControllter

router.post('/register', create)
router.post('/authenticate', login)

module.exports = router
