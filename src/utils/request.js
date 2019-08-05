import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import { parseTime } from './index'
import router from '@/router'
import sign from './sign'
// import { resolve } from 'path'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 30000 // 请求超时时间
})
const config = (config) => {
  if (!config.params) {
    config.params = {}
  }
  if (getToken()) {
    config.params.tokenId = getToken()
  }
  config.params.requestTime = parseTime(new Date())
  config.params.account = 'zuimei'
  sign(config.params, config.data, 'verifyInfo')
  return config
}
// request拦截器
service.interceptors.request.use(config, error => {
  // console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.status !== 0) {
      // 500:非法的token;  20001:Token 过期了;
      if (res.status === 500 || res.status === 20001) {
        if (window.sessionStorage.getItem('toLogin') !== '1') {
          MessageBox.alert('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            type: 'warning',
            callback: () => {
              window.sessionStorage.setItem('toLogin', '1')
              store.dispatch('FedLogOut').then(() => {
                router.push('/login')
              })
            }
          })
        }

        /* MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            router.push('/login')
          })
        })*/
      } else if (res.status === 30001) {
        console.log(res.content)
      } else {
        // if (res.status === 1)
        Message({
          message: res.content,
          type: 'error',
          duration: 5 * 1000
        })
        setTimeout(() => {
          Loading.service().close()
        }, 100)
      }
      return Promise.reject(res)
    } else {
    // if (response.config.url.indexOf('/mock/') > 0) {
    //   return new Promise(resolve => {
    //     setTimeout(() => {
    //       resolve(res.result)
    //     }, 300)
    //   })
    // } else { return res.result }
      if (res.count !== undefined) {
        return { count: res.count, data: res.data }
      }
      return res.data
    }
  },
  error => {
    // console.log('err' + error)// for debug
    Message({
      message: error.content || '未知异常',
      type: 'error',
      duration: 5 * 1000
    })
    setTimeout(() => {
      Loading.service().close()
    }, 100)
    return Promise.reject(error)
  }
)

export default service

// ---------- 二进制下载

const blobService = axios.create({
  responseType: 'blob',
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // 请求超时时间
})
// request拦截器
blobService.interceptors.request.use(config, error => {
  // console.log(error) // for debug
  Promise.reject(error)
})
blobService.interceptors.response.use(response => {
  if (response.status === 200) { return response.data } else {
    Message({
      message: '处理失败',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject()
  }
})
export {
  blobService
}
