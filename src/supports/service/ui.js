/**
 * Created by clude on 3/19/17.
 */

import spinnerGif from '../../assets/img/spinner/spinner.gif';
import loadingGif from '../../assets/img/spinner/loading_spinner.gif';

import '../libs/jquery/plugins/jquery.blockUI'

class UI {
  constructor() {
    // this.MainView = null;
  };

  showWaiting(selector, isShow, opts) {
    var messageHtml = "<img alt='Waiting..' src='" + spinnerGif + "' />";
    var defaultOpts = {
      message: messageHtml,
      css: {
        cursor: "default",
        border: 'none',
        opacity: 1,
        backgroundColor: 'transparent'
      },
      overlayCSS: { opacity: 0.1, backgroundColor: '#eee' },
      showOverlay: true,
      fadeIn: 0
    };
    var newOpts = jQuery.extend({}, defaultOpts, opts);
    // show full waiting
    if (selector == null) {
      if (isShow) {
        jQuery.blockUI(newOpts);
      } else {
        jQuery.unblockUI({ fadeOut: 0 });
      }
    } else {
      // show waiting on element
      // var selector = '#' + id;
      newOpts.css.top = '48%';
      newOpts.css.left = '48%';

      if (isShow) {
        jQuery(selector).block(newOpts);
      } else {
        jQuery(selector).unblock();
      }
    }
  };

  showDownLoadingWaiting(selector, isShow){
    var messageHtml = "<img alt='Waiting..' src='" + loadingGif +  "' width='50px' />";
    var defaultOpts = {
      message: messageHtml,
      css: {
        cursor: "default",
        border: 'none',
        opacity: 1,
        backgroundColor: 'transparent'
      },
      overlayCSS: { opacity: 0.3, backgroundColor: '#333' },
      showOverlay: true,
      fadeIn: 0
    };
    this.showWaiting(selector, isShow, defaultOpts);
  };

  showMessageAutoClose(message) {
    var opts = {
      message: message,
      css: {
        cursor: "default",
        border: '0px solid #2a2a2a',
        padding: '15px',
        width: '20%',
        left: '40%',
        opacity:.8,
        '-webkit-border-radius': '6px',
        '-moz-border-radius': '6px',
        'border-radius': '6px',
        color: '#fff',
        backgroundColor: '#555555',
        top: '150px'
      },
      overlayCSS: { opacity: 0.0, backgroundColor: '#eee' },
      showOverlay: true,
      fadeIn: 150,
      timeout: 800
    };

    this.showWaiting(null, true, opts);

  };

  showOverlay(selector, isShow, opts) {
    var opts = {
      message: "",
      css: {
        opacity:.0
      },
      overlayCSS: { opacity: 0.5, backgroundColor: '#fff' },
      showOverlay: true
    };

    this.showWaiting(selector, true, opts);

  };

  getMinContentHeight() {
    return $(window).height() - 50 - 230; // 50 is topbar height, 230 is footer height
  };

  getMinSummaryCount(summaryHeight, fixedHeight) {
    summaryHeight = summaryHeight || 115;  // default 115 = 100 height + 15 margin
    fixedHeight = fixedHeight || 120; // for directory page, it is about 120 height
    return Math.ceil((this.getMinContentHeight() - fixedHeight) / summaryHeight) + 2;
  }

  showLoading() { this.showWaiting(null, true) };
  hideLoading() { this.showWaiting(null, false) };
}

export default new UI;


