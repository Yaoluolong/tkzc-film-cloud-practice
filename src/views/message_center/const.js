export const messageColumns = context => {
  return [
    {
      label: '已读未读',
      width: 50,
      render: (h, row) => {
        return (
          <span class={+row.isLook === 0 ? 'danger' : 'default'}>●</span>
        )
      }
    },
    {
      prop: 'content',
      align: 'left',
      label: '消息体'
    },
    {
      label: '查看详情',
      width: 100,
      align: 'left',
      render: (h, row) => {
        return (
          <el-button type='text' on-click={() => context.operDetail(row)}>
            【查看详情】
          </el-button>
        )
      }
    },
    {
      prop: 'createTime',
      label: '消息时间',
      align: 'right',
      width: 160
    }
  ]
}
