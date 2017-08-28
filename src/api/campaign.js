/**
 * Created by gavin on 17/4/11.
 */

import supports from '../supports'
const $fetch = supports.$fetch;

class CampaignApi {

  /** 分块获取 主信息 **/
  getCampaignsMainById(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-main', {params:param})
  }
  /** 分块获取 门店 **/
  getCampaignsOutletsById(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-outlets', {params:param})
  }
  /** 分块获取 模板对象**/
  getCampaignsAudTargetsById(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-aud-targets', {params:param})
  }
  /** 分块获取 活动内容信息 **/
  getCampaignsContentById(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-content', {params:param})
  }
  /** 分块获取 优惠券 **/
  getCampaignsCouponById(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-coupons', {params:param})
  }
  /** 分块保存 主信息 **/
  saveCampaignsMain(campaignVo){
    return $fetch.post('/crm/api/tp/campaigns/save-camp-main', campaignVo)
  }
  /** 分块保存 门店 **/
  saveCampaignsOutlets(campaignVo){
    return $fetch.post('/crm/api/tp/campaigns/save-camp-outlets', campaignVo)
  }
  /** 分块保存 模板对象**/
  saveCampaignsAudTargets(campaignVo){
    return $fetch.post('/crm/api/tp/campaigns/save-camp-aud-targets', campaignVo)
  }
  /** 分块保存 活动内容信息 **/
  saveCampaignsContent(campaignVo){
    return $fetch.post('/crm/api/tp/campaigns/save-camp-content', campaignVo)
  }
  /** 分块保存 优惠券 **/
  saveCampaignsCoupon(campaignVo){
    return $fetch.post('/crm/api/tp/campaigns/save-camp-coupons', campaignVo)
  }
  getCampTplByClass(param){
    return $fetch.get('/crm/api/tp/campaigns/get-camp-tpl-by-tpclass', param)
  }
  getCouponTplByClass(param){
    return $fetch.get('/crm/api/tp/campaigns/get-coupon-tpl-by-tpclass', param)
  }
  getSmsTplByClass(param){
    return $fetch.get('/crm/api/tp/campaigns/get-sms-tpl-by-tpclass', param)
  }
  getTplContentById(param){
    return $fetch.get('/crm/api/tp/campaigns/tpl-content-by-id', param)
  }

  getCampaignStatusList(param){
    return $fetch.get('/crm/api/tp/campaigns/status/list',{params:param});
  }
  getCampaignCategoriesList(param){
    return $fetch.get('/crm/api/tp/campaigns/categories/list',{params:param});
  }
  getCampaignsTypesList(param){
    return $fetch.get('/crm/api/tp/campaigns/type/list',{params:param});
  }
  getTpClassList(param){
    return $fetch.get('/crm/api/tp/class/list',{params:param});
  }
  /** 根据id companyCode 修改status 值 **/
  updateCampaignStatus(param){
    return $fetch.post('/crm/api/tp/campaigns/update-status',param);
  }
  updateCampIsTargetingAll(param){
    return $fetch.post('/crm/api/tp/campaigns/update-is-targeting-all', param);
  }

  /** 根据id  修改 shortLink 值 **/
  updateShortLink(param){
    return $fetch.post('/crm/api/tp/campaigns/shortLink', param);
  }

  getCategories(param){
    return $fetch.get('/crm/api/tp/campaigns/categories',param);
  }

  getTrackingById(param){
    return $fetch.get('/crm/api/tp/camp-tracking/stats-by-id',{params:param});
  }

  saveSmsTemp(param){
    return $fetch.post('/crm/api/tp/save-sms-tmp',param);
  }

  getCampaignList(param){
    return $fetch.post('/crm/api/tp/campaigns/list',param);
  }

  getSmsPlatform(param){
    return $fetch.get('/crm/api/tp/sms-platform',param);
  }

  getCampaignByClass(params){
    return $fetch.get('/crm/api/tp/campaigns/get-by-class',{params:params});
  }

  getSmsList(current,strFilter){
    var postData = {
      page: {
        current: current,
        size: 50
      },
      params: {
        lfilter: 0,
        strFilter: strFilter.toString()
      }
    };
    return $fetch.post('/crm/api/tp/get-sms-tpl-list',postData);
  }

  getSmsTplList(param){
    return $fetch.post('/crm/api/tp/get-sms-tpl-list', param);
  }

  deleteSmsTmp(id) {
    let postData = {
      smsTmpId:id
    };
    // let post = JSON.stringify(postData);
    return $fetch.delete('/crm/api/tp/del-sms-tmp',{params:postData});
  }

  getCampaignItemList(params){
    var postData = {
        campaignId:params
    }
    return $fetch.get("/crm/api/tp/campaigns-item/list", {params:postData});
  };

  getCampaignById(params){
    var postData = {
      campaignId:params
    }
    return $fetch.get("/crm/api/tp/campaigns/get-by-id", {params:params});
  };

  getTargetByCampaignId(params){
    var postData = {
      campaignId:params
    };
    return $fetch.get("/crm/api/tp/campaigns/get-targets-by-campaign-id", {params:postData});
  };

  getUserRegionById(params) {
    return $fetch.get("/crm/api/ba/regions/list-by-user-id", {params:params});
  }
}

export default new CampaignApi();
