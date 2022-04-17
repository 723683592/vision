import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import SocketService from '@/utils/socket_sevice'
// 引入字体文件
import '@/assets/font/iconfont.css'
// 引入全局的样式文件
import '@/assets/global.less'
// 对服务端进行webSocket的连接
SocketService.Instance.connect()
Vue.prototype.$socket = SocketService.Instance
// 请求基准路径的配置
// 挂载到vue原型
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
Vue.prototype.$http = axios

// 将全局echarts对象挂载到Vue的原型对象上
// 别的组件中 this.$echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
