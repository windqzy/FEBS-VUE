import Vue from 'vue'
import Router from 'vue-router'
import MenuView from '@/views/common/MenuView'
import PageView from '@/views/common/PageView'
import LoginView from '@/views/login/Common'
import EmptyPageView from '@/views/common/EmptyPageView'
import HomePageView from '@/views/HomePage'
import db from 'utils/localstorage'
import request from 'utils/request'

// 全局Router异常处理
// const originalPush = Router.prototype.push
// Router.prototype.push = function push (location) {
//   return originalPush.call(this, location).catch(err => { if (typeof err !== 'undefined')console.log(err) })
//   // return originalPush.call(this, location).catch(err => { console.log('123', err) })
// }
Vue.use(Router)

let constRouter = [
  {
    path: '/login',
    name: '登录页',
    component: LoginView
  },
  {
    path: '/index',
    name: '首页',
    redirect: '/home'
  }
]

let router = new Router({
  routes: constRouter
})

const whiteList = ['/login']

let asyncRouter

// 导航守卫，渲染动态路由
router.beforeEach((to, from, next) => {
  debugger
  console.log('-------------start----------------')
  console.log(to.path)
  console.log(from.path)
  // 登录属于白名单方法
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  }
  let token = db.get('USER_TOKEN')
  let user = db.get('USER')
  let userRouter = get('USER_ROUTER')
  // 用户没有登录则登录
  if (token.length && user) {
    if (!asyncRouter) {
      if (!userRouter) {
        console.log(userRouter)
        request.get(`menu/${user.username}`).then((res) => {
          asyncRouter = res.data
          console.log(res.data)
          save('USER_ROUTER', asyncRouter)
          console.log(asyncRouter.path)
          go(to, next)
        }).catch(err => { console.error(err) })
      } else {
        asyncRouter = userRouter
        go(to, next)
      }
    } else {
      next()
    }
  } else {
    // 递归调用next方法
    next('/login')
  }
})

function go (to, next) {
  asyncRouter = filterAsyncRouter(asyncRouter)
  router.addRoutes(asyncRouter)
  next({...to, replace: true})
}

function save (name, data) {
  localStorage.setItem(name, JSON.stringify(data))
}

function get (name) {
  return JSON.parse(localStorage.getItem(name))
}

function filterAsyncRouter (routes) {
  // 动态路由的主要实现地点
  return routes.filter((route) => {
    let component = route.component
    if (component) {
      switch (route.component) {
        case 'MenuView':
          route.component = MenuView
          break
        case 'PageView':
          route.component = PageView
          break
        case 'EmptyPageView':
          route.component = EmptyPageView
          break
        case 'HomePageView':
          route.component = HomePageView
          break
        default:
          route.component = view(component)
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    }
  })
}

function view (path) {
  return function (resolve) {
    import(`@/views/${path}.vue`).then(mod => {
      resolve(mod)
    })
  }
}

export default router
