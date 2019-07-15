import mock from './base'

mock.post('/mock/login',
  mock.ret({
    token: '@string(32)',
    userInfo: {
      name: '@cname',
      avatar: mock.avatar()
    },
    roles: ['1']
  })
)

mock.get('/mock/userInfo',
  mock.ret({
    token: '@string(32)',
    userInfo: {
      name: '@cname',
      avatar: mock.avatar(),
      email: '@email'
    },
    roles: ['1']
  })
)

mock.post('/mock/logout',
  mock.ret({})
)

mock.get('/mock/systemApi/systemMenu/getAccountMenuList',
  mock.ret([
    {
      menuName: '系统设置',
      menuUrl: '/system_setting',
      position: 0,
      sort: 1,
      children: [
        {
          menuName: '权限管理',
          menuUrl: '/system_setting/permission_mgr',
          position: 1,
          sort: 1,
          children: [
            // {
            //   menuUrl: '/system_setting/permission_mgr/role_mgr',
            //   menuName: '角色管理'
            // },
            {
              menuUrl: '/system_setting/permission_mgr/user_mgr',
              menuName: '用户管理',
              position: 2,
              sort: 9
            },
            {
              menuUrl: '/system_setting/permission_mgr/menu_mgr',
              menuName: '权限菜单管理',
              position: 2,
              sort: 2
            },
            {
              menuUrl: '/system_setting/permission_mgr/operate_log',
              menuName: '操作日志',
              sort: 3
            }
          ]
        },
        {
          menuUrl: '/system_setting/platform_setting',
          menuName: '平台设置',
          position: 1,
          children: [
            {
              menuUrl: '/system_setting/platform_setting/account_setting',
              menuName: '账户设置'
            },
            {
              menuUrl: '/system_setting/platform_setting/login_log',
              menuName: '登录日志'
            }
          ]
        }
      ]
    },
    {
      menuName: '商户中心',
      menuUrl: '/mall_center',
      sort: 2,
      position: 0,
      children: []
    },
    {
      menuName: '价格中心',
      menuUrl: '/price_center',
      sort: 2,
      position: 0,
      children: []
    },
    {
      menuName: '价格中心',
      menuUrl: '/finace_center',
      sort: 3,
      position: 0,
      children: []
    }
  ])
)

// mock.get('/mock/systemApi/systemMenu/getAccountMenuList',
//   mock.ret([
//     { menumenuName: '角色管理', menuUrl: '/system_setting/permission_mgr/role_mgr', sort: 1 },
//     { menumenuName: '用户管理', menuUrl: '/system_setting/permission_mgr/user_mgr', sort: 2 },
//     { menumenuName: '权限菜单管理', menuUrl: '/system_setting/permission_mgr/menu_mgr', sort: 3 },
//     { menumenuName: '操作日志', menuUrl: '/views/system_setting/permission_mgr/operate_log', sort: 4 }
//   ])
// )
