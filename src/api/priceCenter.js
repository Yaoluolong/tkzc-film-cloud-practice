import request from '@/utils/request'

// ==============价格中心========================
// 登入日志
export function getLoginLogPageList(query) {
  return request.get('/mock/getLoginLogPageList', { params: query })
}
// 根据策略组ID获取影院
export function getCinemaById(query) {
  return request.get('/systemApi/cinemaPriceGroup/getCinemaById', { params: query })
}
// 获取归属影院策略组
export function getPriceGroupList(query) {
  return request.get('/systemApi/cinemaPriceGroup/getList', { params: query })
}

// 影院策略分组
export function getPriceGroupPageList(query) {
  return request.get('/systemApi/cinemaPriceGroup/getPageList', { params: query })
}
export function createPriceGroup(params) {
  return request.post('/systemApi/cinemaPriceGroup/create', params)
}
export function getPriceGroupInfo(id) {
  return request.get('/systemApi/cinemaPriceGroup/getInfo', { params: { id }})
}
export function updatePriceGroup(params) {
  return request.post('/systemApi/cinemaPriceGroup/update', params)
}
export function deletePriceGroup(id) {
  return request.post('/systemApi/cinemaPriceGroup/delete', { id })
}

// 常规、活动价格方案列表
export function getPriceProgramPageList(query) {
  return request.get('/systemApi/priceProgram/getPageList', { params: query })
}
export function createPriceProgram(params) {
  return request.post('/systemApi/priceProgram/create', params)
}
export function updatePriceProgram(params) {
  return request.post('/systemApi/priceProgram/update', params)
}
export function deletePriceProgram(id) {
  return request.post('/systemApi/priceProgram/delete', { id })
}
export function setPriceProgramStatus(params) {
  return request.post('/systemApi/priceProgram/setStatus', params)
}
export function getPriceProgramInfo(id, programType = 1) {
  return request.get('/systemApi/priceProgram/getInfo', { params: { id, programType }})
}
export function reviewPriceProgram(id) {
  return request.get('/systemApi/priceProgram/review', { params: { id }})
}
// 商家特殊服务费管理
/**
 * 影片列表
 * @param {*} query
 */
export function getFilmIdList(query) {
  return request.get('/systemApi/film/getFilmIdList', { params: query })
}
/**
 * 特殊服务费获取支付方式
 */
export function getPayTypeList() {
  return request.get('/systemApi/channelSpecialServicePrice/getPayTypeList', {})
}
/**
 * 新增商家特殊服务费
 * @param {*} params
 */
export function createSpecialServicePrice(params) {
  return request.post('/systemApi/channelSpecialServicePrice/create', params)
}
/**
 * 更新商家特殊服务费
 * @param {*} params
 */
export function updateSpecialServicePrice(params) {
  return request.post('/systemApi/channelSpecialServicePrice/update', params)
}
/**
 * 商家特殊服务费列表
 * @param {*} query
 */
export function getChannelSpecialServicePricePageList(query) {
  return request.get('/systemApi/channelSpecialServicePrice/getPageList', { params: query })
}
/**
 * 获取商家特殊服务费详情
 * @param {*} query
 */
export function getChannelSpecialServicePriceInfo(id) {
  return request.get('/systemApi/channelSpecialServicePrice/getInfo', { params: { id }})
}
/**
 * 删除特殊结算价
 * @param {*} ids
 */
export function delSpecialServicePrice(ids) {
  return request.post('/systemApi/channelSpecialServicePrice/delete', { ids })
}
// 排期价格调价列表
export function getPriceModifyPageList(query) {
  return request.get('/systemApi/priceModify/getPageList', { params: query })
}
export function createPriceModify(params) {
  return request.post('/systemApi/priceModify/create', params)
}
export function updatePriceModify(params) {
  return request.post('/systemApi/priceModify/update', params)
}
export function getPriceModifyInfo(id) {
  return request.get('/systemApi/priceModify/getInfo', { params: { id }})
}
export function deletePriceModify(id) {
  return request.post('/systemApi/priceModify/delete', { id })
}

// 获取智能定价方案列表
export function getAutoPricePageList(params) {
  return request.post('/systemApi/autoPriceProgram/getPageList', params)
}
// 开启关闭方案
export function setAutoPriceStatus(params) {
  return request.post('/systemApi/autoPriceProgram/setStatus', params)
}
// 创建智能定价方案
export function createAutoPrice(params) {
  return request.post('/systemApi/autoPriceProgram/create', params)
}
// 编辑智能定价方案
export function updateAutoPrice(params) {
  return request.post('/systemApi/autoPriceProgram/update', params)
}
// 获取智能定价方案详情
export function getAutoPriceInfo(params) {
  return request.post('/systemApi/autoPriceProgram/getInfo', params)
}
