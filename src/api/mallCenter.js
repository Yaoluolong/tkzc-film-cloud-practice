import request from '@/utils/request'

// ==============渠道商管理========================
// 渠道商接入
export function getInterfaceDict(query) {
  return request.get('/mock/getInterfaceDict', { params: query })
}
export function getChannelPageList(query) {
  return request.get('/systemApi/channel/getPageList', { params: query })
}
export function getChannelInfo(id) {
  return request.get('/systemApi/channel/getInfo', { params: { id }})
}
export function createChannel(params) {
  return request.post('/systemApi/channel/create', params)
}
export function updateChannel(params) {
  return request.post('/systemApi/channel/update', params)
}
export function deleteChannel(id) {
  return request.post('/systemApi/channel/delete', { id })
}
export function getChannelList(query) {
  return request.get('/systemApi/channel/getList', { params: query })
}
export function setChannelStatus(id, status) {
  return request.post('/systemApi/channel/setStatus', { id, status })
}
export function createUrl(id) {
  return request.post('/systemApi/channel/createUrl', { id })
}
// ================影院管理============
// 系统商
export function createInterfaceType(params) {
  return request.post('/systemApi/interfaceType/create', params)
}
export function updateInterfaceType(params) {
  return request.post('/systemApi/interfaceType/update', params)
}
export function deleteInterfaceType(id) {
  return request.post('/systemApi/interfaceType/delete', { id })
}
export function getInterfaceTypeInfo(id) {
  return request.get('/systemApi/interfaceType/getInfo', { params: { id }})
}
export function getInterfaceTypePageList(query) {
  return request.get('/systemApi/interfaceType/getPageList', { params: query })
}
export function getInterfaceTypeList(query) {
  return request.get('/systemApi/interfaceType/getList', { params: query })
}
export function getInterfaceOtherInfo(id) {
  return request.get('/systemApi/interfaceType/getOtherInfo', {
    params: { id }
  })
}

// 影院接入
export function getCityRegion(query) {
  return request.get('/systemApi/cinema/getCityRegionList', { params: query })
}
// 获取全国列表
export function getRegionList(query) {
  return request.get('/systemApi/cinema/getRegionList', { params: query })
}
export function getCinemaPageList(query) {
  return request.get('/systemApi/cinema/getPageList', { params: query })
}
export function getCinemaList(query) {
  return request.get('/systemApi/cinema/getList', { params: query })
}
export function createCinema(params) {
  return request.post('/systemApi/cinema/create', params)
}
export function updateCinema(params) {
  return request.post('/systemApi/cinema/update', params)
}
export function deleteCinema(id) {
  return request.post('/systemApi/cinema/delete', { id })
}
export function getCinemaInfo(id) {
  return request.get('/systemApi/cinema/getInfo', { params: { id }})
}
export function getProgramCopyType(cinemaIds) {
  return request.post('/systemApi/cinema/getProgramCopyType', { cinemaIds })
}
export function getDefaultCopyType(cinemaIds) {
  return request.post('/systemApi/cinema/getDefaultCopyType', { cinemaIds })
}
export function getOpenCinema(interfaceId, pageIndex) {
  return request.get('/systemApi/cinema/getOpenCinema', {
    params: { interfaceId, pageIndex }
  })
}
export function setCinemaListStatus(cinemaIds) {
  return request.post('/systemApi/cinema/setListStatus', cinemaIds)
}
export function exportCinemaList(query) {
  return request.get('/systemApi/cinema/exportCinemaList', { params: query })
}
export function priceRight(query) {
  return request.get('/systemApi/cinema/getPriceRight', { params: query })
}

// 影厅管理
export function getCinemaHallePageList(query) {
  return request.get('/systemApi/cinemaHall/getPageList', { params: query })
}
export function syncHall(params) {
  return request.post('/systemApi/cinemaHall/syncHall', params)
}
export function getSyncHallPercent(batchNo) {
  return request.get('/systemApi/cinemaHall/getSyncHallPercent', {
    params: { batchNo }
  })
}
export function getCinemaHalleSeat(query) {
  return request.get('/systemApi/cinemaHallSeat/getList', { params: query })
}
export function syncHallSeat(params) {
  return request.post('/systemApi/cinemaHallSeat/syncHallSeat', params)
}
export function getCinemaHallList(query) {
  return request.get('/systemApi/cinemaHall/getList', { params: query })
}
export function getFilmList(query) {
  return request.get('/systemApi/film/getList', { params: query })
}
export function setSeatSort(params) {
  return request.post('/systemApi/cinemaHall/setSeatSort', params)
}
export function setHallType(params) {
  return request.post('/systemApi/cinemaHall/setType', params)
}
export function getHallTypeList() {
  return request.get('/systemApi/settlementPrice/getHallTypeList', {})
}
// 影院检测
export function cinemaCheck(query) {
  return request.get('/systemApi/checkCinemaInterface/index', {
    params: query
  })
}
// 影院结算价管理
/**
 * 获取影厅列表
 * @param {*} query
 */
export function getSettlementPriceCinemaHallList(query) {
  return request.post('/systemApi/settlementPrice/getCinemaHallList', query)
}
/**
 * 新增结算价
 * @param {*} params
 */
