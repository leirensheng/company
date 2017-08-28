/**
 * Created by zwb on 2017/8/14.
 */

import supports from '../supports'
const $fetch = supports.$fetch;

class StoresApi {
  getListStores(params){
    return $fetch.post("/crm/api/ba/outlets/list", params);
  };
  updateAttrBatchStores(params){
    return $fetch.post("/crm/api/ba/outlets/update-attr-batch", params);
  };
  updateStores(params){
    return $fetch.post("/crm/api/ba/outlets/update", params);
  };
  insertStores(params){
    return $fetch.post("/crm/api/ba/outlets/insert", params);
  };
  getProvinces(params){
    return $fetch.get("/crm/api/ba/provinces/list-provinces", params);
  };
  getCity(provId){
    let params = {
      provId: provId
    }
    return $fetch.get("/crm/api/ba/cities/list-cities-by-prov-id", {params: params});
  };
  getCounty(cityId){
    let params = {
      cityId: cityId
    }
    return $fetch.get("/crm/api/ba/cities/list-counties-by-city-id", {params:params});
  };
  checkOutletCode(companyCode, outletCode){
    let params = {
      companyCode: companyCode,
      outletCode: outletCode
    }
    return $fetch.get("/crm/api/ba/outlets/check-outlet-code", {params:params});
  };
}

export default new StoresApi();
