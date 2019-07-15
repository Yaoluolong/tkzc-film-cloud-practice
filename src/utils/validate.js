/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
// 是否为正整数
export function isPositiveInteger(s) {
  var re = /^[0-9]+$/
  return re.test(s)
}
// 是否为正数
export function isPositive(num) {
  var reg = /^\d+(?=\.{0,1}\d+$|$)/
  if (reg.test(num)) return true
  return false
}
// 是否为正整数
export function isInteger(s) {
  var re = /^(0|[1-9]\d*)(\s|$|\.\d{1,2}\b)/
  return re.test(s)
}

// 字符串型数字，2位小数
export const STRING_NUMBER = (rule, value, callback) => {
  const reg = new RegExp('^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$')
  console.log(value)
  if (!value) {
    callback(new Error('请输入正确的金额!'))
  } else if (reg.test(value) === false) {
    callback(new Error('请输入最多包含2位小数的正数!'))
  } else {
    callback()
  }
}
