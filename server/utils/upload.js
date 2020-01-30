const axios = require('axios')
const { mapbox } = require('../config/DO_NOT_COMMIT.env.vars.js')

async function reverseGeocode({ longitude, latitude }) {
	let results,
		location = null,
		parameters = ''

	const options = {
		language: 'en',
		limit: 1,
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
				if (key === 'place_name_en') {
					location = val
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
	generateURL({ bucket, region, host, key, extension }) {
		if (!bucket || !region || !host || !key || !extension)
			throw 'Arguments not provided to generate url.'
		return `https://${bucket}.${region}.${host}/${key}.${extension}`
	},

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

	async parseExif({ exif, name, url }) {
		const {
			DateTime,
			GPSLatitudeRef,
			GPSLatitude,
			GPSLongitudeRef,
			GPSLongitude
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
		const orientation =
			width && height ? (width / height > 1 ? 'potrait' : 'landscape') : ''
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
			name,
			orientation,
			dateCreated,
			url
		}
	}
}

module.exports = UploadHelper
