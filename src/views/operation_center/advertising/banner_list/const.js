// 运营中心-广告管理-投放终端
export const DEVICE_TYPES = info => {
  const txt = +info.type === 1
    ? '部分外链网址在移动APP无法访问，请谨慎选择！'
    : +info.type === 4 ? '抢券活动有可能在移动APP终端内无法打开，请谨慎选择！' : ''
  return [
    {
      value: '1',
      label: '微信H5'
    },
    {
      value: '2',
      label: '移动app',
      content: txt
    }
  ]
}

export const DEVICE_JUMP_TYPES = [
  {
    label: '活动详情页',
    value: '2'
  },
  {
    label: '活动列表页',
    value: '1'
  }
]

