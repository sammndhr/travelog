import Vue from 'vue'
import Vuex from 'vuex'
import { alert } from './alert.module'
import { account } from './auth.module'
import { data } from './upload.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		mainHeight: '85vh'
	},
	modules: {
		alert,
		account,
		data
	}
})
