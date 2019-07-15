import request from '@/utils/request'
// ============== 活动管理 ================
export function getActivityList(params) {
  return request.post('/activity/dashboard/getActivityList', params)
}
export function editActivity(params) {
  return request.post('/activity/dashboard/editActivity', params)
}
export function setActivityOffLine(params) {
  return request.post('/activity/dashboard/setActivityOffLine', params)
}
export function getActivityById(params) {
  return request.post('/activity/dashboard/getActivityById', params)
}
export function delActivityById(params) {
  return request.post('/activity/dashboard/delActivityById', params)
}
export function editActivitySettings(params) {
  return request.post('/activity/dashboard/editActivitySettings', params)
}
export function getActivityOrderList(params) {
  return request.post('/activity/order/getOrderList', params)
}
export function getActivityApprovalList(params) {
  return request.post('/activity/workflow/getTodoList', params)
}

export function getInfoById(params) {
  return request.post('/activity/workflow/getInfoById', params)
}
export function processById(params) {
  return request.post('/activity/workflow/processById', params)
}
export function getOrderById(params) {
  return request.post('/activity/order/getOrderById', params)
}
export function refundOrder(params) {
  return request.post('/activity/order/refundOrder', params)
}
export function exportTaskStauts(params) {
  return request.post('/activity/utils/taskStatus', params)
}
export function activitySubmitById(params) {
  return request.post('/activity/workflow/submitById', params)
}

// ======================营销活动
export function getActivityPageList(params) {
  return request.post('/systemApi/activity/getPageList', params)
}
export function createActivity(params) {
  return request.post('/systemApi/activity/create', params)
}
export function updateActivity(params) {
  return request.post('/systemApi/activity/update', params)
}
export function deleteActivity(params) {
  return request.post('/systemApi/activity/delete', params)
}
export function getActivityCompleteInfo(params) {
  return request.post('/systemApi/activity/getCompleteInfo', params)
}
export function getActivityInfo(params) {
  return request.post('/systemApi/activity/getInfo', params)
}
export function getActivityOrderInfo(params) {
  return request.post('/systemApi/activityOrder/getInfo', params)
}
export function getActivityOrderPageList(params) {
  return request.post('/systemApi/activityOrder/getPageList', params)
}
export function activityExampleDownload(params) {
  return request.post('/systemApi/activity/download', params)
}
export function activityCreateUrl(params) {
  return request.post('/systemApi/activity/createUrl', params)
}
export function activitySetTop(params) {
  return request.post('/systemApi/activity/setTop', params)
}
export function activitySetStop(params) {
  return request.post('/systemApi/activity/setStop', params)
}
export function activitySetDown(params) {
  return request.post('/systemApi/activity/setDown', params)
}
export function activitySetApprovalStatus(params) {
  return request.post('/systemApi/activity/setApprovalStatus', params)
}
export function getActivityOrderExport(params) {
  return request.post('/systemApi/activityOrder/getActivityExport', params)
}
export function checkActivity(params) {
  return request.post('/systemApi/activity/checkActivity', params)
}
export function getCheckPageList(params) {
  return request.post('/systemApi/activity/getCheckPageList', params)
}
export function getActivityFilmList(params) {
  return request.post('/systemApi/film/getActivityFilmList', params)
}
export function activitySetBack(params) {
  return request.post('/systemApi/activity/setBack', params)
}

export function getActivityPayConfig(params) {
  return request.post('systemApi/activityWarnAccount/getActivityPayConfig', params)
}
export function addActivityFee(params) {
  return request.post('systemApi/activityWarnAccount/addActivityFee', params)
}

// 支付列表
export function saveActivityPayConfig(param) {
  return request.post('/systemApi/activityPayConfig/save', param)
}
export function getActivityPayConfigList(params) {
  return request.post('/systemApi/activityPayConfig/getPageList', params)
}
export function deleteActivityPayConfig(params) {
  return request.post('/systemApi/activityPayConfig/delete', params)
}
export function getPayConfig(id) {
  return request.get('/systemApi/activityPayConfig/getInfo', { params: { id }})
}

// 活动预警

export function activityWarnList(param) {
  return request.post('/systemApi/activityWarn/getPageList', param)
}
export function activityWarnInfo(param) {
  return request.post('/systemApi/activityWarn/getInfo', param)
}
export function activityWarnUpdate(param) {
  return request.post('/systemApi/activityWarn/update', param)
}
export function activitySetWarnStatus(param) {
  return request.post('/systemApi/activityWarn/setWarnStatus', param)
}

// 对账

export function activityWarnAccountList(param) {
  return request.post('/systemApi/activityWarnAccount/getPageList', param)
}
export function activityWarnAccountGetInfo(param) {
  return request.post('/systemApi/activityWarnAccount/getInfo', param)
}
export function activityWarnAccountCheckAccount(param) {
  return request.post('/systemApi/activityWarnAccount/checkAccount', param)
}
export function activityWarnAccountCheckWarnAccount(param) {
  return request.post('/systemApi/activityWarnAccount/checkWarnAccount', param)
}
export function activityWarnAccountSendAccount(query) {
  return request.get('/systemApi/activityWarnAccount/sendAccount', { params: query })
}

export function activityWarnAccountGetDetailList(query) {
  return request.get('/systemApi/activityWarnAccount/getDetailList', { params: query })
}
