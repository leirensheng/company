/**
 * Created by gavin on 17/4/1.
 */

import supports from '../supports'
const $fetch = supports.$fetch;

class RegionApi {

  /** 递归处理数据 每个子对象中塞入 key =parent[key]_level_label **/
  handleRegionData = function(data, Obj){
    if( data instanceof Array && data.length > 0){
      for (let i = 0; i < data.length; i++){
        let item = data[i];
        if (item.level){
          if (Obj && Obj["key"]){
            item["key"] = Obj["key"] +"_"+ item.level+ "_" + item.label;
          }else{
            item["key"] = item.level+ "_" + item.label;
          }
        }
        if (item.hasOwnProperty("children") && item["children"]){
          this.handleRegionData(item["children"], item);
        }
      }
    }else{
      return;
    }
  };

  /** 根据CompanyCode获取大区省份城市数据 **/
  getRegionProvCity(param){
    return $fetch.get('/crm/api/ba/regions/list-by-company-code', param).then((res)=>{
      this.handleRegionData(res.data);
      return Promise.resolve(res);
    })
  };

  getListByRegionId(param) {
    return $fetch.post("/crm/api/ba/outlets/list-outlet-by-region-id", param)
  }

  getRegionIdByCampId(param) {
    return $fetch.get('/crm/api/tp/campaigns/get-region-by-id', param)
  }
}

export default new RegionApi();
