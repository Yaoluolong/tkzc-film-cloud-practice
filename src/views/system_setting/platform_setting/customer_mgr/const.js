export const couponApplyColumns = context => {
  return [
    {
      prop: 'operator',
      label: '分销商名称',
      minWidth: 120
    },
    {
      prop: 'name',
      label: '申请流程名称',
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
