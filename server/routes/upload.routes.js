const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils'),
	{ upload, uploadConvertedFile } = require('../models/s3.config'),
	{
		deleteData,
		deleteImages,
		saveAllData,
		getGeoJson,
		convertImage
	} = require('../controller/upload.controller'),
	{ verifyToken } = require('../utils/')

router.get('/log', verifyToken, wrapAsync(getGeoJson))

router.post(
	'/',
	verifyToken,
	upload.array('photos', 200),
	wrapAsync(saveAllData),
	wrapAsync(convertImage),
	wrapAsync(uploadConvertedFile),
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
