import axios from 'axios'
import { createErrorMessage } from '../utils'

const state = {
	geoJson: {},
	status: {}
}

const mutations = {
	SET_GEOJSON(state, geoJson) {
		state.geoJson = geoJson
	},
	UPLOAD_REQUEST(state) {
		state.status = { uploading: true }
	},

	UPLOAD_SUCCESS(state, geoJson) {
		state.status = { uploaded: true }
		state.geoJson = geoJson
	},
	UPLOAD_FAILURE(state) {
		state.status = {}
		state.geoJson = null
	}
}

const actions = {
	getGeoJson({ commit }, geoJson) {
		commit('SET_GEOJSON', geoJson)
	},
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
			if (results.status > 200) {
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
	}
}

export const data = {
	namespaced: true,
	state,
	actions,
	mutations
}
