import axios from 'axios'
import router from '../router'
import { createErrorMessage, handleResponse, _logout } from '../utils/'

const user = JSON.parse(localStorage.getItem('user'))

const state = user
	? { status: { loggedIn: true }, user }
	: { status: {}, user: null }

const mutations = {
	LOGIN_REQUEST(state, user) {
		state.status = { loggingIn: true }
		state.user = user
	},
	LOGIN_SUCCESS(state, user) {
		state.status = { loggedIn: true }
		state.user = user
	},
	LOGIN_FAILURE(state) {
		state.status = {}
		state.user = null
	},
	LOGOUT(state) {
		state.status = {}
		state.user = null
	},
	REGISTER_REQUEST(state) {
		state.status = { registering: true }
	},
	REGISTER_SUCCESS(state) {
		state.status = {}
	},
	REGISTER_FAILURE(state) {
		state.status = {}
	}
}

//TODO: Make authentication SECURE
const actions = {
	async login({ dispatch, commit }, { email, password }) {
		commit('LOGIN_REQUEST', { email })
		const options = {
			method: 'POST',
			data: { email, password },
			headers: { 'Content-Type': 'application/json' },
			url: `${process.env.VUE_APP_BACKEND_URL}/users/authenticate`
		}

		try {
			const results = await axios(options)
			const user = handleResponse(results)
			if (user.token && user.userId) {
				localStorage.setItem('user', JSON.stringify(user))
			}
			commit('LOGIN_SUCCESS', user)
			router.push('/log')
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)

			commit('LOGIN_FAILURE', errorMessage)
			dispatch('alert/error', errorMessage, { root: true })
		}
	},

	logout({ commit }) {
		_logout()
		commit('LOGOUT')
	},

	async register({ dispatch, commit }, user) {
		commit('REGISTER_REQUEST')
		const options = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: user,
			url: `${process.env.VUE_APP_BACKEND_URL}/users/register`
		}

		try {
			const res = await axios(options),
				user = handleResponse(res)
			commit('REGISTER_SUCCESS', user)
			router.push('/login')
			setTimeout(() => {
				dispatch('alert/success', 'Registration successful', { root: true })
			})
		} catch (error) {
			console.log(error)
			const errorMessage = createErrorMessage(error)
			commit('REGISTER_FAILURE', errorMessage)
			dispatch('alert/error', errorMessage, { root: true })
		}
	}
}

export const account = {
	namespaced: true,
	state,
	actions,
	mutations
}
