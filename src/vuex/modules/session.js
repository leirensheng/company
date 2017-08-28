// initial state

import userApi from '../../api/user'
import commonApi from '../../api/common';

import config from 'supports/settings';
import router from 'src/router';

import $vx from 'supports/util/vx';

class Menu {
  id = '';
  path = '';
  leaf = false;
  iconcls = '';
  name = '';
  children = '';

  build(sm){
    this.id = sm.id;
    this.path = sm.request;
    this.iconcls = sm.iconcls;
    this.name = sm.menuName;
    this.leaf = sm.leaf ? true : false;
  }
};

const createMenus = function(sourceMenus){
  return sourceMenus.map(sm=>{
    let m = new Menu();
    m.build(sm);
    if(sm.menuBeans && sm.menuBeans.length > 0){
      m.children = createMenus(sm.menuBeans);
    }
    return m;
  });
};

const wrapDemoMenus = function(menus){
  if(config.showDemo){
    let routes = router.options.routes;
    let demoMenu = routes.filter(r=>r.isDemo);
    return menus.concat(demoMenu);
  }

  return menus;
};

const isLogin = sessionStorage.getItem('user')? true:false;



const getSessionUser = function(){
  let str = sessionStorage.getItem('user');
  if(str){
    try{
      return JSON.parse(str)
    }catch(e){return {};}
  }
};

const getMenus = function(){
  let str = sessionStorage.getItem('menus');
  if(str){
    try{
      return JSON.parse(str)
    }catch(e){return [];}
  }
};

const getCompanyMenuList = function(){
  let str = sessionStorage.getItem('sessionCompanyMenu');
  if(str){
    try{
      return JSON.parse(str)
    }catch(e){return [];}
  }
};

const createSelectCompanyInfo = function (companyInfo) {
  return {
    companyCode:companyInfo.companyCode
  };
};


const state = {
  isInited: false,
  // 页面打开默认设置登录状态为否
  isLogin : isLogin,
  // 保存登录信息
  userInfo : {
    name : '',
    avatar : '',
    id : '',
    companyCode:'',
    accesstoken : '',
    companyType: '',
    account: '',
    userType: '',
    regionId: ''
  },
  // 用户菜单
  menus : [],
  // 用户未读消息条数
  message_count : 0,

  selectCompanyInfo:{
    companyCode:''
  },
  companyMenuList: [],
  regionId: '',
};

// getters
const getters = {
  isInited (state) {
    return state.isInited;
  },
  isLogin (state) {
    return state.isLogin;
  },
  getUserInfo (state) {
    return state.userInfo;
  },
  getNotMessageCount (state) {
    return state.message_count;
  },
  getMenus (state) {
    return state.menus;
  },
  getSelectCompanyInfo(state){
    return state.selectCompanyInfo;
  },
  getCompanyMenuList(state) {
    return state.companyMenuList;
  },
  getSelectCompanyType (state) {
    if (state.companyMenuList.length > 0){
      let typeObj = state.companyMenuList.filter((item) => {return item.companyCode == state.selectCompanyInfo.companyCode});
      if (typeObj && typeObj[0]) {
        return typeObj[0].companyType;
      }
    } else {
      return state.userInfo.companyType;
    }
  }
};

