const AWS = require('aws-sdk'),
	multer = require('multer'),
	multerS3 = require('multer-s3')
const s3Config = require('../config/').s3

const { accessKeyId, secretAccessKey, region, apiVersion, bucket } = s3Config
AWS.config.update({ region })

const s3 = new AWS.S3({
	apiVersion,
	accessKeyId,
	secretAccessKey
})

const upload = multer({
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

const _delete = keys => {
	const params = {
		Bucket: bucket,
		Delete: {
			Objects: keys,
			Quiet: false
		}
	}

	s3.deleteObjects(params, function(err, data) {
		if (err) throw err
	})
}

module.exports = { upload, _delete }
