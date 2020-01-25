import Vue from 'vue'
import Vuex from 'vuex'
import { alert } from './alert.module'
import { account } from './auth.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
	modules: {
		alert,
		account
	}
})