export function createSettlementPrice(params) {
  return request.post('/systemApi/settlementPrice/create', params)
}
/**
 * 编辑结算价
 * @param {*} params
 */
export function updateSettlementPrice(params) {
  return request.post('/systemApi/settlementPrice/update', params)
}
/**
 * 获取结算价列表
 * @param {*} query
 */
export function getSettlementPageList(query) {
  return request.get('/systemApi/settlementPrice/getPageList', {
    params: query
  })
}
/**
 * 删除结算价
 * @param {*} id
 */
export function delSettlement(ids) {
  return request.post('/systemApi/settlementPrice/delete', { ids })
}
/**
 * 获取结算价详情
 * @param {*} id
 */
export function getSettlementInfo(id) {
  return request.get('/systemApi/settlementPrice/getInfo', { params: { id }})
}
/**
 * 删除结算价规则
 * @param {*} id
 */
export function deleteRule(id) {
  return request.post('/systemApi/settlementPrice/deleteRule', { id })
}
/**
 * 复制结算价规则
 * @param {*} id
 */
export function copyRule(id) {
  return request.post('/systemApi/settlementPrice/copy', { id })
}
// 平台商家管理
/**
 * 获取系统功能菜单栏（编辑平台商家中使用）
 */
export function getInterfaceActionList() {
  return request.get('/systemApi/channel/getInterfaceActionList', {})
}
/**
 * 积分平台商户版本类下拉列表
 */
export function getIntegralPlatformEditionList() {
  return request.get('/systemApi/integralPlatform/getList', {})
}
/**
 * 获取导航菜单栏（编辑平台商家中使用）
 */
export function getBottomMenuList() {
  return request.get('/systemApi/channel/getBottomMenuList', {})
}
// 获取支付方式（编辑平台商家中使用）
export function getPayTypeList() {
  return request.get('/systemApi/channel/getPayTypeList', {})
}

// 影院分组
export function cinemaGroupGetList(params) {
  return request.post('/systemApi/cinemaGroup/getPageList', params)
}
export function createCinemaGroup(params) {
  return request.post('/systemApi/cinemaGroup/create', params)
}
export function updateCinemaGroup(params) {
  return request.post('/systemApi/cinemaGroup/update', params)
}
export function getCinemaGroupInfo(query) {
  return request.get('/systemApi/cinemaGroup/getInfo', { params: query })
}
export function deleteCinemaGroup(query) {
  return request.get('/systemApi/cinemaGroup/delete', { params: query })
}
/* 获取影院分组详情影院*/
export function getCinemaGroupList(query) {
  return request.get('/systemApi/cinemaGroup/getCinemaList', { params: query })
}
/* 获取影院分组临时添加影院*/
export function saveCinemaAdd(query) {
  return request.get('/systemApi/cinemaGroup/saveCinemaAdd', { params: query })
}
/* 添加删除影院分组影院*/
export function updateCinemaAdd(params) {
  return request.post('/systemApi/cinemaGroup/updateCinemaAdd', params)
}
/* 编辑影院分组（新）*/
export function newUpdateCinema(params) {
  return request.post('/systemApi/cinemaGroup/updateCinema', params)
}
// 商家接入
export function deviceChange(params) {
  return request.post('/systemApi/consumerTerminal/getList', params)
}
// 可售渠道商管理
export function getChannelCinemaPageList(query) {
  return request.get('/systemApi/channelCinema/getPageList', { params: query })
}
export function createChannelCinema(params) {
  return request.post('/systemApi/channelCinema/create', params)
}
export function updateChannelCinema(params) {
  return request.post('/systemApi/channelCinema/update', params)
}
export function deleteChannelCinema(id) {
  return request.post('/systemApi/channelCinema/delete', { id })
}
export function getChannelCinemaInfo(id) {
  return request.get('/systemApi/channelCinema/getInfo', { params: { id }})
}

// ================排期管理=============
// 影院排期
export function getCinemaPlanPageList(query) {
  return request.get('/systemApi/cinemaPlan/getPageList', { params: query })
}
export function syncCinemaPlan(params) {
  return request.post('/systemApi/cinemaPlan/sync', params)
}
export function getSyncCinemaPlanPercent(batchNo) {
  return request.get('/systemApi/cinemaPlan/getSyncCinemaPlanPercent', {
    params: { batchNo }
  })
}
// 渠道商排期
export function getChannelPlanPageList(query) {
  return request.get('/systemApi/channelPrice/getPageList', { params: query })
}
export function syncChannelPlan(params) {
  return request.post('/systemApi/channelPrice/sync', params)
}
export function getChannelCinemaPlanPageList(query) {
  return request.get('/systemApi/channelPrice/getPlanPageList', {
    params: query
  })
}
export function updateChannelPlan(params) {
  return request.post('/systemApi/channelPrice/update', params)
}
export function modifyChannelPrice(params) {
  return request.post('/systemApi/channelPrice/modifyPlanPage', params)
}

// ====================影院影厅/排期管理============
export function getCinemaAndPlanInfo(query) {
  return request.get('/systemApi/cinema/cinemaAndPlanInfo', { params: query })
}
