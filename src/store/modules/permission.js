import { asyncRouterMap, constantRouterMap } from '@/router'
import { Message } from 'element-ui'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
// function hasPermission(roles, menus, route) {
//   if (roles && route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.indexOf(role) >= 0)
//   } else if (menus && menus.length > 0) {
//     return menus.some(menu => menu.menuUrl.indexOf(route.path) >= 0)
//   } else {
//     return false
//   }
// }

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, roles, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.hidden) {
      route.meta.sort = -1
      return true
    }
    if (menus) {
      const foundMenu = menus.find(menu => menu.menuUrl === route._path)

      // const foundMenu = menus.find(menu => {
      //   console.log('menu.menuUrl', menu.menuUrl)
      //   return menu.menuUrl === route._path
      // })
      if (foundMenu) {
        // 如果不是三级菜单并且有子菜单则设置重定向链接, 如果没有子菜单则不加入
        if (foundMenu.position < 3) {
          if (foundMenu && foundMenu.children && foundMenu.children.length) {
            route.redirect = foundMenu.children[0].menuUrl
          } else {
            return false
          }
        }
        route.meta.title = foundMenu.menuName
        route.meta.sort = foundMenu.sort

        if (route.children && route.children.length && foundMenu.children) {
          route.children = filterAsyncRouter(route.children, roles, foundMenu.children)
        }
        return true
      }
    }

    return false
  })
  accessedRouters.sort((a, b) => parseInt(b.meta.sort) - parseInt(a.meta.sort))
  return accessedRouters
}

function setRouterPath(asyncRouterMap) {
  const bb = (route) => {
    route.children && route.children.forEach(e => {
      e._path = route._path + '/' + e.path
      bb(e)
    })
  }
  asyncRouterMap.forEach(e => {
    e._path = e.path
    bb(e)
  })
}
const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit, dispatch }, data) {
      return new Promise(resolve => {
        const { roles, menus } = data

        // accessedRouters = asyncRouterMap
        // commit('SET_ROUTERS', accessedRouters)
        // resolve()
        // return
        // if (roles && roles.indexOf('1') >= 0) {
        //   accessedRouters = asyncRouterMap
        // } else {}
        setRouterPath(asyncRouterMap)
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles, menus)
        // 空路由
        accessedRouters.push({ path: '', redirect: menus[0].menuUrl })
        accessedRouters.push({ path: '*', hidden: true,
          beforeEnter: (to, from, next) => {
            dispatch('FedLogOut')
            Message.error(`您没有访问权限页面:${to.fullPath}`)
            next({ path: '/login' })
          } })
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
