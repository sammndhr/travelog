const { query } = require('../models/psql.config')
const { generateKey, regenerateKey } = require('../utils')

const addImageData = async ({ exif, userId, key }) => {
	let results
	try {
		results = await query(
			'INSERT INTO images (user_id ,key , exif) VALUES ($1, $2, $3) RETURNING *',
			[userId, key, exif]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const updateImageData = async imagesAdded => {
	let results
	try {
		const imageData = imagesAdded.rows[0],
			{ image_id, key } = imageData
		newKey = regenerateKey({ imageId: image_id, key })
		results = await query(
			`UPDATE "images" SET key = $1
			WHERE image_id = $2 returning *;`,
			[newKey, image_id]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

const saveImagesAndExif = async (request, response, next) => {
	const allExif = JSON.parse(request.body.allExif),
		userId = request.user.id,
		exif = JSON.stringify(allExif[0]),
		time = new Date().getTime(),
		firstKey = generateKey({ userId, time })
	let imagesAdded, imagesUpdated

	try {
		imagesAdded = await addImageData({ userId, exif, key: firstKey })
		imagesUpdated = await updateImageData(imagesAdded)
	} catch (error) {
		console.error(error)
		throw error
	}

	response.status(201).send(imagesUpdated)
}

module.exports = { saveImagesAndExif }
