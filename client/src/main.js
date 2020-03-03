import 'mapbox-gl/dist/mapbox-gl.css'

import App from '@/App.vue'
import Vue from 'vue'
import VueMasonry from 'vue-masonry-css'
import router from '@/router'
import { store } from '@/store'
import vuetify from '@/plugins/vuetify'

Vue.config.productionTip = false
Vue.use(VueMasonry)

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
