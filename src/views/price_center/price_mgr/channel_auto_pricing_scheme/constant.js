const isDisable = row => {
  return row.statusName.indexOf('失效') === -1 ? '' : 'info'
}
export const autoSchemeColumns = context => {
  return [
    {
      label: '权重',
      prop: 'sort'
    },
    {
      align: 'left',
      prop: 'name',
      label: '方案名称'
    },
    {
      label: '有效日期',
      render: (h, row) => {
        return <span>
          {row.startDate}&nbsp;&nbsp;-&nbsp;&nbsp;{row.endDate}
        </span>
      }
    },
    {
      label: '状态',
      prop: 'statusName'
    },
    {
      label: '操作',
      width: 160,
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
    },
    {
      label: '拖动排序',
      width: 160,
      render: (h, row) => {
        return <i class='el-icon-rank'></i>
      }
    }
  ]
}
export const chooseAutoSchemeColumns = context => {
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
        return (
          <span class={isDisable(row)}>
            {row.startDate}&nbsp;&nbsp;-&nbsp;&nbsp;{row.endDate}
          </span>
        )
      }
    },
    {
      prop: 'createTime',
      label: '创建时间'
    },
    {
      label: '状态',
      render: (h, row) => {
        return <span class={isDisable(row)}>{row.statusName}</span>
      }
    }
  ]
}
