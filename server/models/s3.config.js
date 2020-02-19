const AWS = require('aws-sdk'),
	fs = require('fs')
const s3Config = require('../config/').s3

const {
	accessKeyId,
	secretAccessKey,
	region,
	apiVersion,
	bucket,
	originalBucket
} = s3Config
AWS.config.update({ region })

const s3 = new AWS.S3({
	apiVersion,
	accessKeyId,
	secretAccessKey
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

const uploadOriginal = async ({ key, path }, cb) => {
	const fileContent = fs.readFileSync(path),
		params = {
			Bucket: originalBucket,
			Key: `${key}`,
			Body: fileContent
		}

	s3.upload(params, function(err, data) {
		if (err) {
			throw err
		}
		cb()
	})
}

const uploadConvertedFile = async ({ key, path }, cb) => {
	const fileContent = fs.readFileSync(path),
		params = {
			Bucket: bucket,
			Key: `${key}`,
			Body: fileContent
		}

	s3.upload(params, function(err, data) {
		if (err) {
			throw err
		}
		cb()
	})
}

const uploadToS3 = async (request, response, next) => {
	const { key, resizedPath, path } = request.s3UploadData

	try {
		//pls fix. Stop descend to callback hell.
		uploadConvertedFile({ key, path: resizedPath }, function() {
			uploadOriginal({ key, path }, function() {
				next()
			})
		})
	} catch (error) {
		console.error(error)
	}
}

module.exports = { _delete, uploadToS3 }
