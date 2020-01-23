const state = {
  type: null,
  message: null
}

const mutations = {
  SUCCESS(state, message) {
    state.type = 'alert-success'
    state.message = message
  },
  ERROR(state, message) {
    state.type = 'alert-danger'
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
  error({ commit }, message) {
    commit('ERROR', message)
  },
  clear({ commit }) {
    commit('CLEAR')
  }
}

export const alerts = {
  namespaced: true,
  state,
  actions,
  mutations
}
