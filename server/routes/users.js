const express = require('express'),
	router = express.Router()
const UserControllter = require('../controller/users'),
	{ create, login } = UserControllter,
	{ wrapAsync } = require('../utils')

router.post('/register', wrapAsync(create))
router.post('/authenticate', wrapAsync(login))

module.exports = router
