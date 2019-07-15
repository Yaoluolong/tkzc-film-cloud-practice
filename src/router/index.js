import Vue from 'vue'
import Router from 'vue-router'
import commonRouter from './common'
import systemSettingRouter from './systemSetting'
import mallCenterRouter from './mallCenter'
import priceCenterRouter from './priceCenter'
// import financeCenterRouter from './financeCenter'
// import operationCenterRouter from './operationCenter'

Vue.use(Router)

import NavLayout from '../views/layout/NavLayout'

const loginUrl = window.localStorage.getItem('hash') || '/login/index' // 不做总入口地址,平台和用户各用个的 , 登录时候保存入口锚点
export const constantRouterMap = [
  { path: '/login', redirect: loginUrl },
  {
    path: '/common_page',
    name: 'common_page',
    meta: { title: '公用模块' },
    component: NavLayout,
    hidden: true,
    children: [...commonRouter]
  },
  // { path: '/login', redirect: '/login/index' },
  {
    path: '/login/:operType',
    component: () => import('@/views/user/login'),
    hidden: true,
    props: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true }
  // { path: '', redirect: 'system_setting' }
]

export default new Router({
  // mode: 'history', // 后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/system_setting',
    name: 'system_setting',
    meta: { title: '系统设置' },
    component: NavLayout,
    redirect: '/system_setting/permission_mgr/role_mgr',
    children: [...systemSettingRouter]
  },
  {
    path: '/mall_center',
    name: 'mall_center',
    meta: { title: '商户中心' },
    component: NavLayout,
    redirect: '/mall_center/channel_mgr/channel_connect',
    children: [...mallCenterRouter]
  },
  {
    path: '/price_center',
    name: 'price_center',
    meta: { title: '价格中心' },
    component: NavLayout,
    redirect: '/price_center/price_policy_mgr/price_policy_program',
    children: [...priceCenterRouter]
  }
  // {
  //   path: '/finace_center',
  //   name: 'finace_center',
  //   meta: { title: '财务中心' },
  //   component: NavLayout,
  //   redirect: '/finace_center/finance_report/ticket_order',
  //   children: [...financeCenterRouter]
  // },
  // {
  //   path: '/operation_center',
  //   name: 'operation_center',
  //   meta: { title: '运营中心' },
  //   component: NavLayout,
  //   redirect: '/operation_center/user_mgr/member_list',
  //   children: [...operationCenterRouter]
  // }
]
