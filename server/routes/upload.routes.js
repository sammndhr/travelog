const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils'),
	upload = require('../models/s3.config'),
	{
		saveAllData,
		getGeoJson,
		deleteData
	} = require('../controller/upload.controller'),
	{ verifyToken } = require('../utils/')

router.get('/log', verifyToken, wrapAsync(getGeoJson))

router.post(
	'/',
	verifyToken,
	upload.array('photos', 20),
	wrapAsync(saveAllData),
	wrapAsync(getGeoJson)
)

router.post(
	'/deletes',
	verifyToken,
	wrapAsync(deleteData),
	wrapAsync(getGeoJson)
)

module.exports = router
