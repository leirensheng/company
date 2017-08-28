/**
 * Created by clude on 3/16/17.
 */
'use strict';

import axiosDefault from 'axios';

var axios = axiosDefault.create();

import NProgress from 'nprogress'

import {$listener, LSN} from './events';

import '../libs/jquery/plugins/jquery.fileDownload'

var _ = require('underscore');
// var config = require('../../settings/config');
// var $log = require('../log');

axios.defaults.timeout = 30000;

var MAX_RETRIEVE_COUNT = 3;

// import { Message } from 'element-ui';
// var $ui = require('./ui');
import $ui from './ui';

//just do nothing
var noop = () => {};

var $httpHelper = {
  wrapHostForUrl(url) {
    // return ( url.indexOf('/') == 0 )? config.api.host + url : url;
    return url;
  },

  setDefaultHeaders(options) {
    var defaultHeader = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-Requested-By': 'crm',
      'Accept-Language': 'zh-CN'
      // 'X-Requested-By': 'VueClient'
      //'X-MobileAPI-SessionToken': null,
      //'X-CSRF-Token': null,
      //'X-Basebit-UserId': null,
      //'Accept-Language': 'zh-CN'

    }

    if (options.method && options.method.toLowerCase() != 'get') {
      options.headers = options.headers || {};
      options.headers['Accept'] =  options.headers['Accept'] || 'application/json';
      options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';
    }
    options.headers = _.extend(defaultHeader, options.headers);
    options.credentials = 'same-origin';  // 保证传送cookie
    return options;
  },

  setAuthorizationHeader(options) {
    options.headers = options.headers || {};
    return options;
  },

  setDefaultBody(options) {
    if (options.method && options.method.toLowerCase() != 'get') {
      options.body = options.body || {};
      if (options.headers['Content-Type'].toLowerCase() == 'application/json') {
        options.body = JSON.stringify(options.body);
      }
    }
    return options;
  },

  paramify(obj) {
    var str = '';
    for (var key in obj) {
      if (str != '') {
        str += '&';
      }
      str += key + '=' + obj[key];
    }
    return str;
  }
};


class Http {

  status(response) {
    //console.log(response)
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
    }else if(response.status == 404){
      throw 'Api not found'
    }
    throw response;
  };
  //
  // json(response) {
  //   return response.json();  //attention: response.json() returns a promise but not a json object
  // };

  request(options) {

    // console.log(options)
    // $log.debug('$http start ', url, options.body);
    options = options ? options : {};
    options.retrieveCount = (options.retrieveCount || 0) + 1;
    options.showLoading = (options.showLoading == null)?true:options.showLoading;
    options.skipToken = options.skipToken || false;
    options.skipUser = options.skipUser || false;
    options = $httpHelper.setDefaultHeaders(options);
    options = $httpHelper.setDefaultBody(options);

    var url = $httpHelper.wrapHostForUrl(options.url);

    return new Promise((resolve, reject) =>{
      resolve = resolve || noop;
      reject = reject || noop;

      options = $httpHelper.setAuthorizationHeader(options);

      if(options.showLoading){
        NProgress.start();
        $ui.showLoading();
      }
      axios.request(options)
        // .then(this.status)
        .then((result) => {
          if(options.showLoading){
            NProgress.done();
            $ui.hideLoading();
          }
          // return resolve(result);
          if(result.status == 200){
            var rspData = result.data;
            if(rspData.errcode != window.undefined && rspData.errcode != null){
              if(rspData.errcode == 0){
                resolve(rspData);
              }else{
                if(_.contains([990,991,999, 901], rspData.errcode)){
                  // $cookie.clear();
                  $listener.$emit(LSN.SESSION_EXPIRED, result.data);
                  //return;
                  reject(rspData);
                  //throw(LSN.SESSION_EXPIRED);
                }
                reject(rspData);
              }
            }else{
              resolve(rspData)
            }

          }
        })
        .catch((error) => {
          if(options.showLoading){
            NProgress.done();
            $ui.hideLoading();
          }

          // console.log(JSON.stringify(error));

          let rsp = error.response;
          if(rsp){
            if(rsp.data && rsp.data.message){
              return reject(rsp.data);
            }else{
              return reject({errcode: error.errcode, message:error.statusText});
            }
          }

          if(error.code && error.code == "ECONNABORTED"){
            return reject({errcode: error.code, message:"连接超时"}); //TBD
          }


          let err = error.data ? error.data : error;
          return reject({errcode: error.errcode, message:JSON.stringify(err)});
        });
    })
  };

  get(url, options) {
    options = options ? options : {};
    options.method = 'GET';
    options.url = url;

    // if (params) {
    //   var getParams = $httpHelper.paramify(params);
    //   url += `?${getParams}`;
    // }

    // options.params = params;

    return this.request(options);
  };

  post(url, data, options) {
    options = options ? options : {};
    options.method = 'POST';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  put(url, data, options) {
    options = options ? options : {};
    options.method = 'PUT';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  patch(url, data, options) {
    options = options ? options : {};
    options.method = 'PATCH';
    options.url = url;
    options.data = data;
    return this.request(options);
  };

  delete(url, options) {
    options = options ? options : {};
    options.method = 'DELETE';
    options.url = url;
    return this.request(options);
  };

  postForm(url, data, options) {
    options = options ? options : {};
    options.method = 'POST';
    options.headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    options.url = url;
    options.data = $httpHelper.paramify(data);
    return this.request(options);
  };

  download(url, data, options) {
    var _showLoading = (options, isShow) => {
      if(options.showLoading){
        if(isShow){
          $ui.showDownLoadingWaiting(null, true);
        } else {
          $ui.showDownLoadingWaiting(null, false);
        }
      }
    }

    try{
      options = options || {showLoading: true};
      var input_name = options.key || "download_param";

      _showLoading(options, true);

      var filePostData = {};
      filePostData[input_name] = JSON.stringify(data);
      $.fileDownload(url, {
        httpMethod: "POST",
        data: filePostData,
        successCallback: function(){
          _showLoading(options, false);
        },
        abortCallback: function(){
          _showLoading(options, false);
        },
        failCallback: function(){
          _showLoading(options, false);
        }
      });
    }catch (e){
      console.log(e)
      _showLoading(options, false);
    }
  }

};

export default new Http;

// export default {
//   install: function (Vue, options) {
//     Vue.prototype.$fetch = new Http;
//   }
// }

