const { query } = require('../models/psql.config')
const { generateURL, parseExif, generateGeoJson } = require('../utils/')
const {
	host,
	bucket,
	bucketRegion
} = require('../config/DO_NOT_COMMIT.env.vars').s3

const addImageData = async ({ userId, key, url, extension, geoJson }) => {
	let results
	try {
		results = await query(
			'INSERT INTO images (user_id, key, url, extension, geo_json) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
			[userId, key, url, extension, geoJson]
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

	let results, image

	try {
		const parsedExif = await parseExif({ exif, name })
		const geoJson = generateGeoJson(parsedExif)
		results = await addImageData({ userId, geoJson, key, url, extension })
		await addExif({ key, exif })
		const data = results.rows[0]
		image = { url: data.url, key: data.key, geoJson: data.geo_json }
	} catch (error) {
		console.error(error)
		throw error
	}
	return image
}

const saveAllData = async (request, response, next) => {
	const allImageData = JSON.parse(request.body.allImageData),
		userId = request.user.id, //comes from the verify token middleware
		allData = [],
		data = {}
	for (const imageData of allImageData) {
		const results = await saveImageData({ userId, imageData })
		allData.push(results)
	}
	data.message = 'Successfully added images.'
	data.allImageData = allData
	response.status(201).send(data)
}

module.exports = { saveAllData }
