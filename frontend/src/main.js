// Vue对象
import Vue from 'vue'
// 自定义Vue组件
import Febs from './FEBS'
// Vue 路由
import router from './router'
// Ant Design Vue组件库
import Antd from 'ant-design-vue'
// Vuex store对象
import store from './store'
// 自定义请求库
import request from 'utils/request'
// 自定义本地存储库
import db from 'utils/localstorage'
// Vue ApexCharts组件
import VueApexCharts from 'vue-apexcharts'
// Ant Design Vue的样式文件
import 'ant-design-vue/dist/antd.css'

import 'utils/install'

// 设置全局属性
Vue.config.productionTip = false
// Vue安装Antd/db/VueApexCharts插件
Vue.use(Antd)
Vue.use(db)
Vue.use(VueApexCharts)
// Vue全局组件
Vue.component('apexchart', VueApexCharts)
// install方法注册插件
Vue.use({
  install (Vue) {
    Vue.prototype.$db = db
  }
})

// 设置全局方法
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(Febs)
}).$mount('#febs')
