/**
 * Created by Dragon on 17/4/11.
 */

import supports from 'supports'
const $fetch = supports.$fetch;

import convertApi from '../supports/convert/convert_tags';
import * as tagValues from '../assets/json/tag_values.json'


let genderValueId = '102', ageRangeId='104';

//会员模块Api
class AudienceApi {
  constructor(){
    this.tagListDef = [];
    this.tagMapping = [
      {label:'人口属性',ids:['102', '103', '104', '111', '112']},
      {label:'身材特征',ids:['105', '106', '107', '108', '109', '110']},
      {label:'地理属性',ids:['201', '202', '203']},
      {label:'购物偏好',ids:['301', '303', '304']},
      {label:'RFM模型',ids:['901', '902', '903', '904', '905', '906', '907', '908', '909', '910', '911', '912', '913', '914', '915', '916', '917', '918', '919', '920', '921', '922', '923']}
    ]

  }

  //供查询用的人群列表
  getListsList(companyCode){
    let queryParams = {
      params:{
        companyCode:companyCode
      }
    };
    return $fetch.post('/crm/api/al/lists/list', queryParams).then((res) => {
      return Promise.resolve(res.data);
    });
  }

  //会员管理--会员列表
  getAudienceList(queryParams){
    return $fetch.post('/crm/api/al/audiences/list', queryParams).then((res) => {
      return Promise.resolve(res);
    });
  }

  getTagList(){
    if(this.tagListDef.length != 0){
      return Promise.resolve(this.tagListDef);
    }
    return $fetch.post('/crm/api/al/tags/leaf-list').then((res) => {
      res.data.forEach(tag =>{
        this.tagListDef[tag.id.toString()] = {tag:tag.id, label:tag.tagDesc, convertFunction:tag.convertFunction};
      });
      return Promise.resolve(this.tagListDef);
    });
  }

  //获取会员标签hbase
  getAudienceTags(cellPhone){
    return $fetch.get('/crm/api/dc/audience', {params:{"id":cellPhone}}).then((res) => {
      return Promise.resolve(res.data.tags);
    });
  }

  getListsWeeklyRpt(companyCode, listId=''){
    let queryParam = {
      params:{
        companyCode:companyCode,
        vipCat:listId
      }
    };
    return $fetch.get('/crm/api/dc/lists/weekly-rpt', queryParam).then((res) => {
      return Promise.resolve(res.data);
    });
  }

  getAudienceRpt(companyCode, listId, dimension){
    let queryParam = {
      params:{
        companyCode:companyCode,
        vipCat:listId,
        dimension:dimension
      }
    };
    return $fetch.get('/crm/api/dc/lists/audience-rpt', queryParam).then((res) => {
      return Promise.resolve(res.data);
    });
  }


  //会员管理--会员详情
  getAudienceInfo(cellPhone){
    let tagMappings = JSON.parse(JSON.stringify(this.tagMapping));

     return Promise.all([this.getTagList(), this.getAudienceTags(cellPhone)]).then(([tagDef, tagData]) =>{
      let tagResult = [];
      tagMappings.forEach((mapping) =>{
        Object.keys(tagData).filter(x=>mapping.ids.includes(x)).forEach(tagId =>{
          const v = convertApi[tagDef[tagId]['convertFunction']](tagId, tagData[tagId]);
          mapping.values = mapping.values || [];
          mapping.values.push(tagDef[tagId]['label']+':'+ v);
        });
        if(mapping.hasOwnProperty('values')){
          tagResult.push(mapping);
        }
      });
      return Promise.resolve(tagResult);
    });
  }

  //人群管理 人群以及人群统计
  getListsListStats(queryParams){
    let companyCode = queryParams.params.companyCode;
    let resultRpt = [];
    return Promise.all([this.getListsList(companyCode), this.getListsWeeklyRpt(companyCode)]).then(([lists, listsRpt]) =>{
      listsRpt.forEach((r) =>{
        lists.forEach(l=>{
          if(r.vipCat == l.stdListId){
            r['listDesc'] = l.listDesc;
            r['listName'] = l.listName;
            resultRpt.push(r);
          }
        });
      });
      return Promise.resolve(resultRpt);
    });
  }



  //人群透视
  getListsScenograph(companyCode, listId){
    let genderRptFun = this.getAudienceRpt(companyCode, listId, 'gender');
    let ageRptFun = this.getAudienceRpt(companyCode, listId, 'age_range');
    let growRptFun = this.getAudienceRpt(companyCode, listId, 'create_date');


    return Promise.all([genderRptFun, ageRptFun, growRptFun]).then(([genderRpt, ageRpt, growRpt])=>{
      let resultRpt = {};
      resultRpt['reside'] = [{name:'天河区',totalCount:40}, {name:'海珠区',totalCount:20}, {name:'车陂区',totalCount:32},{name:'黄埔区',totalCount:10} ,{name:'其他',totalCount:19}];
      resultRpt['gender'] = genderRpt.map(rpt =>{
        return {name:tagValues[genderValueId][rpt.name] || '未知', value:rpt.totalCount};
      });
      resultRpt['age'] = ageRpt.map(rpt =>{
        return {name:tagValues[ageRangeId][rpt.name], totalCount:rpt.totalCount};
      });

      resultRpt['grow'] = growRpt;

      return Promise.resolve(resultRpt);
    });
  }

  //人群管理 人群概览
  getListsStats(companyCode, listId){
    let queryParam = {
      params:{
        companyCode:companyCode,
        vipCat:listId
      }
    };
    return $fetch.get('/crm/api/dc/lists/total-weekly-rpt', queryParam).then((res) => {
      return Promise.resolve(res.data);
    });

  }

  //获取会员所属人群
  getAudienceLists(companyCode, audienceId){
    return $fetch.get('/crm/api/al/aud-lists/list-by-audience', {params:{"companyCode":companyCode,"audienceId":audienceId}}).then((res) => {
      return Promise.resolve(res.data);
    });
  }


}

export default new AudienceApi();
