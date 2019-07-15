import request from '@/utils/request'

// ==============会员管理========================
// 会员列表
export function getMemberPageList(query) {
  return request.get('/systemApi/member/getPageList', { params: query })
}
export function getMemberOrderPageList(query) {
  return request.get('/systemApi/member/getMemberOrderList', { params: query })
}
export function getMemberInfo(id) {
  return request.get('/systemApi/member/getInfo', { params: { id }})
}
export function updateMember(params) {
  return request.post('/systemApi/member/update', params)
}
// ==============广告管理========================
export function getBannerType() {
  return request.get('/systemApi/dict/getList', { params: { type: 'bannerType' }})
}
export function createBanner(params) {
  return request.post('/systemApi/channelBanner/create', params)
}
export function updateBanner(params) {
  return request.post('/systemApi/channelBanner/update', params)
}
export function channelBannerPageList(query) {
  return request.get('/systemApi/channelBanner/getPageList', { params: query })
}
export function delChannelBanner(ids) {
  return request.post('/systemApi/channelBanner/delete', { ids })
}
export function getBannerInfo(id) {
  return request.get('/systemApi/channelBanner/getInfo', { params: { id }})
}
// =================电影券管理==================
// 电影券品类
export function getCouponTypePageList(params) {
  return request.post('/systemApi/couponType/getPageList', params)
}
export function getCouponTypeInfo(id) {
  return request.get('/systemApi/couponType/getInfo', { params: { id }})
}
export function updateCouponType(params) {
  return request.post('/systemApi/couponType/update', params)
}
export function createCouponType(params) {
  return request.post('/systemApi/couponType/create', params)
}
export function deleteCouponType(ids) {
  return request.post('/systemApi/couponType/delete', { ids })
}
// 获取券申请列表
export function getCouponApplyPageList(params) {
  return request.get('/systemApi/resellerCouponApplication/getPageList', { params: params })
}
// 获取券申请详情
export function getCouponApplyInfo(params) {
  return request.get('/systemApi/resellerCouponApplication/getInfo', { params: params })
}
// 处理券申请
export function setApprovalStatus(params) {
  return request.post('/systemApi/resellerCouponApplication/setApprovalStatus', params)
}

// 未销售券库
export function getUnsoldOrderPageList(query) {
  return request.get('/systemApi/coupon/getOrderPageList', { params: query })
}
export function createUnsoldOrder(params) {
  return request.post('/systemApi/coupon/create', params)
}
export function countUnsoldCouponPercent(params) {
  return request.get('/systemApi/coupon/countCouponPercent', { params: params })
}
export function getUnsoldOrderList(params) {
  return request.get('/systemApi/coupon/getPageList', { params: params })
}
export function exportCouponDetail(params) {
  return request.get('/systemApi/coupon/exportCouponDetail', { params: params })
}
export function getCouponNameList(params) {
  return request.get('/systemApi/couponType/getList', { params: params })
}
export function createCouponName(params) {
  return request.get('/systemApi/couponType/create', { params: params })
}
export function getUnsoldExportCouponField() {
  return request.post('/systemApi/dict/getList', { 'type': 'exportCouponField' })
}
// 销售电影券 by lgl

export function checkCouponCodeId(params) {
  return request.post('/systemApi/couponOrder/checkCodeId', params)
}
export function CouponCodeSubmitCheck(query) {
  return request.get('/systemApi/couponOrder/submitCheck', { params: query })
}
export function GetSaleCouponDetail(query) {
  return request.get('/systemApi/couponOrder/getSaleCouponList', { params: query })
}
export function GetSoldCouponCheckInfo(params) {
  return request.post('/systemApi/couponOrder/getCheckInfo', params)
}
export function cancelSoldCouponOrder(query) {
  return request.get('/systemApi/couponOrder/cancelOrder', { params: query })
}
export function checkAuthority(params) {
  return request.post('/systemApi/couponOrder/checkAuthority', params)
}
export function couponOrderExportCouponDetail(query) {
  return request.get('/systemApi/couponOrder/exportCouponDetail', { params: query })
}

