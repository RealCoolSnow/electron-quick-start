/*
 * @Description:
 * @Author: CoolSnow (coolsnow2020@gmail.com)
 * @Date: 2020-09-15 14:21:39
 * @LastEditors: CoolSnow
 * @LastEditTime: 2020-09-15 14:23:45
 */
export default [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '@/pages/home/index.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/pages/about/index.vue'),
  },
]
