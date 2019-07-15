import Layout from '../views/layout/Layout'
export default [
  {
    path: 'permission_mgr',
    component: Layout,
    meta: { title: '权限管理', icon: 'quanxian' },
    children: [
      {
        path: 'menu_mgr',
        name: 'menu_mgr',
        component: () => import('@/views/system_setting/permission_mgr/menu_mgr'),
        meta: { title: '权限菜单管理', icon: '' }
      },
      {
        path: 'region_list',
        name: 'region_list',
        component: () => import('@/views/system_setting/permission_mgr/region'),
        meta: { title: '城市地域管理', icon: '' }
      },
      {
        path: 'merchant_list',
        name: 'merchant_list',
        component: () => import('@/views/system_setting/permission_mgr/merchant'),
        meta: { title: '商户调试管理', icon: '' }
      },
      {
        path: 'pay_param',
        name: 'pay_param',
        component: () => import('@/views/system_setting/permission_mgr/pay_param'),
        meta: { title: '支付参数管理', icon: '' }
      },
      {
        path: 'score',
        name: 'score',
        component: () => import('@/views/system_setting/permission_mgr/score'),
        meta: { title: '积分平台商家管理', icon: '' }
      },
      {
        path: 'score/:operType',
        name: 'edit_score',
        hidden: true,
        component: () => import('@/views/system_setting/permission_mgr/score/EditPlane'),
        meta: { title: '积分平台商家', icon: '' }
      },
      {
        path: 'sms',
        name: 'sms',
        component: () => import('@/views/system_setting/permission_mgr/sms'),
        meta: { title: '短信平台管理', icon: '' }
      },
      {
        path: 'end_point',
        name: 'end_point',
        component: () => import('@/views/system_setting/permission_mgr/end_point'),
        meta: { title: '消费终端管理', icon: '' }
      },
      {
        path: 'pay_params_table',
        name: 'pay_params_table',
        component: () => import('@/views/system_setting/permission_mgr/pay_param/pay_params_table'),
        meta: { title: '支付参数管理', icon: '' }
      },
      {
        path: 'pay_params_table/:operType',
        name: 'pay_params_table_operat',
        hidden: true,
        component: () => import('@/views/system_setting/permission_mgr/pay_param/pay_params_table/operatePayParams'),
        meta: { title: '支付参数管理', icon: '' }
      },
      {
        path: 'activity_pay',
        name: 'activity_pay',
        component: () => import('@/views/system_setting/permission_mgr/activity_pay_setting'),
        meta: { title: '活动交易支付参数', icon: '' }
      },
      {
        path: 'activity_pay/:operType',
        name: 'activityPay',
        hidden: true,
        // props: true,
        component: () => import('@/views/system_setting/permission_mgr/activity_pay_setting/operatePayParams'),
        meta: { title: '活动交易支付参数', icon: '' }
      }
    ]
  },
  {
    path: 'platform_setting',
    component: Layout,
    meta: { title: '平台管理', icon: 'shezhi' },
    children: [
      {
        path: 'role_mgr',
        name: 'role_mgr',
        component: () => import('@/views/system_setting/platform_setting/role_mgr'),
        meta: { title: '平台角色管理', icon: '' }
      },
      {
        path: 'role_mgr/:operType',
        name: 'edit_role',
        hidden: true,
        props: true,
        component: () => import('@/views/system_setting/platform_setting/role_mgr/EditRole'),
        meta: { title: '角色', icon: '', titles: { 'permission_setting': '权限设置' }}
      },
      {
        path: 'user_mgr',
        name: 'user_mgr',
        component: () => import('@/views/system_setting/platform_setting/user_mgr'),
        meta: { title: '平台用户管理', icon: '' }
      },
      {
        path: 'user_mgr/permission_setting',
        name: 'user_role',
        hidden: true,
        component: () => import('@/views/system_setting/platform_setting/role_mgr/EditRole'),
        meta: { title: '用户权限设置', icon: '', isPermissionSetting: true, isUserPermission: true }
      },
      {
        path: 'user_mgr/:operType',
        name: 'edit_user',
        hidden: true,
        props: true,
        component: () => import('@/views/system_setting/platform_setting/user_mgr/EditUser'),
        meta: { title: '用户', icon: '' }
      },
      {
        path: 'edit_data_access',
        name: 'edit_data_access',
        hidden: true,
        props: true,
        component: () => import('@/views/system_setting/platform_setting/user_mgr/EditDataAccess'),
        meta: { title: '数据权限', icon: '' }
      },
      {
        path: 'account_setting',
        name: 'account_setting',
        component: () => import('@/views/system_setting/platform_setting/account_setting'),
        meta: { title: '账户设置', icon: '' }
      },
      {
        path: 'login_log',
        name: 'login_log',
        component: () => import('@/views/system_setting/platform_setting/login_log'),
        meta: { title: '登录日志管理', icon: '' }
      },
      {
        path: 'operate_log',
        name: 'operate_log',
        component: () => import('@/views/system_setting/platform_setting/operate_log'),
        meta: { title: '操作日志管理', icon: '' }
      },
      {
        path: 'company_mgr',
        name: 'company_mgr',
        component: () => import('@/views/system_setting/platform_setting/company_mgr'),
        meta: { title: '公司管理', icon: '' }
      },
      {
        path: 'customer_mgr',
        name: 'customer_mgr',
        component: () => import('@/views/system_setting/platform_setting/customer_mgr'),
        meta: { title: '客户管理', icon: '' }
      }
    ]
  },
  { path: 'task_mgr',
    component: Layout,
    meta: { title: '任务管理', icon: 'quanxian' },
    children: [
      {
        path: 'task_mgr',
        name: 'task_mgr',
        component: () => import('@/views/system_setting/task_mgr/task_mgr'),
        meta: { title: '任务管理', icon: '' }
      }
    ]
  },
  { path: 'approvalAuth_mgr',
    component: Layout,
    meta: { title: '审批权限管理', icon: 'service' },
    children: [
      {
        path: 'approvalAuth_mgr',
        name: 'approvalAuth_mgr',
        component: () => import('@/views/system_setting/approvalAuth_mgr/approvalAuth_mgr'),
        meta: { title: '审批权限管理', icon: '' }
      },
      {
        path: 'approvalAuth_mgr/:operType',
        name: 'edit_approval_auth',
        hidden: true,
        component: () => import('@/views/system_setting/approvalAuth_mgr/approvalAuth_mgr/editApprovalAuth'),
        meta: { title: '审批权限', icon: '' }
      },
      {
        path: 'view_approval_auth',
        name: 'view_approval_auth',
        hidden: true,
        component: () => import('@/views/system_setting/approvalAuth_mgr/approvalAuth_mgr/ViewApprovalAuth'),
        meta: { title: '查看审批权限', icon: '' }
      }
    ]
  }
]