// 已售电影券总表 by lgl
export function getSoldCouponList(query) {
  return request.get('/systemApi/coupon/getSaleCouponList', { params: query })
}
export function getSoldCouponInfo(query) {
  return request.get('/systemApi/coupon/getCouponInfo', { params: query })
}
export function exportSaleCouponList(params) {
  return request.post('/systemApi/coupon/exportSaleCouponList', params)
}
export function getSaleCouponCount(params) {
  return request.post('/systemApi/coupon/getSaleCouponCount', params)
}
export function setdelaysCoupon(params) {
  return request.post('/systemApi/coupon/delaysCoupon', params)
}
// 审核销售订单
export function getCouponCheckPageList(query) {
  return request.get('/systemApi/couponOrder/getCheckPageList', { params: query })
}
export function couponcheckOrder(query) {
  return request.get('/systemApi/couponOrder/checkOrder', { params: query })
}
// 销售电影券
export function getCouponOrderPageList(query) {
  return request.get('/systemApi/couponOrder/getPageList', { params: query })
}
export function getCouponTypeList(query) {
  return request.get('/systemApi/couponType/getList', { params: query })
}
export function createCouponOrder(params) {
  return request.post('/systemApi/couponOrder/create', params)
}
export function updateCouponOrder(params) {
  return request.post('/systemApi/couponOrder/update', params)
}
export function countCouponPercent(params) {
  return request.get('/systemApi/couponOrder/countCouponPercent', { params: params })
}
export function getCouponOrderInfo(orderNo) {
  return request.get('/systemApi/couponOrder/getInfo', { params: { orderNo }})
}
export function setCouponOrderActive(params) {
  return request.post('/systemApi/couponOrder/setActive', params)
}
export function couponOrdersaleDetail(params) {
  return request.get('/systemApi/couponOrder/saleDetail', { params: params })
}
export function exportCouponSaleDetail(params) {
  return request.get('systemApi/couponOrder/exportSaleDetail', { params: params })
}
export function cancelCouponOrder(orderNo) {
  return request.post('/systemApi/couponOrder/cancel', { orderNo })
}
// 电影券列表
export function getCouponList(params) {
  return request.get('/systemApi/couponOrder/getCouponList', { params: params })
}
export function exportCouponList(params) {
  return request.get('systemApi/couponOrder/exportCouponList', { params: params })
}

export function setCouponVoid(params) {
  return request.post('systemApi/coupon/setVoid', params)
}
export function setCouponFrozen(params) {
  return request.post('systemApi/coupon/setFrozen', params)
}
export function getCouponInfo(id) {
  return request.get('/systemApi/couponOrder/getCouponInfo', { params: { id }})
}

// 电影券线上使用方案
export function getCouponProgramPageList(params) {
  return request.get('/systemApi/couponProgram/getPageList', { params })
}
export function getCouponProgramInfo(id) {
  return request.get('/systemApi/couponProgram/getInfo', { params: { id }})
}
export function updateCouponProgram(params) {
  return request.post('/systemApi/couponProgram/update', params)
}
export function createCouponProgram(params) {
  return request.post('/systemApi/couponProgram/create', params)
}
export function deleteCouponProgram(id) {
  return request.post('/systemApi/couponProgram/delete', { id })
}
// ==============卡品类========================
/* 未销售卡库 start */
export function getUnsoldCardOrderPageList(query) {
  return request.get('/systemApi/card/getOrderPageList', { params: query })
}
export function createCadeUnsoldOrder(params) {
  return request.post('/systemApi/card/create', params)
}
export function countUnsoldCardPercent(params) {
  return request.get('/systemApi/card/countCardPercent', { params: params })
}
export function getUnsoldCardOrderList(query) {
  return request.get('/systemApi/card/getPageList', { params: query })
}
export function exportCardDetail(params) {
  return request.get('/systemApi/card/exportCardDetail', { params: params })
}
export function getUnsoldExportCardField() {
  return request.post('/systemApi/dict/getList', { 'type': 'exportCardField' })
}
/* end */

/* 销售电影卡 by lgl start */

export function checkCardCodeId(params) {
  return request.post('/systemApi/cardOrder/checkCodeId', params)
}
export function CardCodeSubmitCheck(query) {
  return request.get('/systemApi/cardOrder/submitCheck', { params: query })
}
export function GetSaleCardDetail(query) {
  return request.get('/systemApi/cardOrder/getSaleCardList', { params: query })
}
export function GetSoldCardCheckInfo(params) {
  return request.post('/systemApi/cardOrder/getCheckInfo', params)
}
export function cancelSoldCardOrder(query) {
  return request.get('/systemApi/cardOrder/cancelOrder', { params: query })
}
export function checkCardAuthority(params) {
  return request.post('/systemApi/cardOrder/checkAuthority', params)
}

