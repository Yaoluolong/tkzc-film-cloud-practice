import mock from './base'

// =================平台设置===================
mock.get('/mock/getLoginLogPageList',
  mock.page({
    name: '@cname',
    loginTime: '@time("yyyy-MM-dd HH:mm:ss")',
    ip: '@ip',
    area: '@city(true)',
    'browser|1': ['Firefox', 'Chrome', 'IE', 'QQ Brower']
  })
)

// ==================权限管理====================
// 角色管理
mock.get('/mock/getRolePageList',
  mock.page({
    id: '@id',
    roleName: '@cname',
    desc: '@ctitle(20,100)',
    'userNum|1-2000': 1,
    createTime: '@time("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['1', '2']
  })
)
mock.get('/mock/getRoleInfo',
  mock.ret({
    id: '@id',
    roleName: '@cname',
    desc: '@ctitle(20,100)',
    'userNum|1-2000': 1,
    createTime: '@time("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['1', '2'],
    menuIds: []
  })
)

mock.get('/mock/getRoleDict',
  mock.retArray([
    { name: '测试主管', value: '1' },
    { name: '产品经理', value: '2' }
  ], null)
)
// 用户管理
mock.get('/mock/getUserPageList',
  mock.page({
    id: '@id',
    userName: '@cname',
    realName: '@cname',
    email: '@email',
    'roleName|1': ['测试主管', '产品经理'],
    createTime: '@time("yyyy-MM-dd HH:mm:ss")',
    lastLoginTime: '@time("yyyy-MM-dd HH:mm:ss")',
    'status|1': ['1', '2']
  })
)
mock.get('/mock/getUserInfo',
  mock.ret({
    userName: '@cname',
    realName: '@cname',
    email: '@email',
    roleId: '@id',
    type: '1',
    remark: '@ctitle(20,100)'
  })
)
// 权限菜单管理
mock.get('/mock/getMenuListByParentIds',
  mock.retArray({
    id: '@id',
    name: '@ctitle(4,8)',
    'sort|+1': 1,
    'status|1': ['1', '2'],
    test: '123',
    'children|5-10': [{
      id: '@id',
      name: '@ctitle(4,8)',
      'sort|+1': 1,
      'status|1': ['1', '2']
    }]
  }, '2-5')
)
mock.get('/mock/getMenuListByParentId',
  mock.retArray({
    id: '@id',
    name: '@ctitle(4,8)',
    'sort|+1': 1,
    'status|1': ['1', '2']
  }, 10)
)
mock.get('/mock/getMenuInfo',
  mock.ret({
    id: '@id',
    menuUrl: '@url',
    'sort|+1': 1,
    'status|1': ['1', '2'],
    menuName: '@ctitle(4,8)'
  }, 10)
)

mock.get('/mock/getOperateLogPageList',
  mock.page({
    userName: '@cname',
    opreateTime: '@time("yyyy-MM-dd HH:mm:ss")',
    ip: '@ip',
    remark: '@ctitle(20,60)'
  })
)
