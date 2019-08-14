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
  },
  {
    path: 'reconciliation_center',
    component: Layout,
    meta: { title: '财务对账中心', icon: 'baobiao' },
    children: [
      {
        path: 'reconciliation_apply_approval',
        name: 'reconciliation_apply_approval',
        component: () => import('@/views/finace_center/reconciliation_center/reconciliation_apply_approval'),
        meta: { title: '对账申请审批', icon: '' }
      },
      {
        path: 'reconciliation',
        name: 'reconciliation',
        component: () => import('@/views/finace_center/reconciliation_center/reconciliation'),
        meta: { title: '财务对账', icon: '' }
      },
      {
        path: 'finance_settlement',
        name: 'finance_settlement',
        component: () => import('@/views/finace_center/reconciliation_center/finance_settlement'),
        meta: { title: '财务结算', icon: '' }
      },
      {
        path: 'transfer_money',
        name: 'transfer_money',
        component: () => import('@/views/finace_center/reconciliation_center/transfer_money'),
        meta: { title: '财务转账', icon: '' }
      }
    ]
  },
  {
    path: 'capital_pool',
    component: Layout,
    meta: { title: '资金池管理', icon: 'baobiao' },
    children: [
      {
        path: 'deposit_approval',
        name: 'deposit_approval',
        component: () => import('@/views/finace_center/capital_pool/deposit_approval'),
        meta: { title: '预存金审批', icon: '' }
      },
      {
        path: 'deposit_detail',
        name: 'deposit_detail',
        component: () => import('@/views/finace_center/capital_pool/deposit_detail'),
        meta: { title: '预存金明细', icon: '' }
      }
    ]
  },
  {
    path: 'reconciliation_set',
    component: Layout,
    meta: { title: '对账配置', icon: 'baobiao' },
    children: [
      {
        path: 'cycle_set',
        name: 'cycle_set',
        component: () => import('@/views/finace_center/reconciliation_set/cycle_set'),
        meta: { title: '对账周期资金配置', icon: '' }
      }
    ]
  }
]
