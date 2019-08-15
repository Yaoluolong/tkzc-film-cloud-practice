import request from '@/utils/request'

export function getPageList(query) {
  return request.get('/systemApi/systemMessage/getPageList', { params: query })
}
export function read(params) {
  return request.post('/systemApi/systemMessage/read', params)
}
