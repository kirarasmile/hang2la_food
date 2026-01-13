import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/HomePage.vue')
  },
  {
    path: '/map',
    name: 'map',
    component: () => import('./views/MapPage.vue')
  },
  {
    path: '/submit',
    name: 'submit',
    component: () => import('./views/SubmitPage.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginPage.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/RegisterPage.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('./views/AdminPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
