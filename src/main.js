// import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import store from './vuex/store';
import Vuex from 'vuex';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import 'font-awesome/css/font-awesome.min.css';
import './assets/img/favicon.ico';
import VueCookie from 'vue-cookie';



import supports from './supports';
import * as filters from './supports/filter/filters'

import Mock from './mock';
Mock.bootstrap();

import router from './router';  // router保持小写，大写会出错误

Vue.use(ElementUI);
Vue.use(Vuex);
Vue.use(supports);
Vue.use(VueCookie);

// 实例化Vue的filter
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));


NProgress.configure({ showSpinner: false });

Vue.prototype.$eventHub= Vue.prototype.$eventHub ||  new Vue();

const CreateApp = ()=>{
  /* eslint-disable no-new */
  return new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');
};


store.dispatch('doInitSession')
  .then(rst=>{
    CreateApp()
  })
  .catch(e=>{
    CreateApp()
  })


// import {apiTestPage, getUserInfo} from './api/auth'
//apiTestPage({id: 100}).then(data=>{console.log(data)});
// getUserInfo().then(data=>console.log(data));

