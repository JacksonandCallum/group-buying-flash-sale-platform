import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/manager/home'
    },
    {
      path: '/manager',
      redirect: '/manager/home',
      component: () => import('../views/Manager.vue'),
      children: [
        {
          path: 'home',
          meta: { name: '系统首页' },
          component: () => import('../views/manager/Home.vue')
        }
      ]
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
