import mock from './base'

// ==============渠道商管理========================
// 渠道商接入
mock.get('/mock/getInterfaceDict',
  mock.retArray({
    name: /平台接口[A-Z]/,
    'value|+1': 0
  }, 5)
)
mock.get('/mock/getChannelPageList',
  mock.page({
    channel: '@ctitle(4,8)',
    connectName: '@cname',
    connectPhone: /\d{11}/,
    'platService|1-5': 1,
    'floatTicketPrice|1-5': 1,
    'floatCinemaService|1-5': 1,
    interfaceName: /平台接口[A-Z]/,
    'status|1': ['1', '2'],
    createTime: '@time("yyyy-MM-dd HH:mm:ss")'
  })
)
// ================排期管理=================
// 影院排期
mock.get('/mock/getCinemaPlanPageList',
  mock.page({
    cinemaName: '@ctitle(4,8)',
    filmName: '@ctitle(4,10)',
    featureAppNo: /\d{11}/,
    'lowestPrice|1-5': 1,
    'standardPrice|1-5': 1,
    'listingPrice|1-5': 1,
    'ticketPrice|1-5': 1,
    startTime: '@time("yyyy-MM-dd HH:mm:ss")',
    hallName: /\d{1}号厅/,
    'copyType|1': ['3D 4D', 'ZMAX 2D', '3D 2D', '3D'],
    'statusName|1': ['正常', '关闭'],
    'status|1': ['1', '2'],
    updateTime: '@time("yyyy-MM-dd HH:mm:ss")'
  })
)
