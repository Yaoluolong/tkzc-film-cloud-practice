import request from '@/utils/request'

// ==============平台设置========================
// 登入日志
export function getLoginLogPageList(query) {
  return request.get('/systemApi/systemAccount/getLoginLogPageList', { params: query })
}

// ===============权限管理========================
// 角色管理
export function getRolePageList(query) {
  return request.get('/systemApi/systemAccountRole/getRolePageList', { params: query })
}
export function getRoleInfo(id) {
  return request.get('/systemApi/systemAccountRole/getInfo', { params: { id }})
}
export function createRole(params) {
  return request.post('/systemApi/systemAccountRole/create', params)
}
export function updateRole(params) {
  return request.post('/systemApi/systemAccountRole/update', params)
}
export function deleteRole(id) {
  return request.post('/systemApi/systemAccountRole/delete', { id })
}
export function setRoleStatus(params) {
  return request.post('/systemApi/systemAccountRole/setStatus', params)
}

// 用户管理
export function getUserPageList(query) {
  return request.get('/systemApi/systemAccount/getPageList', { params: query })
}
export function getUserInfo(id) {
  return request.get('/systemApi/systemAccount/getInfo', { params: { id }})
}
export function getPermissionsInfo(id) {
  return request.get('/systemApi/systemAccount/getPermissionsInfo', { params: { id }})
}
export function createUser(params) {
  return request.post('/systemApi/systemAccount/create', params)
}
export function updateUser(params) {
  return request.post('/systemApi/systemAccount/update', params)
}
export function deleteUser(id) {
  return request.post('/systemApi/systemAccount/delete', { id })
}
export function resetUserPassWord(params) {
  return request.post('/systemApi/systemAccount/resetPassWord', params)
}
export function updateUserPermission(params) {
  return request.post('/systemApi/systemAccount/updatePermission', params)
}
export function clearCache(params) {
  return request.post('/systemApi/systemAccount/clearCache', params)
}
export function getUserListForPage(params) {
  return request.post('/systemApi/systemAccount/getListForPage', params)
}
export function getCouponOrderListForPage(params) {
  return request.post('/systemApi/couponOrder/getListForPage', params)
}
export function updatePermissions(params) {
  return request.post('/systemApi/systemAccount/updatePermissions', params)
}
// 公司管理
/* 获取公司列表下拉数据*/
export function getCompanyList(params) {
  return request.get('/systemApi/company/getList', { params: params })
}
/* 获取公司列表分页数据*/
export function getCompanyPageList(params) {
  return request.get('/systemApi/company/getPageList', { params: params })
}
/* 添加公司*/
export function createCompany(params) {
  return request.post('/systemApi/company/create', params)
}
/* 删除公司*/
export function deleteCompany(params) {
  return request.post('/systemApi/company/delete', params)
}
/* 编辑公司*/
export function updateCompany(params) {
  return request.post('/systemApi/company/update', params)
}

// 权限菜单管理
export function getMenuListByParentId(params) {
  return request.get('/systemApi/systemMenu/getMenuListByParentId', { params: params })
}
export function getMenuListByParentIds(parentIds) {
  return request.get('/systemApi/systemMenu/getMenuListByParentIds', { params: { parentId: parentIds.join(',') }})
}
export function getMenuInfo(id) {
  return request.get('/systemApi/systemMenu/getInfo', { params: { id }})
}
export function createMenu(params) {
  return request.post('/systemApi/systemMenu/create', params)
}
export function updateMenu(params) {
  return request.post('/systemApi/systemMenu/update', params)
}
export function deleteMenu(id) {
  return request.post('/systemApi/systemMenu/delete', { id })
}
export function setMenuStatus(id, status) {
  return request.post('/systemApi/systemMenu/setStatus', { id, status })
}
export function getAccountMenuList(userId) {
  return request.get('/systemApi/systemMenu/getAccountMenuList', { params: { userId }})
}
// 操作日志
export function getOperateLogPageList(query) {
  return request.get('/systemApi/systemAccount/getOperateLogPageList', { params: query })
}
// ==============城市区域========================
/**
 * 创建地区
 * @param {*} params
 */
export function createRegion(params) {
  return request.post('/systemApi/region/create', params)
}
/**
 * 更新地区
 * @param {*} params
 */
export function updateRegion(params) {
  return request.post('/systemApi/region/update', params)
}
/**
 * 地区列表
 * @param {*} query
 */
export function getRegionList(query) {
  return request.get('/systemApi/region/getList', { params: query })
}
/**
 * 删除地区
 * @param {*} param
 */
export function deleteRegion(ids) {
  return request.post('/systemApi/region/delete', { ids })
}
// ==============商户调试管理========================
/**
 * 获取商户调试列表
 * @param {*} ids
 */
export function getDebugPageList() {
  return request.get('/systemApi/channel/getDebugPageList', { params: {}})
}
// ==============支付参数管理========================
export function savePayConfig(param) {
  return request.post('/systemApi/payConfig/save', param)
}
/**
 * 获取支付信息
 * @param {*} param
 */
export function getPayConfig(id) {
  return request.get('/systemApi/payConfig/getInfo', { params: { id }})
}
/**
 *  获取模板消息字段
 * @param {*} type
 */
export function getWechatTemplateField(templateId) {
  return request.get('/systemApi/payConfig/getWechatTemplateField', { params: { templateId }})
}
/**
 * 输出变量
 * @param {*} type
 */
