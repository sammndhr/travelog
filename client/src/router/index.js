import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Upload from '../components/Upload'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/upload', name: 'Upload', component: Upload },
		{ path: '/login', name: 'Login', component: Login },
		{ path: '/register', name: 'Register', component: Register }

		// otherwise redirect to home
		// { path: '*', redirect: '/' }
	]
})

router.beforeEach((to, from, next) => {
	const publicPages = ['/login', '/register', '/'],
		authRequired = !publicPages.includes(to.path),
		loggedIn = localStorage.getItem('user')
	if (authRequired && !loggedIn) {
		return next('/login')
	}

	next()
})

export default router
