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

const uploadOriginal = async ({ key, path }) => {
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
		console.log(`File uploaded successfully. ${data.Location}`)
	})
}

const uploadConvertedFile = async ({ key, path }) => {
	const fileContent = fs.readFileSync(path),
		params = {
			Bucket: bucket,
			Key: `r-${key}`,
			Body: fileContent
		}

	s3.upload(params, function(err, data) {
		if (err) {
			throw err
		}
		console.log(`File uploaded successfully. ${data.Location}`)
	})
}

const uploadToS3 = async (request, response, next) => {
	const { key, resizedPath, path } = request.s3UploadData
	try {
		await uploadOriginal({ key, path })
		await uploadConvertedFile({ key, path: resizedPath })
	} catch (error) {
		console.error(error)
	}
	next()
}
module.exports = { _delete, uploadToS3 }
