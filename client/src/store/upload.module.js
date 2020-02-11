import axios from 'axios'
import { createErrorMessage } from '../utils'

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

	UPLOAD_SUCCESS(state, geoJson) {
		state.status = { uploaded: true }
		state.geoJson = geoJson
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

const actions = {
	async upload({ dispatch, commit, rootState }, formData) {
		commit('UPLOAD_REQUEST')
		const options = {
			method: 'POST',
			headers: { 'x-access-token': rootState.account.user.token },
			data: formData,
			url: `/uploads`
		}
		try {
			const results = await axios(options)
			if (results.status >= 200) {
				const geoJson = results.data.geoJson
				commit('UPLOAD_SUCCESS', geoJson)
				setTimeout(() => {
					dispatch('alert/success', 'Upload successful', { root: true })
				})
			}
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
			url: `/uploads/deletes`
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
			url: `/uploads/log`
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
	mutations
}
