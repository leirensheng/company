/**
 * Created by clude on 3/25/17.
 */

import supports from '../supports'
const $fetch = supports.$fetch;

class UserApi {
  signIn(args, options){
    let loginParams = { account: args.username, password: args.password };
    return $fetch.postForm('/crm/api/login',loginParams);
  };

  signOut(){
    return $fetch.get("/crm/api/logout");
  };

  getUser(args, options){
    return $fetch.get('/crm/api/user/read/fullinfo');
  };

  getListPage(args, options){
    return $fetch.get('/user/listpage');
  };

  getCrmUserList(params){
    return $fetch.post("/crm/api/user/read/list-crm-user", params);
  };

  getRole(params){
    return $fetch.postForm("/crm/api/user/read/role", params);
  };

  updateCrmUser(params){
  return $fetch.post("/crm/api/user/update-crm-user", params);
  };

  updateGuideUser(params){
    return $fetch.post("/crm/api/user/update-guide-user", params);
  };

  addCrmUser(params){
    return $fetch.post("/crm/api/user/add-crm-user", params);
  };

  listGuideUser(params){
    return $fetch.post("/crm/api/user/read/list-guide-user", params);
  };

  addGuideUser(params){
    return $fetch.post("/crm/api/user/add-guide-user", params);
  };

  lockUser(params){
    return $fetch.post("/crm/api/user/locked", params);
  };

  unlockUser(params){
    return $fetch.post("/crm/api/user/unlock", params);
  };

  userQuit(params){
    return $fetch.post("/crm/api/sys/user/quit", params);
  };

  userVacation(params){
    return $fetch.post("/crm/api/sys/user/day-off", params);
  };

  userVacationOff(params){
    return $fetch.post("/crm/api/sys/user/cancel-day-off", params);
  };

  switchStore(params){
    return $fetch.post("/crm/api/sys/user/switch-store", params);
  };

  getListByOutletId(outletId,userId){
    var postData = {
      outletId:outletId,
      userId:userId
    };
    return $fetch.get("/crm/api/sys/user/list-user-by-outlet-id", {params:postData});
  };

  getListByRegionId(regionId,campanyCode){
    var params = {
      noPager: true,
      page: {
        current: 1,
        size: 20,
      },
      params: {
        lfilter: regionId,
        strFilter: campanyCode
      }
    };
    return $fetch.post("/crm/api/ba/outlets/list-by-region-id", params);
  };

  getListByRegionIdNoPager(regionId,companyCode,outletId){
    var params = {
      regionId:regionId,
      companyCode:companyCode,
      outletId:outletId
    };
    return $fetch.post("/crm/api/ba/outlets/list-outlet-by-region-id", params);
  };

  userForbid(userId){
    var params = {
      userId:userId
    }
    return $fetch.get('/crm/api/sys/user/forbid',{params:params});
  };

}

export default new UserApi();
