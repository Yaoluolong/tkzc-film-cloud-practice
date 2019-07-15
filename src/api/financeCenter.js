import request from '@/utils/request'

// 获取消费终端支付方式订单状态字典
export function getDictList(query) {
  return request.get('/systemApi/order/getDictList', { params: query })
}
// ==============财务报表========================
// 票务订单
export function getOrderPageList(query) {
  return request.get('/systemApi/order/getPageList', { params: query })
}
export function getOrderStatus(params) {
  return request.post('/systemApi/order/getOrderStatus', params)
}
export function getOrderInfo(orderId) {
  return request.get('/systemApi/order/getInfo', { params: { orderId }})
}
export function backOrder(params) {
  return request.post('/systemApi/order/backTicketAndMoney', params)
}
// 电影券订单
export function getCouponOrderPageList(params) {
  return request.post('/systemApi/finance/getCouponOrderPageList', params)
}
export function getCouponOrderInfo(params) {
  return request.post('/systemApi/finance/getCouponOrderInfo', params)
}
export function getCouponOrderDetailList(query) {
  return request.get('/systemApi/finance/getCouponOrderDetailList', { params: query })
}
export function exportCouponOrder(params) {
  return request.post('/systemApi/finance/exportCouponOrder', params)
}
export function exportCouponOrderDetail(params) {
  return request.post('/systemApi/finance/exportCouponOrderDetail', params)
}
// 电影卡订单
export function getCardOrderPageList(params) {
  return request.post('/systemApi/finance/getCardOrderPageList', params)
}
export function getCardOrderInfo(params) {
  return request.post('/systemApi/finance/getCardOrderInfo', params)
}
export function getCardOrderDetailList(query) {
  return request.get('/systemApi/finance/getCardOrderDetailList', { params: query })
}
export function exportCardOrder(params) {
  return request.post('/systemApi/finance/exportCardOrder', params)
}
export function exportCardOrderDetail(params) {
  return request.post('/systemApi/finance/exportCardOrderDetail', params)
}

// 电影卡充值订单
export function getCardRechargeOrderPageList(params) {
  return request.post('/systemApi/orderCardRecharge/getPageList', params)
}
export function getCardRechargeOrderInfo(query) {
  return request.get('/systemApi/orderCardRecharge/getInfo', { params: query })
}
export function getCardRechargeBatchOrderStatus(params) {
  return request.post('/systemApi/orderCardRecharge/batchSyncOrderStatus', params)
}
export function getSyncOrderCardRechargeStatus(query) {
  return request.get('/systemApi/orderCardRecharge/syncOrderStatus', { params: query })
}
export function exportOrderRechargeData(params) {
  return request.post('/systemApi/orderCardRecharge/exportCardRechargeOrder', params)
}
// 电影券使用明细

export function getSaleCouponDetailList(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderList', params)
}
export function getSaleCouponDetail(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderInfo', params)
}
export function saleCouponSetTag(params) {
  return request.post('/systemApi/couponOrder/setTag', params)
}
export function getSaleCouponOrderDetailList(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderDetailList', params)
}
export function getSaleCouponDetailListExport(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderListExport', params)
}
export function getSaleCouponOrderDetailListExport(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderDetailListExport', params)
}
export function getCouponOrderUnUseExport(params) {
  return request.post('/systemApi/couponOrder/getCouponOrderUnUseExport', params)
}