/* 销售电影券 by lgl end */

/* 销售电影卡 */

export function getCardOrderPageList(query) {
  return request.get('/systemApi/cardOrder/getPageList', { params: query })
}
// export function getCardTypeList(query) {
//   return request.get('/systemApi/cardType/getList', { params: query })
// }
// export function createCardOrder(params) {
//   return request.post('/systemApi/cardOrder/create', params)
// }

export function updateCardOrder(params) {
  return request.post('/systemApi/cardOrder/update', params)
}
// export function countCardPercent(params) {
//   return request.get('/systemApi/cardOrder/countCardPercent', { params: params })
// }
// export function getCardOrderInfo(orderNo) {
//   return request.get('/systemApi/couponOrder/getInfo', { params: { orderNo } })
// }
// export function setCardOrderActive(params) {
//   return request.post('/systemApi/couponOrder/setActive', params)
// }
// export function cardOrdersaleDetail(params) {
//   return request.get('/systemApi/couponOrder/saleDetail', { params: params })
// }
export function exportCardSaleDetail(params) {
  return request.get('systemApi/cardOrder/exportSaleDetail', { params: params })
}
// export function cancelCouponOrder(orderNo) {
//   return request.post('/systemApi/couponOrder/cancel', { orderNo })
// }
// 审核初审 查看更多
export function getCouponFirstCheckList(params) {
  return request.get('systemApi/couponOrder/getFirstCheckList', { params: params })
}
/* 销售电影券 end */

/* 审核销售订单 strat */
export function getCardCheckPageList(query) {
  return request.get('/systemApi/cardOrder/getCheckPageList', { params: query })
}
export function cardcheckOrder(query) {
  return request.get('/systemApi/cardOrder/checkOrder', { params: query })
}
/* 审核销售订单 end */

export function getVarietyTypeList(query) {
  return request.get('/systemApi/cardType/getVarietyTypeList', { params: query })
}
export function createCardType(params) {
  return request.post('/systemApi/cardType/create', params)
}
export function cardTypePageList(query) {
  return request.get('/systemApi/cardType/getPageList', { params: query })
}
export function getCardTypeInfo(id) {
  return request.get('/systemApi/cardType/getInfo', { params: { id }})
}
export function updateCardType(params) {
  return request.post('/systemApi/cardType/update', params)
}
export function delCardType(ids) {
  return request.post('/systemApi/cardType/delete', { ids })
}
// ==============销售卡========================
export function cardOrderPageList(query) {
  return request.get('/systemApi/cardOrder/getPageList', { params: query })
}
// 获取发票类型
export function getInvoiceTypeList() {
  return request.get('/systemApi/dict/getList', { params: { type: 'invoiceType' }})
}
// 新增客户
export function createCustomer(params) {
  return request.post('/systemApi/customer/create', params)
}
// 获取客户列表
export function getCustomerList(query) {
  return request.get('/systemApi/customer/getList', { params: query })
}
// 获取卡类型下拉列表
export function getCardTypeList(query) {
  return request.get('/systemApi/cardType/getList', { params: query })
}
// 生成卡订单
export function createCardOrder(params) {
  return request.post('/systemApi/cardOrder/create', params)
}
// 撤销订单
export function cancelCardOrder(orderNo) {
  return request.post('/systemApi/cardOrder/cancel', { orderNo })
}

