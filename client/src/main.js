import 'mapbox-gl/dist/mapbox-gl.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import VueMasonry from 'vue-masonry-css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import { store } from './store'

Vue.config.productionTip = false
Vue.use(VueMasonry)

new Vue({
	render: h => h(App),
	router,
	vuetify,
	store
}).$mount('#app')
