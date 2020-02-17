const AWS = require('aws-sdk'),
	multer = require('multer'),
	fs = require('fs')
const s3Config = require('../config/').s3

const { accessKeyId, secretAccessKey, region, apiVersion, bucket } = s3Config
AWS.config.update({ region })

const s3 = new AWS.S3({
	apiVersion,
	accessKeyId,
	secretAccessKey
})

// const upload = multer({
// 	storage: multerS3({
// 		s3,
// 		bucket,
// 		metadata: function(req, file, cb) {
//       console.log(file);
// 			cb(null, { fieldName: file.fieldname })
// 		},
// 		key: function(req, file, cb) {
// 			cb(null, file.originalname)
//     },
//     // done: function(req, file, cb) {
//     //   const filePath = resizeAndOrient(file)
//     //   s3Upload(filePath)

//     // }
// 	})
// })

const upload = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './uploads/originals/')
		},
		filename: function(req, file, cb) {
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

const uploadConvertedFile = async (request, response, next) => {
	const { key, resizedPath, path } = request.s3UploadData,
		fileContent = fs.readFileSync(path),
		params = {
			Bucket: bucket,
			Key: `resized-${key}`,
			Body: fileContent
		}

	s3.upload(params, function(err, data) {
		if (err) {
			throw err
		}
		console.log(`File uploaded successfully. ${data.Location}`)
		next()
	})
}

module.exports = { upload, _delete, uploadConvertedFile }
