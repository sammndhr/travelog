import Router from 'vue-router'
import Vue from 'vue'

import Upload from '../components/Upload'

import Login from '../components/auth/Login'
import Register from '../components/auth/Register'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/upload', name: 'Upload', component: Upload },
    { path: '/login', component: Login },
    { path: '/register', component: Register }

    // otherwise redirect to home
    // { path: '*', redirect: '/' }
  ]
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/', '/upload'],
    authRequired = !publicPages.includes(to.path),
    loggedIn = localStorage.getItem('user')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})

export default router
