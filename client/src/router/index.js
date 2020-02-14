import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import Home from '../components/Home'
import Log from '../components/Log'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/', name: 'App', component: Home },
		{ path: '/log', name: 'Log', component: Log },
		{ path: '/login', name: 'Login', component: Login },
		{ path: '/register', name: 'Register', component: Register },
		{ path: '*', redirect: '/' }
	]
})

router.beforeEach((to, from, next) => {
	const publicPages = ['/login', '/register', '/'],
		authRequired = !publicPages.includes(to.path),
		loggedIn = localStorage.getItem('user')
	if (authRequired && !loggedIn && to.path !== '/login') {
		return next('/login')
	}

	next()
})

export default router
