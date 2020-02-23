import { createErrorMessage } from '@/utils'
import axios from 'axios'

const state = {
	geoJson: {
		type: 'FeatureCollection',
		features: []
	},
	status: {},
	filteredGeoJson: []
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

	SET_FILTERED_GEOJSON(state, filteredGeoJson) {
		state.filteredGeoJson = filteredGeoJson
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
			dispatch('getGeojson')
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
			return axios(options)
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

	async getGeojson({ dispatch, commit, rootState }) {
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
				})
			}
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)
			commit('GET_GEOSON_FAILURE')
			dispatch('alert/error', errorMessage, { root: true })
		}
	},

	getFilteredGeoJson({ commit }, filteredGeoJson) {
		commit('SET_FILTERED_GEOJSON', filteredGeoJson)
	}
}

export const data = {
	namespaced: true,
	state,
	actions,
	mutations,
	getters
}