// 查看发卡进度
export function countCardPercent(params) {
  return request.get('/systemApi/cardOrder/countCardPercent', { params: params })
}
// 审核初审 查看更多
export function getCardFirstCheckList(params) {
  return request.get('systemApi/cardOrder/getFirstCheckList', { params: params })
}
// 获取卡订单详情(销售登记)
export function getCardOrderInfo(orderNo) {
  return request.get('/systemApi/cardOrder/getInfo', { params: { orderNo }})
}
// 卡订单开票
export function drawCardInvoice(params) {
  return request.post('/systemApi/cardOrder/drawInvoice', params)
}
// 券订单开票
export function drawCouponInvoice(params) {
  return request.post('/systemApi/couponOrder/drawInvoice', params)
}
// 卡订单确认收款
export function makeCardCollection(params) {
  return request.post('/systemApi/cardOrder/makeCollection', params)
}
// 券订单确认收款
export function makeCouponCollection(params) {
  return request.post('/systemApi/couponOrder/makeCollection', params)
}
// 开卡
export function setCardOrderActive(params) {
  return request.post('/systemApi/cardOrder/setActive', params)
}
// 卡详情
export function cardOrdersaleDetail(params) {
  return request.get('/systemApi/cardOrder/saleDetail', { params: params })
}
// 已销售电影卡总表
export function getCardList(params) {
  return request.get('/systemApi/card/getSaleCardList', { params: params })
}
export function getMemberList(params) {
  return request.get('/systemApi/systemAccount/getList', { params: params })
}
/* // 获取卡详情
export function getSoldCardInfo(id) {
  return request.get('/systemApi/cardOrder/getCardInfo', { params: { id }})
}*/
// 导出卡
/* export function exportSaleCardList(params) {
  return request.get('systemApi/card/exportSaleCardList', { params: params })
}*/
// 导出卡订单销售明细
export function exportSaleDetail(params) {
  return request.get('systemApi/cardOrder/exportSaleDetail', { params: params })
}
// 作废卡
export function setCardVoid(params) {
  return request.post('systemApi/card/setVoid', params)
}
// 冻结卡
export function setCardFrozen(params) {
  return request.post('systemApi/card/setFrozen', params)
}
// 延期卡
export function setdelaysCard(params) {
  return request.post('/systemApi/card/delaysCard', params)
}
// 获取卡数量
export function getSaleCardCount(params) {
  return request.post('/systemApi/card/getSaleCardCount', params)
}
// 已销售电影卡总表--明细
export function getSoldCardInfo(params) {
  return request.post('/systemApi/card/getCardInfo', params)
}
export function exportCardList(params) {
  return request.get('systemApi/card/exportSaleCardList', { params: params })
}

/**
 * 电影卡充值规则
 */
export function getCardRechargeList(params) {
  return request.post('/systemApi/cardRechargeProgram/getPageList', params)
}
export function createCardRecharge(params) {
  return request.post('/systemApi/cardRechargeProgram/create', params)
}
export function updateCardRecharge(params) {
  return request.post('/systemApi/cardRechargeProgram/update', params)
}
export function setCardRechargeStatus(query) {
  return request.get('/systemApi/cardRechargeProgram/setStatus', { params: query })
}
export function deleteCardRecharge(query) {
  return request.get('/systemApi/cardRechargeProgram/delete', { params: query })
}
export function getCardRechargeInfo(query) {
  return request.get('/systemApi/cardRechargeProgram/getInfo', { params: query })
}
/**
 * 平台交易预警管理
 */
// 预警管理
export function getPlatformWarnPageList(params) {
  return request.post('/systemApi/platformWarn/getPageList', params)
}
export function getSmsTemplateInfo(query) {
  return request.get('/systemApi/platformWarn/getInfo', { params: query })
}
export function smsTemplateGetList(params) {
  return request.post('/systemApi/smsTemplate/getList', params)
}
export function smsTemplateSetWarning(params) {
  return request.post('/systemApi/platformWarn/setWarning', params)
}
export function setPlatformWarnStatus(query) {
  return request.get('/systemApi/platformWarn/setStatus', { params: query })
}
// 交易对账
export function getCheckAccountPageList(params) {
  return request.post('/systemApi/platformWarn/getCheckAccountPageList', params)
}
// 未生效---确认对账
export function checkPrePayAmount(params) {
  return request.post('/systemApi/platformWarn/checkPrePayAmount', params)
}
// 触警--获取商家平台交易预警触警详情
export function getplatformWarnWarnInfo(query) {
  return request.get('/systemApi/platformWarn/getWarnInfo', { params: query })
}
// 触警--平台商家交易预警触警对账
export function platformWarnCheckAccount(query) {
  return request.get('/systemApi/platformWarn/checkAccount', { params: query })
}
// 触警--平台商家交易预警查看对账
export function platformWarnAccountDetail(query) {
  return request.get('/systemApi/platformWarn/getAccountDetail', { params: query })
}

// 平台商家交易预警查看对账
export function checkPlatformWarnAuthority(params) {
  return request.post('/systemApi/platformWarn/checkAuthority', params)
}
