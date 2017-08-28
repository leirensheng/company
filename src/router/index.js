import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';
import store from '../vuex/store';

//import $routes from './routes';

import {$listener, LSN} from '../supports/service/events';

Vue.use(VueRouter);

let isInit = false;

var router = new VueRouter({
  mode: 'history',
  routes: routes
});

let UnAuthPath = ['/download'];

const routeFunc = (to, from, next) => {
  let isLogin = store.getters.isLogin;
  if (UnAuthPath.includes(to.path)) {
    next();
  } else if (isLogin && to.path == '/login') {
    next({ path: '/main' });
  } else if (!isLogin && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
}

router.beforeEach((to, from, next) => {
  let isSessionInit = store.getters.isInited;
  if(isSessionInit){
    routeFunc(to, from, next);
  }else{
    store.dispatch('doInitSession')
      .then(rst=>{
        routeFunc(to, from, next);
      })
      .catch(e=>{
        next()
      })
  }
});

$listener.$on(LSN.SESSION_EXPIRED, (data)=>{
  store.dispatch('clearSession');
  router.push({ path: '/login' });
});

//router.afterEach(transition => {
//NProgress.done();
//});

export default router;
