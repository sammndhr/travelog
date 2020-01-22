const express = require('express'),
	router = express.Router()

const upload = require('../models/s3.config'),
	{ saveImagesAndExif } = require('../controller/upload')

router.post('/', upload.array('photos', 10), saveImagesAndExif)

module.exports = router
