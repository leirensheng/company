/**
 * Created by gavin on 17/7/4.
 */
import supports from '../supports'
const $fetch = supports.$fetch;

class TagApi {

  getTagsByParentTagId (param){
    // params {parentTagId: ''}
    return $fetch.get('/crm/api/al/tags/by-parent-id', {params:param});
  }

  getTagValuesByTagId (param){
    // params {tagId: ''}
    return $fetch.get('/crm/api/al/tags/values/by-id', {params:param});
  }

  getListByCompanyCode (param){
    // params {CompanyCode: ''}
    return $fetch.get('/crm/api/al/list/by-company-code', {params:param});
  }

  getTagsList(param){
    return $fetch.get('/crm/api/al/tag/get-tags-list', {params:param});
  }
  getTagValuesList(param){
    return $fetch.get('/crm/api/al/tag/get-tag-values-list', {params:param});
  }
  getTagListsByCompany(param){
    return $fetch.get('/crm/api/al/tag/get-lists-by-company', {params:param});
  }

  deleteTagRuleById(param){
    return $fetch.post('/crm/api/tp/campaigns/delete-tag-by-id', param);
  }
  deleteTagRuleByGroup(param){
    return $fetch.post('/crm/api/tp/campaigns/delete-tag-by-group', param);
  }

  getTagGeoProvincesList(param){
    return $fetch.post('/crm/api/ba/provinces/geo-list', param);
  }

}

export default new TagApi();
