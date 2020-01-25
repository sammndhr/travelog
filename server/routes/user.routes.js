const express = require('express'),
	router = express.Router()
const UserControllter = require('../controller/user.controller'),
	{ create, login } = UserControllter,
	{ wrapAsync } = require('../utils')

router.post('/register', wrapAsync(create))
router.post('/authenticate', wrapAsync(login))

module.exports = router
