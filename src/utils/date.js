import dayjs from 'dayjs'
export const dateFmt = (date, fmt = 'yyyy-MM-dd') => {
  if (!date) {
    return date
  }
  if (typeof date === 'string') {
    date = new Date(date)
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}
// 获取对应的时间
export const getData = type => {
  let day = new Date()
  const year = day.getFullYear()
  const month = day.getMonth()
  let str = ''
  //eslint 配置了let转const，case不支持定义const
  let startDayjs // prve30Days
  let nextMonth // nowMonthEnd
  let nextMonthFirstDay // nowMonthEnd
  let oneDay // nowMonthEnd
  switch (type) {
    case 'today':
      day = new Date()
      break
    case 'yesterday':
      day.setDate(day.getDate() - 1)
      break
    case 'nowWeekStart':
      day.setDate(day.getDate() - (day.getDay() - 1)) // 本周第一天
      break
    case 'nowWeekEnd':
      day.setDate(day.getDate() - (day.getDay() - 1) + 6) // 本周最后一天
      break
    case 'prveWeekStart':
      day.setDate(day.getDate() - 7 - (day.getDay() - 1)) // 上周第一天
      break
    case 'prveWeekEnd':
      day.setDate(day.getDate() - 7 - (day.getDay() - 1) + 6) // 上周最后一天
      break
    case 'prve7Days':
      startDayjs = dayjs().subtract(6, 'days') // 最近7天
      str = startDayjs.format('YYYY-MM-DD')
      break
    case 'prve30Days':
      startDayjs = dayjs().subtract(29, 'days') // 最近30天
      str = startDayjs.format('YYYY-MM-DD')
      break
    case 'nowYearStart':
      str = year + '-01-01' // 本年第一天
      break
    case 'nowYearEnd':
      str = year + '-12-31' // 本年最后一天
      break
    case 'prveYearStart':
      str = year - 1 + '-01-01' // 去年第一天
      break
    case 'prveYearEnd':
      str = year - 1 + '-12-31' // 去年最后一天
      break
    case 'nowMonthStart':
      day.setDate(1) // 本月第一天
      break
    case 'nowMonthEnd': // 本月最后
      nextMonth = day.getMonth() + 1
      nextMonthFirstDay = new Date(day.getFullYear(), nextMonth, 1)
      oneDay = 1000 * 60 * 60 * 24
      str = new Date(nextMonthFirstDay - oneDay)
      str = dateFmt(str)
      break
    case 'prveMonthStart':
      if (month === 0) {
        // 上月第一天
        str = year - 1 + '-12-01'
      } else {
        const prveMonth = month < 10 ? '0' + month : month
        str = year + '-' + prveMonth + '-01'
      }
      break
    case 'prveMonthEnd':
      if (month === 0) {
        // 上月最后一天
        str = year - 1 + '-12-31'
      } else {
        str = new Date(new Date(year, month, 1) - 1000 * 60 * 60 * 24)
        str = dateFmt(str)
      }
      break
  }
  if (!str) {
    str = dateFmt(day)
  }
  return str
}

export const completionDateEnd = function(val, queryParams, start, end) {
  let startTime = ''
  let endTime = ''
  if (val && val.length) {
    startTime = val[0] + ' 00:00:00'
    endTime = val[1] + ' 23:59:59'
  }
  this.$set(queryParams, start, startTime)
  this.$set(queryParams, end, endTime)
}
// 时间周期选择中选择对应日期
export const choseTimeType = function(
  val,
  queryParams,
  start,
  end,
  joinTime,
  ruleTime,
  start2,
  end2
) {
  let startTime = ''
  let endTime = ''
  console.log(val)
  switch (val + '') {
    case '1':
      if (ruleTime) {
        startTime = getData('yesterday') + ' ' + ruleTime
        endTime = getData('today') + ' ' + ruleTime
      }
      break
    case '2':
      startTime = getData('today') + ' 00:00:00'
      endTime = getData('today') + ' 23:59:59'
      break
    case '3':
      startTime = getData('yesterday') + ' 00:00:00'
      endTime = getData('yesterday') + ' 23:59:59'
      break
    case '4':
      startTime = getData('nowWeekStart') + ' 00:00:00'
      endTime = getData('nowWeekEnd') + ' 23:59:59'
      break
    case '5':
      startTime = getData('prveWeekStart') + ' 00:00:00'
      endTime = getData('prveWeekEnd') + ' 23:59:59'
      break
    case '6':
      startTime = getData('nowMonthStart') + ' 00:00:00'
      endTime = getData('nowMonthEnd') + ' 23:59:59'
      break
    case '7':
      startTime = getData('prveMonthStart') + ' 00:00:00'
      endTime = getData('prveMonthEnd') + ' 23:59:59'
      break
    case '8':
      startTime = getData('nowYearStart') + ' 00:00:00'
      endTime = getData('nowYearEnd') + ' 23:59:59'
      break
    case '9':
      startTime = getData('prveYearStart') + ' 00:00:00'
      endTime = getData('prveYearEnd') + ' 23:59:59'
      break
    case '10':
      if (joinTime[0] && joinTime[1]) {
        startTime = joinTime[0] + ' 00:00:00'
        endTime = joinTime[1] + ' 23:59:59'
      }
      break
  }

  this.$set(queryParams, start, startTime)
  this.$set(queryParams, end, endTime)
  this.$delete(queryParams, start2)
  this.$delete(queryParams, end2)
  console.log(start, startTime, end, endTime)
  console.log('queryParams', queryParams)
}
