import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		exifData: {}
	},

	mutations: {
		SET_EXIF_DATA(state, exifData) {
			state.exifData = exifData
		}
	},

	actions: {
		getExif({ commit }, { exifData }) {
			commit('SET_EXIF_DATA', exifData)
		}
	}
})
