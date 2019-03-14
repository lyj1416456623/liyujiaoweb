import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/Index'
    },
    {
      path: '/Index',
      name: 'Index',
      component: resolve => require(['../views/Index/Index'],resolve),
      meta: {
        title: '首页'
      }
    },
    {
      path: '/lunbo',
      name: 'lunbo',
      component: resolve => require(['../views/lunbo'],resolve),
      meta: {
        title: '轮播'
      }
    },
    {
      path: '/hover',
      name: 'hover',
      component: resolve => require(['../views/hover'],resolve),
      meta: {
        title: 'hover'
      }
    }
  ]
})

