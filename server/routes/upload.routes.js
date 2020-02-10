const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils'),
	upload = require('../models/s3.config'),
	{ saveAllData, getGeoJson } = require('../controller/upload.controller'),
	{ verifyToken } = require('../utils/')

router.get('/log', verifyToken, wrapAsync(getGeoJson))
router.post(
	'/',
	verifyToken,
	upload.array('photos', 20),
	wrapAsync(saveAllData),
	wrapAsync(getGeoJson)
)

function deleteItems(images) {
	console.log(images)
}

router.post('/deletes', verifyToken, deleteItems)

module.exports = router
