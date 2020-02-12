const AWS = require('aws-sdk'),
	multer = require('multer'),
	multerS3 = require('multer-s3')
const s3Config = require('../config/DO_NOT_COMMIT.env.vars').s3

let upload, _delete
if (process.env.NODE_ENV === 'development') {
	var storage = multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './uploads')
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname)
		}
	})
	upload = multer({ storage })
} else {
	const { accessKeyId, secretAccessKey, region, apiVersion, bucket } = s3Config
	AWS.config.update({ region })

	const s3 = new AWS.S3({
		apiVersion,
		accessKeyId,
		secretAccessKey
	})

	upload = multer({
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

	_delete = keys => {
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
}

module.exports = { upload, _delete }
