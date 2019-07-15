import request from '@/utils/request'
import { getUserId } from '@/utils/auth'
export function login(userName, passWord, type = 1) {
  return request.post('/systemApi/systemAccount/login', { userName, passWord, type })
}

export function getInfo() {
  return request.get('/systemApi/systemAccount/getInfo', { params: { id: getUserId() }})
}

export function logout() {
  return Promise.resolve() // request.post('/mock/logout')
}

export function getMenu() {
  return request.get('/systemApi/systemMenu/getAccountMenuTree', { params: { userId: getUserId() }})
}

