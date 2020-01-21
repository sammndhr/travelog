const pool = require('../models/psql.config')

const getUserId = async userId => {
	let results
	try {
		results = await pool.query('SELECT exists (SELECT true from users where user_id=$1);', [userId])
	} catch (err) {
		throw err
	}

	return !!results.rows[0].exists
}

const addImageData = async ({ exif, userId }) => {
	let results
	try {
		results = await pool.query('INSERT INTO images (user_id ,url , exif) VALUES ($1, $2, $3) RETURNING *', [
			userId,
			'http://someUrl',
			exif
		])
	} catch (err) {
		throw err
	}
	return results
}

const saveImagesAndExif = async (request, response) => {
	const allExif = JSON.parse(request.body.allExif),
		userId = JSON.parse(request.body.userId),
		exif = JSON.stringify(allExif[0])
	if (await getUserId(userId)) {
		let results
		try {
			results = await addImageData({ userId, exif })
		} catch (err) {
			throw err
		}
		response.status(201).send(results)
	} else {
		response.status(404).send({ message: 'User not found!' })
	}
}

module.exports = { saveImagesAndExif }
