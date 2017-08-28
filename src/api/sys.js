/**
 * Created by Jack on 2017/6/15.
 */

import supports from '../supports'
const $fetch = supports.$fetch;

class sysApi {
  getSmsList(params) {
    return $fetch.post('/crm/api/sms/list',params);
  }

  editRole(params) {
    return $fetch.put('/crm/api/role',params);
  }

  getListRoleByType(params){
    return $fetch.get('/crm/api/role/read/list-role-by-type',params);
  }

  roleReadList(params){
    return $fetch.post("/crm/api/role/read/list", params);
  };

  companyReadList(params){
    var postData =  {
      noPager: true,
      page: {
        current: 1,
        size: 100
      }
    }
    return $fetch.post("/crm/api/ba/companies/read/page", postData);
  };

  addCompany(params){
    return $fetch.postForm("/crm/api/ba/companies/add", params);
  };

  editCompany(params){
    if(params.wxMpPrivate === 0){
      params.wxMpId = '';
      params.appKey = '';
      params.appSecret = '';
    }
    return $fetch.postForm("/crm/api/ba/companies/update", params);
  };

  getWxMenu(params){
    return $fetch.get("/crm/api/ba/wxmp-menu/read/list", {params:{companyCode:params}});
  };
  submitWxMenu(params){
    return $fetch.post("/crm/api/ba/wxmp-menu/add", params);
  };

  editWxMenu(params){
    var postData = {
      menuName:params.label,
      menuType:params.type == 'click'? 1:2,
      menuValue:params.url,
      id:params.id
    };
    return $fetch.post("/crm/api/ba/wxmp-menu/update", postData);
  };

  deleteTab(params){
    var postData = {
      id:params
    };
    return $fetch.delete("/crm/api/ba/wxmp-menu", {params:postData});
  };

  getWxSection(params) {
    var postData = {
      page: {
        current: 1,
        size: 10,
      },
      params: {
        companyCode:params
      }
    };
    return $fetch.post("/crm/api/ba/wxmp-section-setting/list", postData);
  }

  getSysDic(params){
    var data = {
      indexId:params
    };
    return $fetch.get('/crm/api/sys/dic/read/list-dic-by-index',{params:data});
  }

  sectionVisible(params){
    return $fetch.post("/crm/api/ba/wxmp-section-setting/update-section-visible", params);
  };

  sectionOrder(params){
    return $fetch.post("/crm/api/ba/wxmp-section-setting/update-section-order", params);
  };

  sectionTitleUpdate(params){
    return $fetch.post("/crm/api/ba/wxmp-section-setting/update", params);
  };

  getStatusList(params){
    return $fetch.get("/crm/api/tp/campaigns/status/list", params);
  };
}

export default new sysApi();
