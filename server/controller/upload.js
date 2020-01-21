const pool = require('../models/psql.config')

const handleError = err => new Error(err)

const getUserId = async userId => {
	let results = await pool
		.query('SELECT exists (SELECT true from users where user_id=$1);', [userId])
		.catch(handleError)
	return results
}

const addImageData = async ({ exif, userId }) => {
	let results = await pool
		.query('INSERT INTO images (user_id ,url , exif) VALUES ($1, $2, $3) RETURNING *', [userId, 'http://someUrl', exif])
		.catch(handleError)

	return results
}

const saveImagesAndExif = async (request, response) => {
	const allExif = JSON.parse(request.body.allExif),
		userId = JSON.parse(request.body.userId),
		exif = JSON.stringify(allExif[0]),
		queryUserId = await getUserId(userId)

	if (queryUserId instanceof Error) {
		response.status(500).send({ message: 'Something went wrong!' })
	} else {
		const userExists = queryUserId.rows[0].exists

		if (userExists === false) {
			response.status(404).send({ message: 'User not found!' })
		} else {
			let imagesAdded = await addImageData({ userId, exif }).catch(handleError)

			if (imagesAdded instanceof Error) {
				response.status(500).send({ message: 'Something went wrong!' })
			} else {
				response.status(201).send(imagesAdded)
			}
		}
	}
}

module.exports = { saveImagesAndExif }
