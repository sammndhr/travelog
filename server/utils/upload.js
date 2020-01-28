const UploadHelper = {
	generateURL({ bucket, region, host, key, extension }) {
		if (!bucket || !region || !host || !key || !extension)
			throw 'Arguments not provided to generate url.'
		return `https://${bucket}.${region}.${host}/${key}.${extension}`
	},

	generateGeoJson({
		latitude,
		longitude,
		height,
		width,
		name,
		orientation,
		dateCreated
	}) {
		const feature = {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates:
					latitude !== null && longitude !== null ? [latitude, longitude] : []
			},
			properties: {
				name,
				dimensions: { width, height },
				orientation,
				dateCreated
			}
		}
		return feature
	},

	parseExif({ exif, name }) {
		const {
			DateTime,
			GPSLatitudeRef,
			GPSLatitude,
			GPSLongitudeRef,
			GPSLongitude
		} = exif
		const imageHeight = exif['Image Height']
		const imageWidth = exif['Image Width']
		console.log(
			DateTime,
			GPSLatitudeRef,
			GPSLatitude,
			GPSLongitudeRef,
			GPSLongitude,
			imageHeight,
			imageWidth
		)
		const height = imageHeight ? parseFloat(imageHeight) : 0
		const width = imageWidth ? parseFloat(imageWidth) : 0
		const orientation =
			width && height ? (width / height > 1 ? 'potrait' : 'landscape') : ''
		const dateCreated = DateTime
			? new Date(
					DateTime.split(' ')[0]
						.split(':')
						.join('-')
			  ).getTime()
			: 0

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
		return {
			latitude,
			longitude,
			height,
			width,
			name,
			orientation,
			dateCreated
		}
	}
}

module.exports = UploadHelper
