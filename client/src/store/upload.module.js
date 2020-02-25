import { createErrorMessage } from '@/utils'
import { geoJsonToImages } from '@/utils/'
import axios from 'axios'

const state = {
	geoJson: {
		type: 'FeatureCollection',
		features: []
	},
	filteredGeoJson: {
		type: 'FeatureCollection',
		features: []
	},
	filteredImages: { images: [], urls: [] },
	status: {},
	currImages: { images: [], urls: [] },
	selectionCount: 0,
	hasLocation: true,
	warning: null
}

const mutations = {
	UPLOAD_REQUEST(state) {
		state.status = { uploading: true }
	},

	UPLOAD_SUCCESS(state) {
		state.status = { uploaded: true }
	},

	UPLOAD_FAILURE(state) {
		state.status = {}
		state.geoJson.features = []
	},
	DELETE_REQUEST(state) {
		state.status = { deleting: true }
	},

	DELETE_SUCCESS(state, geoJson) {
		state.status = { deleted: true }
		state.geoJson = geoJson
	},

	DELETE_FAILURE(state) {
		state.status = {}
	},

	GET_GEOSON_REQUEST(state) {
		state.status = { fetching: true }
	},

	GET_GEOSON_SUCCESS(state, geoJson) {
		state.status = { fetched: true }
		state.geoJson = geoJson
	},

	GET_GEOSON_FAILURE(state) {
		state.status = {}
		state.geoJson.features = []
	},

	UPDATE_FILTERED_GEOJSON(state, filteredGeoJson) {
		state.filteredGeoJson = filteredGeoJson
	},

	UPDATE_FILTERED_IMAGES(state, filteredImages) {
		state.filteredImages = filteredImages
	},

	UPDATE_CURR_IMAGES(state, currImages) {
		state.currImages = currImages
	},

	INCREMENT_SELECTION_COUNT(state) {
		state.selectionCount++
	},

	DECREMENT_SELECTION_COUNT(state) {
		state.selectionCount--
	},

	RESET_SELECTION_COUNT(state) {
		state.selectionCount = 0
	},

	UPDATE_SELECTION_COUNT(state, selectionCount) {
		state.selectionCount = selectionCount
	},

	TOGGLE_HAS_LOCATION(state) {
		state.hasLocation = !state.hasLocation
	},
	UPDATE_WARNING_MESSAGE(state, message) {
		state.warning = message
	}
}

const getters = {
	hasLocationGeoJson: state => {
		const features = state.geoJson.features,
			geoJson = JSON.parse(JSON.stringify(state.geoJson))

		const featuresWithLocation = features.filter(feature => {
			return feature.geometry.coordinates.length > 0
		})

		geoJson.features = featuresWithLocation
		return geoJson
	},

	noLocationGeoJson: state => {
		const features = state.geoJson.features,
			geoJson = JSON.parse(JSON.stringify(state.geoJson))

		const noLocationFeatures = features.filter(feature => {
			return feature.geometry.coordinates.length < 1
		})

		geoJson.features = noLocationFeatures
		return geoJson
	},

	hasLocationImages: (state, getters) => {
		const geoJson = getters.hasLocationGeoJson
		const images = geoJsonToImages(geoJson)
		return images
	},

	noLocationImages: (state, getters) => {
		const geoJson = getters.noLocationGeoJson
		const images = geoJsonToImages(geoJson)
		return images
	}
}

