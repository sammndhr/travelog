const multer = require('multer'),
	sharp = require('sharp'),
	fs = require('fs')

const { query } = require('../models/psql.config'),
	{ generateURL, parseExif, createFeature } = require('../utils/'),
	{ host, bucket, bucketRegion } = require('../config').s3,
	{ deleteFromS3, uploadConvertedFile } = require('../models/s3.config')

const addImageData = async ({
	userId,
	key,
	url,
	extension,
	geoJsonFeature
}) => {
	let results
	try {
		results = await query(
			'INSERT INTO images (user_id, key, url, extension, geo_json_feature) VALUES ($1, $2, $3, $4, $5);',
			[userId, key, url, extension, geoJsonFeature]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const addExif = async ({ key, exif }) => {
	let results
	try {
		results = await query('INSERT INTO exifs (key, exif) VALUES ($1, $2);', [
			key,
			exif
		])
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const saveImageData = async ({ userId, imageData }) => {
	const exif = imageData.exif,
		{ key, extension } = imageData,
		url = generateURL({ bucket, key, host, region: bucketRegion, extension })

	let results

	try {
		const parsedExif = await parseExif({ exif, key, url })
		const geoJsonFeature = createFeature(parsedExif)
		results = await addImageData({
			userId,
			geoJsonFeature,
			key,
			url,
			extension
		})
		await addExif({ key, exif })
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const getGeoJson = async (request, response, next) => {
	const userId = request.user.id,
		features = [],
		code = request.code ? request.code : 200
	let results
	try {
		results = await query(
			'SELECT geo_json_feature FROM images WHERE user_id = $1;',
			[userId]
		)
		for (const feat of results.rows) {
			features.push(feat.geo_json_feature)
		}
	} catch (error) {
		console.error(error)
		throw error
	}
	const geoJson = {
		type: 'FeatureCollection',
		features
	}
	return response.status(code).json({ geoJson })
}

const saveAllData = async (request, response, next) => {
	const allImageData = JSON.parse(request.body.allImageData),
		userId = request.user.id //comes from the verify token middleware

	try {
		for (const imageData of allImageData) {
			await saveImageData({ userId, imageData })
		}
	} catch (error) {
		console.error(error)
		throw error
	}
	request.code = 201
	next()
}

const deleteData = async (request, response, next) => {
	const keys = request.body.imagesToDelete
	try {
		const results = await query(
			'DELETE FROM images WHERE key = ANY($1) RETURNING key, extension;',
			[keys]
		)
		const s3Keys = results.rows.map(imageData => {
			return { Key: `${imageData.key}.${imageData.extension}` }
		})
		request.s3Keys = s3Keys
	} catch (error) {
		console.error(error)
		throw error
	}
	next()
}

const deleteImages = async (request, response, next) => {
	const keys = request.s3Keys
	deleteFromS3(keys)
	next()
}

const convertImage = async (request, response, next) => {
	const image = JSON.parse(request.body.allImageData)[0],
		key = `${image.key}.${image.extension}`,
		path = `./uploads/originals/${key}`,
		resizedPath = `./uploads/converted/${key}`

	try {
		let convertImage = sharp(path),
			metaData = await convertImage.metadata()
		const { width, height, exif } = metaData,
			megaPixels = width * height
		// iPhone MegaPixel = 4032 * 3024 = 12,192,768
		if (megaPixels > 12000000 && width > 2016 && height > 2016) {
			await convertImage.resize(Math.round(width * 0.5)).toFile(resizedPath)
		} else {
			await convertImage.toFile(resizedPath)
		}

		const s3UploadData = {
			key,
			resizedPath,
			path
		}
		request.s3UploadData = s3UploadData
	} catch (error) {
		console.error(error)
	}

	next()
}

const uploadToDisk = multer({
	storage: multer.diskStorage({
		destination: function(req, file, cb) {
			cb(null, './uploads/originals/')
		},
		filename: function(req, file, cb) {
			cb(null, file.originalname)
		}
	})
})

const removeFromDisk = (request, response, next) => {
	const key = request.keyToDelete
	console.log(key)
	const filesToDelete = [
		`./uploads/converted/${key}`,
		`./uploads/originals/${key}`
	]

	fs.unlink(filesToDelete[0], err => {
		if (err) throw err

		fs.unlink(filesToDelete[1], err => {
			if (err) throw err
			next()
		})
	})
}

module.exports = {
	saveAllData,
	getGeoJson,
	deleteData,
	deleteImages,
	convertImage,
	uploadToDisk,
	removeFromDisk
}
