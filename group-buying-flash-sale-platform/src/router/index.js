import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/404',
      name: '404',
      component: () => import('../views/404.vue')
    },
    // 匹配所有未定义路由，统一重定向到404页面
    {
      path: '/:pathMatch(.*)',
      redirect: '404',
      hidden: true
    }
  ]
})

export default router
