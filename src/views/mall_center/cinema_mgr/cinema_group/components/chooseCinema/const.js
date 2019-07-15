// 影院分组详情列表
export const chooseCinemaColumns = context => {
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
    }
  ]
}
