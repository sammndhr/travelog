import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Home from '@/components/Home'
import Log from '@/components/Log'
import Support from '@/components/Support'
import SupportQuestion from '@/components/SupportQuestion'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'App', component: Home },
    { path: '/support', name: 'Support', component: Support },
    {
      path: '/support/missing-location-images',
      name: 'SupportQuestion',
      component: SupportQuestion
    },
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
    return next('/')
  }
  if (loggedIn && to.path === '/' && from.path === '/') {
    return next('/log')
  }
  next()
})

export default router
