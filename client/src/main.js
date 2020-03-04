import 'mapbox-gl/dist/mapbox-gl.css'

import App from '@/App.vue'
import Vue from 'vue'
import VueGtag from 'vue-gtag'
import VueMasonry from 'vue-masonry-css'
import router from '@/router'
import { store } from '@/store'
import vuetify from '@/plugins/vuetify'

Vue.use(VueGtag, {
  config: { id: 'UA-159659222-1' }
})

Vue.config.productionTip = false
Vue.use(VueMasonry)

new Vue({
  render: h => h(App),
  router,
  vuetify,
  store
}).$mount('#app')
