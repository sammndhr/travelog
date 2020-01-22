import Router from 'vue-router'
import Vue from 'vue'

import Upload from '../components/Upload'

Vue.use(Router)

const routes = [{ path: '/upload', name: 'Upload', component: Upload }],
	router = new Router({
		mode: 'history',
		routes
	})

export default router
