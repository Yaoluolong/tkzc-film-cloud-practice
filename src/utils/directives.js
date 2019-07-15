
function defaultImgDeal(el, binding) {
  const type = binding.arg ? binding.arg : 'head'
  let defaultImg = require('../assets/user/default-head.png')
  if (type === 'poster') {
    defaultImg = require('../assets/noImage.jpg')
  }
  if (binding.value) {
    defaultImg = binding.value
  }
  if (!el.src) {
    el.src = defaultImg
  }
  el.onerror = () => {
    el.src = defaultImg
  }
}

const directives = {
  autoOrient: {
    bind: (el) => {
      el.src = el.src + '?imageMogr2/auto-orient'
    }
  },
  defaultImg: {
    bind: (el, binding) => {
      defaultImgDeal(el, binding)
    },
    update: (el, binding) => {
      defaultImgDeal(el, binding)
    }
  }
}

export default {
  install(vue, options) {
    for (const key in directives) {
      vue.directive(key, directives[key])
    }
  }
}
