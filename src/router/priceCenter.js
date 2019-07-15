import Layout from '../views/layout/Layout'
export default [
  {
    path: 'price_policy_mgr',
    component: Layout,
    meta: { title: '影院定价/排期管理', icon: 'celve' },
    children: [
      {
        path: 'price_policy_program',
        name: 'price_policy_program',
        component: () => import('@/views/price_center/price_policy_mgr/price_policy_program'),
        meta: { title: '影院定价分组', icon: '' }
      },
      {
        path: 'price_policy_program/:operType',
        name: 'edit_policy_price_program',
        hidden: true,
        props: true,
        component: () => import('@/views/price_center/price_policy_mgr/price_policy_program/EditPricePolicyProgram'),
        meta: { title: '影院定价分组', icon: '' }
      },
      {
        path: 'cinema_plan',
        name: 'cinema_plan',
        component: () => import('@/views/price_center/price_policy_mgr/cinema_plan'),
        meta: { title: '影院排期管理', icon: '' }
      }
    ]
  },
  {
    path: 'price_mgr',
    component: Layout,
    meta: { title: '价格管理', icon: 'jiage0101' },
    children: [
      {
        path: 'normal_price_program',
        name: 'normal_program_mgr',
        component: () => import('@/views/price_center/price_mgr/price_program_mgr'),
        meta: { title: '常规价格方案管理', icon: '', programType: 1, programTypeName: 'normal' }
      },
      {
        path: 'normal_price_program/:operType',
        name: 'edit_normal_price_program',
        hidden: true,
        props: true,
        component: () => import('@/views/price_center/price_mgr/price_program_mgr/EditPriceProgram'),
        meta: { title: '常规价格方案', icon: '', programType: 1, programTypeName: 'normal' }
      }, {
        path: 'activity_price_program',
        name: 'active_program_mgr',
        props: true,
        component: () => import('@/views/price_center/price_mgr/price_program_mgr'),
        meta: { title: '活动价格方案管理', icon: '', programType: 2, programTypeName: 'activity' }
      },
      {
        path: 'activity_price_program/:operType',
        name: 'edit_price_program',
        hidden: true,
        props: true,
        component: () => import('@/views/price_center/price_mgr/price_program_mgr/EditPriceProgram'),
        meta: { title: '活动价格方案', icon: '', programType: 2, programTypeName: 'activity' }
      },
      {
        path: 'special_service_mgr',
        name: 'special_service_mgr',
        component: () => import('@/views/price_center/price_mgr/special_service_mgr'),
        meta: { title: '商家增值费管理', icon: '', programType: 2, programTypeName: 'activity' }
      },
      {
        path: 'special_service_mgr/:operType',
        name: 'edit_special_service_mgr',
        hidden: true,
        props: true,
        component: () => import('@/views/price_center/price_mgr/special_service_mgr/EditSpecialService'),
        meta: { title: '商家增值费', icon: '' }
      },
      {
        path: 'channel_plan',
        name: 'channel_plan',
        component: () => import('@/views/price_center/price_mgr/channel_plan'),
        meta: { title: '商家影院排期管理', icon: '' }
      },
      {
        path: 'channel_plan/channel_management',
        name: 'channel_management',
        hidden: true,
        component: () => import('@/views/price_center/price_mgr/channel_plan/ChannelManagement'),
        meta: { title: '管理排期', icon: '' }
      },
      {
        path: 'auto_pricing_scheme',
        name: 'auto_pricing_scheme',
        component: () => import('@/views/price_center/price_mgr/auto_pricing_scheme'),
        meta: { title: '智能定价方案', icon: '' }
      },
      {
        path: 'auto_pricing_scheme/:operType',
        name: 'new_auto_pricing_scheme',
        hidden: true,
        props: true,
        component: () => import('@/views/price_center/price_mgr/auto_pricing_scheme/NewPriceScheme'),
        meta: { title: '智能定价方案', icon: '' }
      },
      {
        path: 'channel_auto_pricing_scheme',
        name: 'channel_auto_pricing_scheme',
        component: () => import('@/views/price_center/price_mgr/channel_auto_pricing_scheme'),
        meta: { title: '商家智能定价方案', icon: '' }
      }
    ]
  }
  // {
  //   path: 'activity_price_mgr',
  //   component: Layout,
  //   meta: { title: '活动价格管理', icon: 'quotation' },
  //   children: [

  //   ]
  // }
  // {
  //   path: 'plan_price_mgr',
  //   component: Layout,
  //   meta: { title: '排期价格调价管理', icon: 'jiage' },
  //   children: [
  //     {
  //       path: 'plan_price_program',
  //       name: 'plan_price_program',
  //       component: () => import('@/views/price_center/plan_price_mgr/plan_price_program'),
  //       meta: { title: '影院排期价格调价', icon: '' }
  //     },
  //     {
  //       path: 'plan_price_program/:operType',
  //       name: 'edit_plan_price_program',
  //       hidden: true,
  //       component: () => import('@/views/price_center/plan_price_mgr/plan_price_program/EditPlanPriceProgram'),
  //       props: true,
  //       meta: { title: '影院排期价格调价', icon: '' }
  //     }
  //     // {
  //     //   path: 'aduit_center',
  //     //   name: 'aduit_center',
  //     //   component: () => import('@/views/404'),
  //     //   meta: { title: '审批中心', icon: '' }
  //     // }
  //   ]
  // }
]
