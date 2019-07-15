
import md5 from 'js-md5'
import sha1 from './sha1'

export default function(OrginParams, OrginBody, signKey) {
  clearEmtpyField(OrginBody)
  clearEmtpyField(OrginParams)
  const params = Object.assign(Object.assign({}, OrginParams), OrginBody)
  const signStr = Object.keys(params).sort().map(key => {
    const value = params[key]
    if (key !== signKey) {
      if (!Array.isArray(value) && !isJson(value)) {
        if (value !== undefined) {
          if (value === null || value === '') {
            return key
          } else {
            return key + value
          }
        }
      } else {
        if (JSON.stringify(value) !== '{}' || value.length > 0) {
          return key + JSON.stringify(value)
        } else {
          return key
        }
      }
    }
    return ''
  }).join('')
  // console.log('signStr', signStr)
  // 生产
  const psw = 'asdklfjdlskd'
  // 预生产
  // const psw = '123456'
  const sign = md5(sha1.hexSha1(utf16to8(signStr + psw))).toLocaleLowerCase().substring(8, 24)
  // console.log('sign', sign)

  OrginParams[signKey] = sign
}
// 清除对象空的属性
function clearEmtpyField(obj) {
  for (const key in obj) {
    const val = obj[key]
    if (!val) {
      delete obj[key]
    } else {
      if (typeof val === 'object') {
        clearEmtpyField(val)
        const subKey = Object.keys(val)
        if (subKey.length === 0) {
          delete obj[key]
        }
      }
    }
  }
}
function isJson(obj) {
  return typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}
function utf16to8(str) {
  var out, i, len, c
  out = ''
  len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i)
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F))
    }
  }
  return out
}
