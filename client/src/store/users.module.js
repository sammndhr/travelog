import { _delete } from '../utils/auth'

const state = {
	user: {}
}

const mutations = {
	DELETE_REQUEST(state, id) {
		state.user =
			state.user.id === id ? { ...state.user, deleting: true } : state.user
	},

	DELETE_SUCCUESS(state) {
		state.user = null
	},

	DELETE_FAILURE(state, { id, error }) {
		state.user = state.map(user => {
			if (user.id === id) {
				// eslint-disable-next-line no-unused-vars
				const { deleting, ...userCopy } = user
				return { ...userCopy, deleteError: error }
			}
			return user
		})
	}
}

const actions = {
	delete({ commit }, id) {
		commit('DELETE_REQUEST', id)

		_delete(id).then(
			() => commit('DELETE_SUCCUESS'),
			error => commit('DELETE_FAILURE', { id, error: error.toString() })
		)
	}
}

export const users = {
	namespaced: true,
	state,
	actions,
	mutations
}
