// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'
import qs from 'qs';
import Global from './Global'
import '../theme/index.css'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
require('vue2-animate/dist/vue2-animate.min.css')
Es6Promise.polyfill()
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';

Vue.use(ElementUI);

import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
Vue.use(WeVue)
import VConsole from 'vconsole'
// const vConsole = new VConsole();
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

//设置请求参数兼容java参数格式
axios.interceptors.request.use(function (config) {
  config.data = qs.stringify(config.data);  //qs处理
  return config;
}, function (error) {
  return Promise.reject(error);
});


Vue.config.productionTip = false;
Vue.prototype.$http= axios;
Vue.prototype.global = Global;
Vue.prototype.request=Global.methods.request;

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    window.document.title = to.meta.title;
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
