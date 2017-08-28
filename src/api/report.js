/**
 * Created by leirensheng on 2017/8/17.
 */
/**
 * Created by Dragon on 17/4/13.
 */

import supports from 'supports'
const $fetch = supports.$fetch;


class reportApi{

  getReport(data){
    return $fetch.download("/crm/api/dc/common-rpt/download/report-gateway-sync", data);
  }
}

export default new reportApi;
