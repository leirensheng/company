/**
 * Created by Jack on 2017/7/20.
 */
import supports from '../supports'
const $fetch = supports.$fetch;

class spApi {
  getItemList(filter, pager,companyCode) {
    let {startDate,endDate,fuzzItemName} = filter;
    if(startDate !== ''){
      startDate = `${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`
    }
    if(endDate !== ''){
      endDate = `${endDate.getFullYear()}-${endDate.getMonth()+1}-${endDate.getDate()}`
    }
    var postData = {
      noPager: true,
      page: {
        current: 1,
        size: 10
      },
      params: {
        companyCode: companyCode,
        startDate:startDate,
        fuzzItemName:fuzzItemName,
        endDate:endDate
      }
    };
    if (pager && pager.currentPage !== undefined) {
      postData.page.current = pager.currentPage
    }
    if (pager && pager.pageSize !== undefined) {
      postData.page.size = pager.pageSize
    }
    return $fetch.post("/crm/api/sp/items/list-items", postData);
  }

  updateForSaleBatch(id) {
    let postData;
    if(typeof id === 'object'){
      postData = id;
    } else {
      postData = [id];
    }
    return $fetch.post("/crm/api/sp/items/update-for-sale-batch", postData);
  }

  updateOffSaleBatch(id) {
    let postData;
    if(typeof id === 'object'){
      postData = id;
    } else {
      postData = [id];
    }
    return $fetch.post("/crm/api/sp/items/update-off-sale-batch", postData);
  }

  updateItemGroupBatch(idList,itemGroup) {
    let postData = {
      idList:idList,
      itemGroup:itemGroup
    };
    return $fetch.post("/crm/api/sp/items/update-item-group-batch", postData);
  }

  getItemInfo(id,companyCode) {
    let postData = {
      id:id,
      companyCode: companyCode
    };
    return $fetch.get("/crm/api/sp/items/get-item-info", {params:postData});
  }

  updateItem(data) {
    return $fetch.post("/crm/api/sp/items/update-item", data);
  }

  insertOrUpdateItem(data,signal) {
    let postData = {
        list:data,
        onlyInsert:signal
    };
    return $fetch.post("/crm/api/sp/items/insert-or-update", postData);
  }

  listUploadPics(data) {
    return $fetch.post("/crm/api/sp/items/list-upload-pics", data);
  }

  uploadPics(data,signal) {
    let postData = {
      list:data,
      onlyInsert:signal
    };
    return $fetch.post("/crm/api/sp/obj-pics/upload-pics", postData);
  }
}

export default new spApi;
