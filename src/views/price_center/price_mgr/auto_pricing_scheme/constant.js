const isDisable = row => {
  return row.statusName.indexOf('失效') === -1 ? '' : 'info'
}
export const autoSchemeColumns = context => {
  return [
    {
      align: 'left',
      label: '方案名称',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.name}</span>
      }
    },
    {
      label: '有效日期',
      render: (h, row) => {
        const start =
          row.startDate.length > 10
            ? row.startDate.slice(0, 10)
            : row.startDate
        const end =
          row.endDate.length > 10 ? row.endDate.slice(0, 10) : row.endDate
        return (
          <span class={isDisable(row)}>
            {start} 至 {end}
          </span>
        )
      }
    },
    {
      label: '创建时间',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.createTime}</span>
      }
    },
    {
      align: 'left',
      label: '创建人',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.operator}</span>
      }
    },
    {
      label: '是否启用',
      render: (h, row, rowIndex) => {
        return (
          <el-switch
            value={+row.status === 1}
            onChange={() => context.switchOpenStatus(row, rowIndex)}
          />
        )
      }
    },
    {
      label: '状态',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.statusName}</span>
      }
    },
    {
      label: '操作',
      fixed: 'right',
      width: 200,
      render: (h, row) => {
        const edit = (
          <el-button
            size='small'
            type='text'
            onClick={() => context.openEdit(row)}
          >
            编辑
          </el-button>
        )
        const detail = (
          <el-button
            size='small'
            type='text'
            onClick={() => context.openDetail(row)}
          >
            详情
          </el-button>
        )
        return (
          <div>
            {edit}
            {detail}
          </div>
        )
      }
    }
  ]
}
// 定价方式，参考第三方
export const PRICING_METHODS = [
  {
    value: '1',
    label: '最高值定价'
  },
  {
    value: '2',
    label: '最低值定价'
  },
  {
    value: '3',
    label: '平均值定价'
  }
]

export const DATE_TYPES_MAP = {
  WEEKS: '1',
  DATE_RANGE: '2'
}
export const DATE_TYPES = [
  {
    label: '指定周期可用',
    value: DATE_TYPES_MAP.WEEKS
  }, {
    label: '指定日期可用',
    value: DATE_TYPES_MAP.DATE_RANGE
  }
]

export const createRuleItem = (obj = {}) => {
  return {
    timeType: '1',
    dateType: '1',
    timeRule: [createTimeRuleItem()],
    interfaceId: obj && obj.interfaceId ? obj.interfaceId : '',
    interfaceName: '',
    priceType: '1',
    price: '0.00',
    type: '1'
  }
}
// 指定周期、日期区间
export const createTimeRuleItem = (timeType = 1) => {
  const time = +timeType === 1 ? [] : [{
    startTime: '00:00:00',
    endTime: '23:59:59',
    valid: [
      '00:00:00',
      '23:59:59'
    ]
  }]
  return {
    id: Math.random().toString(),
    week: '',
    time,
    startDate: '',
    endDate: '',
    date: ''
  }
}
