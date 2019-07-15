import Layout from '../views/layout/Layout'
export default [
  {
    path: 'finance_report',
    component: Layout,
    meta: { title: '财务报表', icon: 'baobiao' },
    children: [
      {
        path: 'ticket_order',
        name: 'ticket_order',
        component: () => import('@/views/finace_center/finance_report/ticket_order'),
        meta: { title: '票务订单', icon: '' }
      },
      {
        path: 'ticket_order/order_detail',
        name: 'order_detail',
        hidden: true,
        component: () => import('@/views/finace_center/finance_report/ticket_order/OrderDetail'),
        meta: { title: '订单明细', icon: '' }
      },
      {
        path: 'coupon_sales_order',
        name: 'coupon_sales_order',
        component: () => import('@/views/finace_center/finance_report/coupon_order'),
        meta: { title: '电影券销售订单', icon: '' }
      },
      {
        path: 'coupon_sales_order/order_detail',
        name: 'coupon_sales_order_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/finace_center/finance_report/coupon_order/OrderDetail'),
        meta: { title: '订单明细', icon: '' }
      },
      {
        path: 'card_sales_order',
        name: 'card_sales_order',
        component: () => import('@/views/finace_center/finance_report/filmCard_order'),
        meta: { title: '电影卡销售订单', icon: '' }
      },
      {
        path: 'card_sales_order/order_detail',
        name: 'card_order_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/finace_center/finance_report/filmCard_order/OrderDetail'),
        meta: { title: '订单明细', icon: '' }
      },
      {
        path: 'card_recharge_order',
        name: 'card_recharge_order',
        component: () => import('@/views/finace_center/finance_report/filmCard_recharge_order'),
        meta: { title: '电影卡充值订单', icon: '' }
      },
      {
        path: 'card_recharge_order/order_detail',
        name: 'card_recharge_order_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/finace_center/finance_report/filmCard_recharge_order/OrderDetail'),
        meta: { title: '订单明细', icon: '' }
      },
      {
        path: 'coupon_used_order',
        name: 'coupon_used_order',
        component: () => import('@/views/finace_center/finance_report/coupon_used_order'),
        meta: { title: '电影券使用明细', icon: '' }
      },
      {
        path: 'coupon_used_order_detail',
        name: 'coupon_used_order_detail',
        hidden: true,
        props: true,
        component: () => import('@/views/finace_center/finance_report/coupon_used_order/detail'),
        meta: { title: '查看明细', icon: '' }
      }
    ]
  }
]
