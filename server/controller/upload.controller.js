const { query } = require('../models/psql.config')
const { generateURL, parseExif, createFeature } = require('../utils/')
const {
	host,
	bucket,
	bucketRegion
} = require('../config/DO_NOT_COMMIT.env.vars').s3

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
		name = `${key}.${extension}`,
		url =
			process.env.NODE_ENV === 'development'
				? './uploads'
				: generateURL({ bucket, key, host, region: bucketRegion, extension })

	let results

	try {
		const parsedExif = await parseExif({ exif, name, url })
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
		features = []

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
	return response.status(201).json({ geoJson })
}

const saveAllData = async (request, response, next) => {
	const allImageData = JSON.parse(request.body.allImageData),
		userId = request.user.id //comes from the verify token middleware
	let results = []
	try {
		for (const imageData of allImageData) {
			const data = await saveImageData({ userId, imageData })
			results.push(data)
		}
	} catch (error) {
		console.error(error)
		throw error
	}
	next()
}

module.exports = { saveAllData, getGeoJson }
