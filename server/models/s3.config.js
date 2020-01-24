const AWS = require('aws-sdk'),
	multer = require('multer'),
	multerS3 = require('multer-s3')

const {
	accessKeyId,
	secretAccessKey,
	region,
	apiVersion,
	bucket
} = require('../config/DO_NOT_COMMIT.env.vars').s3

AWS.config.update({ region })

const s3 = new AWS.S3({
	apiVersion,
	accessKeyId,
	secretAccessKey
})

const uploadToS3 = multer({
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

const uploadToFS = multer({ dest: './uploads' })

const upload = process.env.NODE_ENV === 'development' ? uploadToFS : uploadToS3

module.exports = upload
