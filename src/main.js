import App from '@/app.vue'
import '@/assets/style/index.scss' // eslint-disable-line
import '@/assets/style/realize/element-variable.scss'
import StickyTop from '@/components/sticky-top'
import '@/config/global'
import '@/lib/directive'
import '@/lib/filter'
import '@/lib/mixin'
import '@/lib/plugin'
import router from '@/router'
import store from '@/store'
import '@babel/polyfill'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import Vue from 'vue'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.component(CollapseTransition.name, CollapseTransition)

// base 组件注册
Vue.component('sticky-top', StickyTop)

/* eslint no-unused-vars: 0 */
const AppInstance = new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

// 设置 App 实例
window.App = AppInstance
