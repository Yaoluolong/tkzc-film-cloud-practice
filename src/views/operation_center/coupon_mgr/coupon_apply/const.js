export const couponApplyColumns = context => {
  return [
    {
      prop: 'operator',
      label: '分销商名称',
      minWidth: 120
    },
    {
      prop: 'name',
      label: '券申请名称',
      minWidth: 120
    },
    {
      prop: 'styleName',
      label: '券类型',
      minWidth: 120
    },
    {
      prop: 'typeName',
      label: '券种类',
      minWidth: 120
    },
    {
      prop: 'number',
      label: '申请数量（张）',
      minWidth: 120
    },
    {
      prop: 'creatTime',
      label: '申请时间',
      minWidth: 160
    },
    {
      prop: 'statusStr',
      label: '申请状态',
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
            onClick={() => context.onOperateClick('detail', row)}
          >
              详情
          </el-button>
        )
      }
    }
  ]
}

// 券申请详情类型
export const couponApplyDetaliType = info => {
  const manager = []
  Array.isArray(info.manager) && info.manager.forEach(e => {
    manager.push(e.realName)
  })
  return [
    {
      name: '券申请名称',
      key: 'name'
    },
    {
      name: '业务员',
      render: Array.isArray(manager) ? manager.join(',') : ''
    },
    {
      name: '申请时间',
      key: 'creatTime'
    },
    {
      name: '申请人',
      key: 'resellerOperator'
    },
    {
      name: '分销商客户',
      key: 'customerName'
    },
    {
      name: '券类型',
      key: 'styleName'
    },
    {
      name: '券种类',
      key: 'typeName'
    },
    {
      name: '有效期',
      render: `${info.startTime}-${info.endTime}`
    },
    {
      name: '申请数量',
      key: 'number',
      unit: '张'
    },
    {
      name: '备注',
      key: 'content'
    }
  ]
}
