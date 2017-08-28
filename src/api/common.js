/**
 * Created by Dragon on 17/4/13.
 */

import supports from 'supports'
const $fetch = supports.$fetch;


class commonApi{

  getOrganizationStructure(queryParams){
    return $fetch.post('/crm/api/ba/common/organization-structure', queryParams).then((res) =>{
      return Promise.resolve(res);
    });
  }

  getCompanies(){
    return $fetch.post('/crm/api/ba/companies/list', {}).then((res) => {
      return Promise.resolve(res);
    });
  }

  getListByFilterCode(params){
    return $fetch.get('/crm/api/ba/outlets/list-by-filter-code', params);
  }

  getOutletsTypeAndGradeList(params){
    return $fetch.get('/crm/api/ba/outlets-type-and-grade/list-by-company-code', {params:params});
  }

}

export default new commonApi;
