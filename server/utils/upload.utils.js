const axios = require('axios'),
	{ mapbox } = require('../config/'),
	ExifReader = require('exifreader'),
	fs = require('fs')

async function reverseGeocode({ longitude, latitude }) {
	let results,
		location = { place: null, region: null, country: null },
		parameters = ''

	const options = {
		language: 'en',
		// limit: 1,
		types: 'country,region,place'
	}

	for (const key in options) {
		const val = options[key]
		parameters += `${key}=${val}&`
	}

	try {
		results = await axios.get(
			`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?${parameters}access_token=${mapbox.token}`
		)

		const features = results.data.features
		for (const feats of features) {
			for (const key in feats) {
				const val = feats[key]

				if (key === 'place_type') {
					for (const place of val) {
						location[place] = feats.text_en
					}
				}
			}
		}
	} catch (error) {
		console.error(error)
		throw error
	}

	return location ? location : results
}

const UploadHelper = {
	createFeature({ latitude, longitude, height, width, ...rest }) {
		const feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates:
					latitude !== null && longitude !== null ? [longitude, latitude] : []
			},
			properties: {
				dimensions: { width, height },
				...rest
			}
		}
		return feature
	},

	async parseExif({ exif, key, url }) {
		const {
			DateTime,
			GPSLatitudeRef,
			GPSLatitude,
			GPSLongitudeRef,
			GPSLongitude,
			Orientation
		} = exif

		const latitude = GPSLatitude
			? GPSLatitudeRef.includes('South' || 'S')
				? GPSLatitude * -1
				: GPSLatitude
			: null
		const longitude = GPSLongitude
			? GPSLongitudeRef.includes('West' || 'W')
				? GPSLongitude * -1
				: GPSLongitude
			: null
		const location = await reverseGeocode({ longitude, latitude })
		const height = exif['Image Height'] ? parseFloat(exif['Image Height']) : 0
		const width = exif['Image Width'] ? parseFloat(exif['Image Width']) : 0
		const orientation = Orientation
		const dateCreated = DateTime
			? DateTime.split(' ')[0]
					.split(':')
					.join('-')
			: ''

		return {
			latitude,
			longitude,
			location,
			height,
			width,
			key,
			orientation,
			dateCreated,
			url
		}
	},

	readExif(path) {
		const file = fs.readFileSync(path)
		const tags = ExifReader.load(file),
			exifData = {}
		delete tags['MakerNote']
		for (const name in tags) {
			exifData[name] =
				name === 'Orientation' ? tags[name].value : tags[name].description
		}

		return exifData
	}
}

module.exports = UploadHelper
