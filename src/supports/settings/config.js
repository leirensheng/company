/**
 * Created by clude on 1/8/16.
 */

var config_prd = {
  showDemo: false,
  SHORT_DOMAIN: 'http://wx.yoorstore.com'
}

var config_dev = {
  showDemo: true,
  SHORT_DOMAIN: 'http://127.0.0.1:3000'
}

var config_uat = {
  showDemo: false,
  SHORT_DOMAIN: 'http://qa.wx.yoorstore.com'
}


let conf = {};
if (process.env.NODE_ENV === 'production') {
  if (process.env.YS_ENV === 'uat') {
    conf = config_uat;
  } else {
    conf = config_prd;
  }
} else {
  conf = config_dev;
}
export default conf;
//module.exports = config;
