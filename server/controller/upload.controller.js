const { query } = require('../models/psql.config')
const { generateKey, regenerateKey } = require('../utils')

const userExists = async userId => {
	let results
	try {
		results = await query(
			'SELECT exists (SELECT true from users where user_id=$1);',
			[userId]
		)
	} catch (error) {
		console.error(error)
		throw error
	}
	return results
}

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
		userId = JSON.parse(request.body.userId),
		exif = JSON.stringify(allExif[0]),
		results = await userExists(userId),
		validUserId = results.rows[0].exists

	if (validUserId === false) {
		console.log('user_id does not exist in database.')
		response.status(404).send({ message: 'User does not exist.' })
	} else {
		const time = new Date().getTime(),
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
}

module.exports = { saveImagesAndExif }
