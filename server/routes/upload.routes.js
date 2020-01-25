const express = require('express'),
	router = express.Router()

const { wrapAsync } = require('../utils')

const upload = require('../models/s3.config'),
	{ saveImagesAndExif } = require('../controller/upload.controller')

router.post('/', upload.array('photos', 20), wrapAsync(saveImagesAndExif))
module.exports = router