const actions = {
	uploadRequest({ commit }) {
		commit('UPLOAD_REQUEST')
	},

	async uploadAll({ dispatch, commit }, images) {
		dispatch('uploadRequest')

		const promises = []
		for (let image of images) {
			const { key, file } = image,
				imageData = [],
				formData = new FormData(),
				extension = file.type.split('/').pop(),
				newName = `${key}.${extension}`
			imageData.push({ key, extension, name: newName })
			formData.append('photos', file, newName)
			formData.append('allImageData', JSON.stringify(imageData))
			const uploading = dispatch('upload', formData)
			promises.push(uploading)
		}

		Promise.all(promises).then(() => {
			// dispatch('getGeojson')
			commit('UPLOAD_SUCCESS')
		})
	},

	async upload({ dispatch, commit, rootState }, formData) {
		const options = {
			method: 'POST',
			headers: { 'x-access-token': rootState.account.user.token },
			data: formData,
			url: `${process.env.VUE_APP_BACKEND_URL}/uploads`
		}
		try {
			const res = await axios(options)
			const message = `Some images uploaded without location!`
			if (res.data.feature.geometry.coordinates.length < 2)
				dispatch('updateWarning', message)
			dispatch('getGeojson')
			return res
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)
			commit('UPLOAD_FAILURE')
			dispatch('alert/error', errorMessage, { root: true })
		}
	},

	async delete({ dispatch, commit, rootState }, images) {
		commit('DELETE_REQUEST')
		const options = {
			method: 'POST',
			headers: { 'x-access-token': rootState.account.user.token },
			data: images,
			url: `${process.env.VUE_APP_BACKEND_URL}/uploads/deletes`
		}
		try {
			const results = await axios(options)
			if (results.status >= 200) {
				const geoJson = results.data.geoJson
				commit('DELETE_SUCCESS', geoJson)
				dispatch('getGeojson')
				setTimeout(() => {
					dispatch('alert/success', 'Delete successful', { root: true })
				})
			}
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)
			commit('DELETE_FAILURE')
			dispatch('alert/error', errorMessage, { root: true })
		}
	},

	async getGeojson({ dispatch, commit, state, getters, rootState }) {
		commit('GET_GEOSON_REQUEST')
		const options = {
			method: 'GET',
			headers: { 'x-access-token': rootState.account.user.token },
			url: `${process.env.VUE_APP_BACKEND_URL}/uploads/log`
		}
		try {
			const results = await axios(options)
			if (results.status >= 200) {
				const geoJson = results.data.geoJson
				commit('GET_GEOSON_SUCCESS', geoJson)
				setTimeout(() => {
					dispatch('alert/success', 'Fetch successful', { root: true })
					state.hasLocation
						? dispatch('updateCurrImages', getters.hasLocationImages)
						: dispatch('updateCurrImages', getters.noLocationImages)
				})
			}
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)
			commit('GET_GEOSON_FAILURE')
			dispatch('alert/error', errorMessage, { root: true })
		}
	},

	updateFilteredGeoJson({ dispatch, commit }, filteredGeoJson) {
		const filteredImages = geoJsonToImages(filteredGeoJson)
		commit('UPDATE_FILTERED_GEOJSON', filteredGeoJson)
		dispatch('updateFilteredImages', filteredImages)
	},

	updateFilteredImages({ commit }, filteredImages) {
		commit('UPDATE_FILTERED_IMAGES', filteredImages)
	},

	updateCurrImages({ commit }, currImages) {
		commit('UPDATE_CURR_IMAGES', currImages)
	},

	updateSelectionCount({ commit }, { type, count }) {
		const mutationTypes = {
			increment: 'INCREMENT_SELECTION_COUNT',
			decrement: 'DECREMENT_SELECTION_COUNT',
			reset: 'RESET_SELECTION_COUNT'
		}
		if (type === 'update') commit('UPDATE_SELECTION_COUNT', count)
		else {
			commit(mutationTypes[type])
		}
	},

	toggleHasLocation({ commit, state, getters, dispatch }) {
		commit('TOGGLE_HAS_LOCATION')
		const images = state.hasLocation
			? getters.hasLocationImages
			: getters.noLocationImages

		dispatch('updateCurrImages', images)
	},
	updateWarning({ commit }, message) {
		commit('UPDATE_WARNING_MESSAGE', message)
	}
}

export const data = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
