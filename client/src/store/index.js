import Vue from 'vue'
import Vuex from 'vuex'

import { alerts } from './alerts.module'
import { account } from './auth.module'
import { users } from './users.module'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    alerts,
    account,
    users
  }
})
