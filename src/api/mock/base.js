import Mock from 'mockjs'
import md5 from 'js-md5'
const API_BASE_URL = process.env.BASE_API
const AVATAR_IMAGE_URL = 'http://onmxkx5tf.bkt.clouddn.com/mockjs/head-pic/'
const mock = function() {
  const baseUrl = arguments[0]
  const url = new RegExp('^' + `${API_BASE_URL}${baseUrl}`)
  arguments[0] = url
  Mock.mock.apply(null, arguments)
}
mock.post = function() {
  const args = [arguments[0], 'post', arguments[1]]
  mock.apply(null, args)
}
mock.get = function() {
  const args = [arguments[0], 'get', arguments[1]]
  mock.apply(null, args)
}
function getQueryString(url, name) {
  var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(&|$)', 'i')
  var r = decodeURIComponent(url).match(reg)
  if (r != null) return unescape(r[2])
  return null
}

export const _ret = (option, data, arraySize, ok = true, count) => {
  let _data
  if (ok) {
    _data = {
      'status': 0
    }
    if (count) {
      _data.count = count
    }
    if (arraySize) {
      _data[`data|${arraySize}`] = [data]
    } else {
      _data['data'] = data
    }
  } else {
    _data = {
      'status': -1,
      // 'code': 'MOCK_ERROR',
      'content': 'mock request error'
    }
  }
  const response = Mock.mock(_data)
  console.info(`=====请求Mock接口:${decodeURIComponent(option.url)}`)
  console.info('请求返还:', response)
  return response
}

mock.ret = (data, ok = true) => {
  return option => {
    return _ret(option, data, null, ok)
  }
}

mock.retArray = (data, arraySize = 10, ok = true) => {
  return option => {
    return _ret(option, data, arraySize, ok)
  }
}

function getTotalPages(url) {
  const page = getQueryString(url, 'page')
  if (page) {
    url = url.replace('page=' + page, '')
  }
  const size = getQueryString(url, 'pageSize')
  if (size) {
    url = url.replace('pageSize=' + size, '')
  }
  return parseInt(md5(url).replace(/[a-z]/g, '').substr(0, 8)) % 100
}

mock.page = (data, ok = true) => {
  return option => {
    let page = getQueryString(option.url, 'page')
    !page && (page = 1)
    let size = getQueryString(option.url, 'pageSize')
    !size && (size = 10)

    const totalPages = getTotalPages(option.url)// Mock.Random.natural(0, 10)
    const totalElements = totalPages > 0 ? (totalPages * size - Mock.Random.natural(0, size - 2)) : 0
    const returnSize = page <= totalPages ? (page === totalPages ? (totalElements - (totalPages - 1) * size) : size) : 0
    // const _data = {
    //   // pageNo: parseInt(page), // 页码
    //   // pageSize: parseInt(size), // 每页数
    //   // pageTotal: totalPages, // 总页数
    //   count: totalElements // 总数据量
    // }
    // _data[`data|${returnSize}`] = [data]
    return _ret(option, data, returnSize, ok, totalElements)
  }
}

mock.avatar = () => {
  const picName = Mock.Random.natural(1, 60) + '.jpg'
  return `${AVATAR_IMAGE_URL}${picName}`
}
export default mock
