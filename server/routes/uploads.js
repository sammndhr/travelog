var express = require('express')
var router = express.Router()
var multer = require('multer')
var multerS3 = require('multer-s3')

const { accessKeyId, secretAccessKey, region, apiVersion, bucket } = require('../config/DO_NOT_COMMIT.env.vars').s3
var AWS = require('aws-sdk')

AWS.config.update({ region })
var s3 = new AWS.S3({
	apiVersion,
	accessKeyId,
	secretAccessKey
})

var upload = multer({
	storage: multerS3({
		s3,
		bucket,
		metadata: function(req, file, cb) {
			cb(null, { fieldName: file.fieldname })
		},
		key: function(req, file, cb) {
			cb(null, file.originalname)
		}
	})
})

// const upload = multer({ dest: './uploads' })
router.post('/', upload.array('photos', 20), function(req, res, next) {
	res.send('Successfully uploaded ' + req.files.length + ' files!')
})

// router.post('/', upload.single('file'), function(req, res, next) {
// 	res.json({ file: req.file })
// })

module.exports = router
