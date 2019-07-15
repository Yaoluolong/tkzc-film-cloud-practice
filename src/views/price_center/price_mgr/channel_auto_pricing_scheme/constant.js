const isDisable = row => {
  return row.statusName.indexOf('失效') === -1 ? '' : 'info'
}
export const autoSchemeColumns = context => {
  return [
    {
      label: '权重',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.name}</span>
      }
    },
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
            {start}&nbsp;&nbsp;-&nbsp;&nbsp;{end}
          </span>
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
            onClick={() => context.confirmDelete(row)}
          >
            删除
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
