const { query } = require('../models/psql.config')

const { generateURL } = require('../utils/')
const {
	host,
	bucket,
	bucketRegion
} = require('../config/DO_NOT_COMMIT.env.vars').s3

const addImageData = async ({ exif, userId, key, url }) => {
	let results
	try {
		results = await query(
			'INSERT INTO images (user_id ,key , exif, url) VALUES ($1, $2, $3, $4) RETURNING *',
			[userId, key, exif, url]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const saveImageData = async ({ userId, imageData }) => {
	const exif = JSON.stringify(imageData.exif),
		{ key, extension } = imageData,
		url = generateURL({ bucket, key, host, region: bucketRegion, extension })

	let results, image

	try {
		results = await addImageData({ userId, exif, key, url })
		const data = results.rows[0]
		// TODO: Add exif data to return. Make a separate table for exif?
		image = { url: data.url, key: data.key }
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
