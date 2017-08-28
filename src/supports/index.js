/**
 * Created by clude on 3/17/17.
 */

import http from './service/http';
import vx from './util/vx';

export default {
  $vx: vx,
  $fetch: http,

  install: function (Vue, options) {
    Vue.prototype.$fetch = http;
  }
}
