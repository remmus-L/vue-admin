import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('@/views/Login') },
  {
    path: '/home',
    redirect: '/welcome',
    component: () => import('@/views/Home'),
    children: [
      { path: '/welcome', component: () => import('@/components/Welcome.vue') },
      { path: '/users', component: () => import('@/views/Users/index.vue') },
      { path: '/rights', component: () => import('@/views/Rights/index.vue') },
      { path: '/roles', component: () => import('@/views/Roles/index.vue') },
      { path: '/params', component: () => import('@/views/Params/index.vue') },
      { path: '/goods', component: () => import('@/views/Goods/index.vue') },
      { path: '/categories', component: () => import('@/views/Categories/index.vue') },
      { path: '/orders', component: () => import('@/views/Orders/index.vue') },
      { path: '/reports', component: () => import('@/views/Reports/index.vue') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
