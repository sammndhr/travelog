const state = {
  type: null,
  message: null
}

const mutations = {
  SUCCESS(state, message) {
    state.type = 'success'
    state.message = message
  },
  ERROR(state, message) {
    state.type = 'error'
    state.message = message
  },
  WARNING(state, message) {
    state.type = 'warning'
    state.message = message
  },
  CLEAR(state) {
    state.type = null
    state.message = null
  }
}

const actions = {
  success({ commit }, message) {
    commit('SUCCESS', message)
  },
  warning({ commit }, message) {
    commit('WARNING', message)
  },
  error({ commit }, message) {
    commit('ERROR', message)
  },
  clear({ commit }) {
    commit('CLEAR')
  }
}

export const alert = {
  namespaced: true,
  state,
  actions,
  mutations
}
