/**
 * Created by clude on 3/25/17.
 */

import Vue from 'vue'




const LSN = {
  USER_SIGN_IN: 'LSN_USER_SIGN_IN',
  USER_SIGN_OUT: 'LSN_USER_SIGN_OUT',
  SESSION_EXPIRED: 'LSN_SESSION_EXPIRED',
  COMPANY_CHANGE: 'LSN_COMPANY_CHANGE'
};

let $listener = new Vue();

export {
  $listener, LSN
}
