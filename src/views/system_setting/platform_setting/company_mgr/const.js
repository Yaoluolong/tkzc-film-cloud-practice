export const couponApplyColumns = context => {
  return [
    {
      prop: 'name',
      label: '公司名称',
      minWidth: 120
    },
    {
      prop: 'createTime',
      label: '添加时间',
      minWidth: 120
    },
    {
      prop: 'operator',
      label: '创建人',
      minWidth: 120
    },
    {
      button: true,
      label: '操作',
      fixed: 'right',
      minWidth: 120,
      render: (h, row) => {
        const edit = (<el-button
          type='text'
          onClick={() => context.onOperateClick('edit', row)}
        >
            编辑
        </el-button>)
        const del = (<el-button
          type='text'
          onClick={() => context.onOperateClick('del', row)}
        >
          删除
        </el-button>)
        return (
          <div class='button-group'>
            { edit }
            { del }
          </div>
        )
      }
    }
  ]
}
