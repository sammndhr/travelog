const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils'),
	{ uploadToS3 } = require('../models/s3.config'),
	{
		deleteData,
		deleteImages,
		saveAllData,
		getGeoJson,
		convertImage,
		uploadToDisk,
		removeFromDisk
	} = require('../controller/upload.controller'),
	{ verifyToken } = require('../utils/')

router.get('/log', verifyToken, wrapAsync(getGeoJson))

router.post(
	'/',
	verifyToken,
	uploadToDisk.array('photos', 200),
	wrapAsync(saveAllData),
	wrapAsync(convertImage),
	wrapAsync(uploadToS3),
	removeFromDisk,
	wrapAsync(getGeoJson)
)

router.post(
	'/deletes',
	verifyToken,
	wrapAsync(deleteData),
	wrapAsync(deleteImages),
	wrapAsync(getGeoJson)
)

module.exports = router
