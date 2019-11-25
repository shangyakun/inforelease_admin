// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index.js'
import ELementUI from 'element-ui'
import promise from 'es6-promise'
import store from './store'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/style/reset.css'
import './permission'
promise.polyfill();
Vue.use(ELementUI);
Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