export function getSelfWechatField(type) {
  return request.get('/systemApi/payConfig/getSelfWechatField', { params: { type }})
}
// ==============积分平台商家管理========================
/**
 * 获取积分平台商户列表
 * @param {*} query
 */
export function getIntegralPlatformPage(query) {
  return request.get('/systemApi/integralPlatform/getPageList', { params: query })
}
/**
 * 新增积分平台商家
 * @param {*} query
 */
export function createIntegralPlatform(params) {
  return request.post('/systemApi/integralPlatform/create', params)
}
/**
 * 编辑积分平台商家
 * @param {*} query
 */
export function updateIntegralPlatform(params) {
  return request.post('systemApi/integralPlatform/update', params)
}
/**
 * 获取详情
 * @param {*} query
 */
export function getIntegralPlatform(id) {
  return request.get('/systemApi/integralPlatform/getInfo', { params: { id }})
}
/**
 * 删除积分平台
 * @param {*} id
 */
export function delIntegralPlatform(ids) {
  return request.post('/systemApi/integralPlatform/delete', { ids })
}
export function setStatusIntegralPlatform(id, status) {
  return request.post('/systemApi/integralPlatform/setStatus', { id, status })
}

// ==============获取终端列表========================
/**
 * 获取终端列表
 * @param {*} query
 */
export function getConsumerTerminalPage(query) {
  return request.get('/systemApi/consumerTerminal/getPageList', { params: query })
}
/**
 * 新增消费终端
 * @param {*} query
 */
export function createConsumerTerminalPage(params) {
  return request.post('/systemApi/consumerTerminal/create', params)
}
/**
 * 删除消费终端
 * @param {*} ids
 */
export function deleteConsumerTerminal(ids) {
  return request.post('/systemApi/consumerTerminal/delete', { ids })
}
/**
 * 编辑消费终端
 * @param {*} query
 */
export function updateConsumerTerminalPage(params) {
  return request.post('/systemApi/consumerTerminal/update', params)
}

// ===============短信列表========================
/**
 * 保存短信信息
 * @param {*} params
 */
/* export function saveSms(params) {
  return request.post('/systemApi/sms/save', params)
}*/
/**
 * 获取短信信息
 */
export function getSmsPageList(query) {
  return request.get('/systemApi/sms/getPageList', { params: query })
}
export function getSmsInfo(id) {
  return request.get('/systemApi/sms/getInfo', { params: { id }})
}
export function createSms(params) {
  return request.post('/systemApi/sms/create', params)
}
export function updateSms(params) {
  return request.post('/systemApi/sms/update', params)
}
export function deleteSms(id) {
  return request.post('/systemApi/sms/delete', { id })
}
export function setStatusSms(id) {
  return request.post('/systemApi/sms/setStatus', { id })
}
/**
 * 获取短信模板
 */
export function getSmsTemplatePageList(query) {
  return request.get('/systemApi/smsTemplate/getPageList', { params: query })
}
export function getTemplateNameList(query) {
  return request.get('/systemApi/smsTemplate/getTemplateNameList', { params: query })
}
export function getTemplateParamList(query) {
  return request.get('systemApi/smsTemplate/getTemplateParamList', { params: query })
}
export function getSmsTemplateInfo(id) {
  return request.get('/systemApi/smsTemplate/getInfo', { params: { id }})
}
export function createSmsTemplate(params) {
  return request.post('/systemApi/smsTemplate/create', params)
}
export function updateSmsTemplate(params) {
  return request.post('/systemApi/smsTemplate/update', params)
}
export function deleteSmsTemplate(id) {
  return request.post('/systemApi/smsTemplate/delete', { id })
}
export function setStatusSmsTemplate(id) {
  return request.post('/systemApi/smsTemplate/setStatus', { id })
}

// ===============影院========================
export function getCinemaList(params) {
  return request.post('/systemApi/cinema/getList', params)
}
export function getCinemaListForPage(query) {
  return request.get('/systemApi/cinema/getListForPage', { params: query })
}
export function getListForCinemaPage(params) {
  return request.post('/systemApi/cinema/getListForCinemaPage', params)
}
export function syncWechatTemplate() {
  return request.get('/systemApi/payConfig/syncWechatTemplate', {})
}

// ============== 任务管理 ===================
export function getTaskMgrList(params) {
  return request.post('/systemApi/exportTask/getPageList', params)
}
export function exportTaskMgr(params) {
  return request.post('/systemApi/exportTask/download', params)
}

// ============== 审批权限管理 ================
export function getApprovalPageList(params) {
  return request.post('/systemApi/approval/getPageList', params)
}
export function getApprovalTypeList(params) {
  return request.post('/systemApi/dict/getList', params)
}
export function createApprovalType(params) {
  return request.post('/systemApi/approval/create', params)
}
export function getApprovalInfo(params) {
  return request.post('/systemApi/approval/getInfo', params)
}
export function delApprovalInfo(params) {
  return request.post('/systemApi/approval/delete', params)
}
export function getApprovalInfoComplete(params) {
  return request.post('/systemApi/approval/getInfoComplete', params)
}

// 支付列表
export function getPayConfigList(params) {
  return request.post('/systemApi/payConfig/getPageList', params)
}
export function deletePayConfig(params) {
  return request.post('/systemApi/payConfig/delete', params)
}
