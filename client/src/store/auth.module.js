import { _login, _logout, _register } from '../utils/auth'
import router from '../router'

const user = JSON.parse(localStorage.getItem('user'))
const state = user ? { status: { loggedIn: true }, user } : { status: {}, user: null }

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

const actions = {
  login({ dispatch, commit }, { username, password }) {
    commit('LOGIN_REQUEST', { username })

    _login(username, password).then(
      user => {
        commit('LOGIN_SUCCESS', user)
        router.push('/')
      },
      error => {
        commit('LOGIN_FAILURE', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  },
  logout({ commit }) {
    _logout()
    commit('LOGOUT')
  },
  register({ dispatch, commit }, user) {
    commit('REGISTER_REQUEST', user)
    _register(user).then(
      user => {
        commit('REGISTER_SUCCESS', user)
        router.push('/login')
        setTimeout(() => {
          dispatch('alert/success', 'Registration successful', { root: true })
        })
      },
      error => {
        commit('REGISTER_FAILURE', error)
        dispatch('alert/error', error, { root: true })
      }
    )
  }
}

export const account = {
  namespaced: true,
  state,
  actions,
  mutations
}
