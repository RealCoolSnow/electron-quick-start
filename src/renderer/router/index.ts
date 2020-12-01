/*
 * @Description:
 * @Author: CoolSnow (coolsnow2020@gmail.com)
 * @Date: 2020-09-14 16:19:45
 * @LastEditors: CoolSnow
 * @LastEditTime: 2020-09-15 14:18:08
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/@/pages/home/index.vue'
import About from '/@/pages/about/index.vue'

const routes = [
  {
    path: '/',
    component: () => Home,
  },
  {
    path: '/about',
    component: () => About,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
