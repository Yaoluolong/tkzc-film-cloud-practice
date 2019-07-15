import Layout from '../views/layout/Layout'
export default [
  {
    path: 'channel_mgr',
    component: Layout,
    meta: { title: '平台商家管理', icon: 'qudao' },
    children: [
      {
        path: 'channel_connect',
        name: 'channel_connect',
        component: () =>
          import('@/views/mall_center/channel_mgr/channel_connect'),
        meta: { title: '商家接入', icon: '' }
      },
      {
        path: 'channel_connect/:operType',
        name: 'edit_channel',
        hidden: true,
        props: true,
        component: () =>
          import('@/views/mall_center/channel_mgr/channel_connect/EditChannel'),
        meta: { title: '商家', icon: '' }
      },
      {
        path: 'view_channel',
        name: 'view_channel',
        hidden: true,
        props: true,
        component: () =>
          import('@/views/mall_center/channel_mgr/channel_connect/ViewChannel'),
        meta: { title: '查看商家接入', icon: '' }
      },
      {
        path: 'sellable_channel_mgr',
        name: 'sellable_channel_mgr',
        component: () =>
          import('@/views/mall_center/channel_mgr/sellable_channel_mgr'),
        meta: { title: '商家可售影院管理', icon: '' }
      },
      {
        path: 'sellable_channel_mgr/:operType',
        name: 'edit_sellable_channel',
        hidden: true,
        props: true,
        component: () =>
          import(
            '@/views/mall_center/channel_mgr/sellable_channel_mgr/EditSellableChannel'
          ),
        meta: { title: '商家可售影院', icon: '' }
      }
    ]
  },
  {
    path: 'cinema_mgr',
    component: Layout,
    meta: { title: '影院管理', icon: 'yingyuan' },
    children: [
      {
        path: 'systemer_mgr',
        name: 'systemer_mgr',
        component: () => import('@/views/mall_center/cinema_mgr/systemer_mgr'),
        meta: { title: '票务系统商接入', icon: '' }
      },
      {
        path: 'systemer_mgr/:operType',
        name: 'edit_systemer',
        hidden: true,
        props: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/systemer_mgr/EditSystemer'),
        meta: { title: '系统商', icon: '' }
      },
      {
        path: 'cinema_connect',
        name: 'cinema_connect',
        component: () =>
          import('@/views/mall_center/cinema_mgr/cinema_connect'),
        meta: { title: '影院接入', icon: '' }
      },
      {
        path: 'cinema_connect/:operType',
        name: 'edit_cinema',
        hidden: true,
        props: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/cinema_connect/EditCinema'),
        meta: { title: '影院接入', icon: '' }
      },
      {
        path: 'view_cinema',
        name: 'view_cinema',
        hidden: true,
        props: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/cinema_connect/ViewCinema'),
        meta: { title: '查看影院接入', icon: '' }
      },
      {
        path: 'hall_mgr',
        name: 'hall_mgr',
        component: () => import('@/views/mall_center/cinema_mgr/hall_mgr'),
        meta: { title: '影厅管理', icon: '' }
      },
      {
        path: 'hall_mgr/seat_pic',
        name: 'seat_pic',
        hidden: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/hall_mgr/SeatPic'),
        meta: { title: '查看影厅座位图', icon: '' }
      },
      {
        path: 'cinema_check',
        name: 'cinema_check',
        component: () => import('@/views/mall_center/cinema_mgr/cinema_check'),
        meta: { title: '影院检测', icon: '' }
      },
      {
        path: 'settlement_price',
        name: 'settlement_price',
        component: () =>
          import('@/views/mall_center/cinema_mgr/settlement_price'),
        meta: { title: '影院结算价管理', icon: '' }
      },
      {
        path: 'settlement_price/:operType',
        name: 'edit_settlement_price',
        hidden: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/settlement_price/Edit'),
        meta: { title: '影院结算价', icon: '' }
      },
      {
        path: 'cinema_group',
        name: 'cinema_group',
        component: () => import('@/views/mall_center/cinema_mgr/cinema_group'),
        meta: { title: '影院分组', icon: '' }
      },
      {
        path: 'cinema_group/:operType',
        name: 'create_cinema_group',
        hidden: true,
        component: () =>
          import(
            '@/views/mall_center/cinema_mgr/cinema_group/CreateCinemaGroup'
          ),
        meta: { title: '影院分组', icon: '' }
      },
      {
        path: 'hall_plan_mgr',
        name: 'hall_plan_mgr',
        component: () => import('@/views/mall_center/cinema_mgr/hall_plan_mgr'),
        meta: { title: '影院影厅排期管理', icon: '' }
      },
      {
        path: 'view_hall',
        name: 'view_hall',
        hidden: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/hall_plan_mgr/ViewHall'),
        meta: { title: '查看影厅', icon: '' }
      },
      {
        path: 'view_plan',
        name: 'view_plan',
        hidden: true,
        component: () =>
          import('@/views/mall_center/cinema_mgr/hall_plan_mgr/ViewPlan'),
        meta: { title: '查看排期', icon: '' }
      }
    ]
  }
]
