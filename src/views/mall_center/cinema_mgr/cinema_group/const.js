// 影院分组详情列表
export const cinemaGroupDetailColumns = context => {
  return [
    {
      prop: 'cinemaName',
      label: '影院名',
      minWidth: 120
    },
    {
      prop: 'cinemaId',
      label: '影院编码',
      minWidth: 120
    },
    {
      prop: 'interfaceName',
      label: '接口商',
      minWidth: 120
    },
    {
      prop: 'address',
      label: '影院地址',
      minWidth: 160
    },
    {
      hide: +context.chooseParams.cinemaType === 1,
      button: true,
      label: '操作',
      fixed: 'right',
      minWidth: 120,
      render: (h, row) => {
        return (
          <el-button
            type='text'
            onClick={() => context.onOperateClick('del', row)}
          >
            删除
          </el-button>
        )
      }
    }
  ]
}
