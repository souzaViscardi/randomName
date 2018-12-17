import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/Home'
import shop from '@/components/shop'
import client from '@/components/cadastro/client'
import product from '@/components/cadastro/product'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/new/client',
      name: 'new-client',
      component: client
    },
    {
      path: '/new/product',
      name: 'new-product',
      component: product
    },
    {
      path: '/shop',
      name: 'shop',
      component: shop
    }
  ]
})