// actions
const actions = {
  doInitSession(store){
    return new Promise((resolve, reject) => {
      if(store.state.isInited){
        resolve(true);
      }else{
        //resolve(true);

        actions.loadFullUserInfo(store, false)
          .then(rst=>{
            store.commit('SESSION_INIT');
            store.commit('SESSION_LOGIN');
            resolve(true)
          })
          .catch(e=>{
            store.commit('SESSION_INIT');
            store.commit('SESSION_LOGOUT');
            reject(false)
          })
      }
    });
  },
  clearSession(store){
    $vx.sessionStorage.removeItem('user');
    $vx.sessionStorage.removeItem('menus');
    $vx.sessionStorage.removeItem('selectCompanyInfo');
    $vx.sessionStorage.removeItem('sessionCompanyMenu');
    store.commit('SESSION_LOGOUT');
  },
  signIn(store, loginInfo){  //{username: xxx,  password: xxx}
    return new Promise((resolve, reject) => {
      userApi.signIn(loginInfo).then(rst=>{
        store.commit('SESSION_LOGIN');
        actions.setUserInfo(store, rst.data);
        resolve(rst.data);
      }).catch(e=>{
        reject(e);
      });
    })
  },
  signOut(store) {
    return new Promise((resolve, reject) => {
      userApi.signOut().then(rst=>{
        actions.clearSession(store);
        resolve(true);
      }).catch(e=>{
        reject(e);
      });
    })
  },
  setUserInfo({commit}, userInfo) {
    $vx.sessionStorage.setItem('user', userInfo);
    commit('SESSION_SET_USER', userInfo);
  },
  setNotMessageCount({commit}, count) {
    commit('SESSION_SET_MESSAGE_COUNT', count);
  },
  setMenus({commit}, menus) {
    commit('SESSION_SET_MENUS', menus);
  },
  setSelectCompanyInfo({commit}, companyInfo){
    $vx.sessionStorage.setItem('selectCompanyInfo', companyInfo);
    commit('SESSION_SET_SELECT_COMPANY', companyInfo);
  },
  async loadFullUserInfo ({ commit, state }, isForceRemoveLoad) {
    let sessionUser = $vx.sessionStorage.getItem('user');
    let sessionMenus = $vx.sessionStorage.getItem('menus');
    let sessionSelectCompanyInfo = $vx.sessionStorage.getItem('selectCompanyInfo');
    if (sessionUser && sessionMenus && sessionSelectCompanyInfo && !isForceRemoveLoad) {
      commit('SESSION_SET_USER', sessionUser);
      commit('SESSION_SET_MENUS', sessionMenus);
      commit('SESSION_SET_SELECT_COMPANY', sessionSelectCompanyInfo);
      if (sessionUser.companyType === 9) {
        let sessionCompanyMenu = $vx.sessionStorage.getItem('sessionCompanyMenu');
        commit('SESSION_SET_COMPANY_MENU_LIST', sessionCompanyMenu);
      }
      return true;
    }else{
      var rst = await userApi.getUser();
      let {user, menus} = rst.data;
      let selCompanyInfo = createSelectCompanyInfo(user);
      let uiMenus = createMenus(menus);
      uiMenus = wrapDemoMenus(uiMenus);

      $vx.sessionStorage.setItem('user', user);
      $vx.sessionStorage.setItem('menus', uiMenus);
      $vx.sessionStorage.setItem('selectCompanyInfo', selCompanyInfo);

      commit('SESSION_SET_USER', user);
      commit('SESSION_SET_MENUS', uiMenus);
      commit('SESSION_SET_SELECT_COMPANY', selCompanyInfo);

      if (user.companyType === 9) { // 平台管理员
        let companyMenuList = {};
        let companyResp = await commonApi.getCompanies();
        if (companyResp && companyResp.data){
          companyMenuList = companyResp.data
        }
        $vx.sessionStorage.setItem('sessionCompanyMenu', companyMenuList);
        commit('SESSION_SET_COMPANY_MENU_LIST', companyMenuList);
      }
      return true;
      // return userApi.getUser().then(rst => {
      //
      //   return Promise.resolve(true);
      // })
    }
  }
};

// mutations
const mutations = {
  // 设置登录
  SESSION_INIT (state) {
    state.isInited = true;
  },
  // 设置登录
  SESSION_LOGIN (state) {
    state.isLogin = true;
  },
  // 退出登录
  SESSION_LOGOUT (state) {
    state.isLogin = false;
    state.userInfo = {};
    state.menus = [];
    state.selectCompanyInfo = {};
  },
  // 设置登录用户信息
  SESSION_SET_USER (state, userInfo) {
    state.userInfo.name = userInfo.name;
    state.userInfo.avatar = userInfo.avatar;
    state.userInfo.id = userInfo.id;
    state.userInfo.companyCode = userInfo.companyCode;
    state.userInfo.companyType = userInfo.companyType;
    state.userInfo.accesstoken = userInfo.accesstoken;
    state.userInfo.account = userInfo.account;
    state.userInfo.userType = userInfo.userType;
    state.userInfo.regionId = userInfo.regionId;
  },
  // 设置未读消息条数
  SESSION_SET_MESSAGE_COUNT (state, count) {
    state.message_count = count;
  },
  // 设置菜单
  SESSION_SET_MENUS (state, menus) {
    state.menus = menus;
  },
  //设置当前选择的公司客户,默认为登录用户当前公司
  SESSION_SET_SELECT_COMPANY(state, companyInfo){
    state.selectCompanyInfo.companyCode = companyInfo.companyCode;
    state.selectCompanyInfo.companyType = companyInfo.companyType;
  },
  SESSION_SET_COMPANY_MENU_LIST(state, companyMenuList) {
    state.companyMenuList = companyMenuList
  }
};

export default {
  state,
  getters,
  actions,
  mutations
}
