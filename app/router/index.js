import Vue from 'vue'
import Router from 'vue-router'

function route (path, view) {
  return {
    path: path,
    component: () => import(`pages/${view}View.vue`)
  }
}

Vue.use(Router)

export function createRouter () {
  const router = new Router({
    base: __dirname,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
      route('/', 'Home'),
      // Global redirect for 404
      { path: '*', redirect: '/' }
    ]
  })

  return router
}
