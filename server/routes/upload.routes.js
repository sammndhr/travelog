const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils'),
	upload = require('../models/s3.config'),
	{ saveAllData } = require('../controller/upload.controller'),
	{ verifyToken } = require('../utils/auth')

router.post(
	'/',
	verifyToken,
	upload.array('photos', 20),
	wrapAsync(saveAllData)
)
module.exports = router
