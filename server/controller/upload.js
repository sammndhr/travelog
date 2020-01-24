const { query } = require('../models/psql.config')

const getUserId = async userId => {
	let results
	try {
		results = await query(
			'SELECT exists (SELECT true from users where user_id=$1);',
			[userId]
		)
	} catch (error) {
		console.error(error)
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
	}

	return results
}

const saveImagesAndExif = async (request, response) => {
	const allExif = JSON.parse(request.body.allExif),
		userId = JSON.parse(request.body.userId),
		exif = JSON.stringify(allExif[0]),
		queryUserId = await getUserId(userId)

	if (queryUserId instanceof Error) {
		response
			.status(500)
			.send({ message: 'Could not locate user. Something went wrong!' })
	} else {
		const userExists = queryUserId.rows[0].exists

		if (userExists === false) {
			response.status(404).send({ message: 'User does not exist.' })
		} else {
			// TODO
			//Some random key for now.
			const key = Math.random()
				.toString()
				.slice(1, 6)

			let imagesAdded

			try {
				imagesAdded = await addImageData({ userId, exif, key })
			} catch (error) {
				console.error(error)
				response
					.status(500)
					.send({ message: 'Could not add images. Something went wrong.' })
				return
			}

			response.status(201).send(imagesAdded)
		}
	}
}

module.exports = { saveImagesAndExif }
