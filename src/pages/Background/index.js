import { POPUP_INIT, POPUP_SUBMIT } from './constant';

console.log('%c Line:2 🌮', 'color:#3f7cff', 'start');
const state = {
  open: false,
};

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  // handle message from PopUp
  console.log('%c Line:9 🧀', 'color:#2eafb0', data, state);

  switch (data.type) {
    case POPUP_INIT:
      chrome.runtime.sendMessage({
        type: POPUP_INIT,
        open: state.open,
      });
      break;
    case POPUP_SUBMIT:
      state.open = data.open;
      break;
    default:
      break;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const { initiator, url } = details;
    let result = {};
    if (!state.open) {
      return result;
    }
    // 根据需要进行请求拦截的逻辑处理
    if (details.url.includes('example.com')) {
      // 取消请求
      return { cancel: true };
    }
    if (
      details.url.indexOf(initiator + '/admin/invite/insertWhitePermission') !=
      -1
    ) {
      result.redirectUrl = url.replace(
        initiator,
        'http://127.0.0.1:4523/m1/2829907-0-default'
      );
      return result;
    }
    if (
      details.url.indexOf(initiator + '/api/sg/uoc/auth/queryResourceStatus') !=
      -1
    ) {
      result.redirectUrl = url.replace(
        initiator,
        'http://127.0.0.1:4523/m1/2829907-0-default'
      );
      return result;
    }
    // if (details.url.indexOf(initiator + '/admin/invite/getList') != -1) {
    //   result.redirectUrl = url.replace(initiator, "http://127.0.0.1:4523/m1/2829907-0-default")
    //   return result;
    // }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
