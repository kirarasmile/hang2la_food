import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from './stores/auth'

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
    component: () => import('./views/SubmitPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/LoginPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/RegisterPage.vue'),
    meta: { guest: true }
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('./views/AdminPage.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 路由守卫
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()

  // 初始化认证状态（仅首次）
  if (!authStore.initialized) {
    await authStore.initialize()
  }

  // 需要登录的路由
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // 未登录，重定向到登录页，并保存目标路由
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
      return
    }

    // 需要管理员权限
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // 非管理员，重定向到首页
      next({ name: 'home' })
      return
    }
  }

  // 访客页面（登录/注册），已登录用户直接跳转首页
  if (to.meta.guest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router

