const UploadHelper = {
	generateKey({ userId, time }) {
		if (!userId || !time) return
		return `${userId}_${time}`
	},
	regenerateKey({ key, imageId }) {
		if (!key || !imageId) return
		return `${imageId}_${key}`
	}
}

module.exports = UploadHelper
