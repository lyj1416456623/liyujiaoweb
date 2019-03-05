// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs';
import Global from './Global'
import '../theme/index.css'
import util from './lib/util'
import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()
import {
  Pagination,
  Message,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  Popover,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Tree,
  Alert,
  Icon,
  Row,
  Col,
  Container,
  Header,
  Aside,
  Main,
  Footer,
  MessageBox,
  TimePicker,
  DatePicker,
  Tabs,
  TabPane,
  Scrollbar,
  Slider,
  Progress,
  Rate,
  Cascader
} from 'element-ui';
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxButton);
Vue.use(CheckboxGroup);
Vue.use(Switch);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Popover);
Vue.use(Tooltip);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Tree);
Vue.use(Alert);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);
Vue.use(TimePicker);
Vue.use(DatePicker);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Scrollbar);
Vue.use(Slider);
Vue.use(Progress);
Vue.use(Rate);
Vue.use(Cascader);
Vue.prototype.$message = Message;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;

import wx from 'weixin-js-sdk';  //微信jssdk
import WeVue from 'we-vue'
import 'we-vue/lib/style.css'
import VConsole from 'vconsole'
if(location.href.indexOf('debugger=true')!=-1 || location.href.indexOf('prewx.ziyue')!=-1){
  const vConsole = new VConsole()
}
// const vConsole = new VConsole(); //临时放出来,在钉钉测试完成后,隐藏。
import VueWechatTitle from 'vue-wechat-title';
Vue.use(VueWechatTitle);

import Print from './lib/print';
Vue.use(Print);

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
Vue.prototype.commonMethods = Global.methods;
Vue.prototype.request=Global.methods.request;
Vue.prototype.checkWeiXinBrowser = Global.methods.checkWeiXinBrowser;
Vue.prototype.wxConfigZiYue = Global.methods.wxConfigZiYue;
Vue.prototype.dingdingConfig = Global.methods.dingdingConfig;
Vue.prototype.$util = util

Vue.use(WeVue)

// router.beforeEach((to, from, next) => {
//   /* 路由发生变化修改页面title */
//   if (to.meta.title) {
//     window.document.title = to.meta.title;
//   }
//   next()
// })
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
