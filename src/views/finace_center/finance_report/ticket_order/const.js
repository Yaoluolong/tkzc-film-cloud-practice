// 统计字段类型
export const showSumType = [
  {
    key: 'orderTotalNum',
    label: '订单总数'
  },
  {
    key: 'amountSum',
    label: '订单总额'
  },
  {
    key: 'validOrderNum',
    label: '有效订单数'
  },
  {
    key: 'sellTicketNum',
    label: '出票数'
  }, {
    key: 'userPayNum',
    label: '支付用户数'
  }, {
    key: 'cinemaSettlementPrice',
    label: '影院结算价'
  },
  {
    key: 'revenueServiceFeeSum',
    label: '平台营收总额'
  }
]
// 订单查询类型
export const orderQueryType = [
  {
    label: '订单号',
    value: 'orderNo'
  },
  {
    label: '购票手机号',
    value: 'mobile'
  },
  {
    label: '券编码',
    value: 'couponCode'
  },
  {
    label: '交易影院',
    value: 'cinemaName'
  },
  {
    label: '会员绑定手机号',
    value: 'receiveMobile'
  },
  {
    label: '电影名称',
    value: 'filmName'
  },
  {
    label: '电影卡号',
    value: 'cardCode'
  }
]
// 订单状态类型
export const orderStatusType = [
  {
    label: '全部',
    value: '-1'
  },
  {
    label: '待支付',
    value: '0'
  },
  {
    label: '仅退票未退款',
    value: '9'
  },
  {
    label: '放弃订单',
    value: '2'
  },
  {
    label: '超时订单',
    value: '3'
  },
  {
    label: '订单成功',
    value: '4'
  },
  {
    label: '退票退款',
    value: '6'
  },
  {
    label: '购票失败退款',
    value: '7'
  },
  {
    label: '柜台退票',
    value: '8'
  }
]

// 订单列表
export const orderColumns = context => {
  return [
    {
      prop: 'orderNo',
      label: '订单号',
      minWidth: 120
    },
    {
      prop: 'mobile',
      label: '购票手机号',
      minWidth: 120
    },
    {
      prop: 'orderTime',
      label: '支付时间',
      minWidth: 160
    },
    {
      prop: 'channelName',
      label: '渠道类型',
      minWidth: 120
    },
    {
      prop: 'orderStatusName',
      label: '订单状态',
      minWidth: 120
    },
    {
      prop: 'cinemaName',
      label: '交易影院',
      minWidth: 120
    },
    {
      button: true,
      label: '操作',
      fixed: 'right',
      minWidth: 120,
      render: (h, row) => {
        return (
          <el-button
            type='text'
            on-click={() => context.$router.push({ path: '/finace_center/finance_report/ticket_order/order_detail', query: { id: row.orderId }})}
          >
            详情
          </el-button>
        )
      }
    }
  ]
}
