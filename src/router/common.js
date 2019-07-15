import Layout from '../views/layout/Layout'
export default [
  {
    path: 'message_center',
    component: Layout,
    meta: { title: '消息中心', icon: 'qudao' },
    children: [
      {
        path: 'message_list',
        name: 'message_list',
        component: () => import('@/views/message_center/index'),
        meta: { title: '消息列表', icon: '' }
      }
    ]
  }
]
