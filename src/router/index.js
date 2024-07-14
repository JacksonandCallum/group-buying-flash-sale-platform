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
        },
        {
          path: 'user',
          meta: { name: '用户信息' },
          component: () => import('../views/manager/User.vue')
        },
        {
          path: 'person',
          meta: { name: '个人信息' },
          component: () => import('../views/manager/Person.vue')
        },
        {
          path: 'password',
          meta: { name: '修改密码' },
          component: () => import('../views/manager/Password.vue')
        },
        {
          path: 'logs',
          meta: { name: '系统日志' },
          component: () => import('../views/manager/Logs.vue')
        },
        {
          path: 'category',
          meta: { name: '商品分类' },
          component: () => import('../views/manager/Category.vue')
        },
        {
          path: 'goods',
          meta: { name: '商品管理' },
          component: () => import('../views/manager/Goods.vue')
        },
        {
          path: 'carousel',
          meta: { name: '广告信息' },
          component: () => import('../views/manager/Carousel.vue')
        },
        {
          path: 'orders',
          meta: { name: '订单信息' },
          component: () => import('../views/manager/Orders.vue')
        },
        {
          path: 'comment',
          meta: { name: '评价信息' },
          component: () => import('../views/manager/Comment.vue')
        },
      ]
    },
    {
      path: '/front',
      redirect: '/front/home',
      component: () => import('../views/Front.vue'),
      children: [
        {
          path: 'home',
          meta: { name: '首页' },
          component: () => import('../views/front/Home.vue')
        },
        {
          path: 'goodsDetail',
          meta: { name: '商品详情' },
          component: () => import('../views/front/GoodsDetail.vue')
        },
        {
          path: 'goods',
          meta: { name: '商品信息' },
          component: () => import('../views/front/Goods.vue')
        },
        {
          path: 'ordersDetail',
          meta: { name: '订单详情' },
          component: () => import('../views/front/OrdersDetail.vue')
        },
        {
          path: 'orders',
          meta: { name: '订单中心' },
          component: () => import('../views/front/Orders.vue')
        },
        {
          path: 'group',
          meta: { name: '团购专区' },
          component: () => import('../views/front/Group.vue')
        },
        {
          path: 'comment',
          meta: { name: '评价中心' },
          component: () => import('../views/front/Comment.vue')
        },
      ]
    },
    {
      path: '/pay',
      meta: { name: '支付页面' },
      component: () => import('../views/Pay.vue')
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/404',
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
