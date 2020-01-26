const UploadHelper = {
	generateURL({ bucket, region, host, key, extension }) {
		if (!bucket || !region || !host || !key || !extension)
			throw 'Arguments not provided to generate url.'
		return `https://${bucket}.${region}.${host}/${key}.${extension}`
	}
}

module.exports = UploadHelper
