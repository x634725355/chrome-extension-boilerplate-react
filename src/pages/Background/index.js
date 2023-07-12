import { POPUP_INIT, POPUP_SUBMIT } from './constant';

console.log('%c Line:2 🌮', 'color:#3f7cff', 'start');
const state = {
  open: false,
  options: [
    {
      url: '',
      open: false,
      method: 'get',
      key: +new Date(),
    },
  ],
};

chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  // handle message from PopUp
  console.log('%c Line:9 🧀', 'color:#2eafb0', data, state);

  switch (data.type) {
    case POPUP_INIT:
      chrome.runtime.sendMessage({
        type: POPUP_INIT,
        ...state,
      });
      break;
    case POPUP_SUBMIT:
      if (typeof data.open === 'boolean') {
        state.open = data.open;
      }
      if (data.options) {
        state.options = data.options;
      }
      break;
    default:
      break;
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const { initiator, url, method } = details;
    let result = {};
    if (!state.open) {
      return result;
    }
    // 根据需要进行请求拦截的逻辑处理
    if (details.url.includes('example.com')) {
      // 取消请求
      return { cancel: true };
    }

    const urlMethodArr = state.options.map(
      (p) => `${initiator}${p.url}-${p.method}`
    );

    console.log('%c Line:57 🍅', 'color:#ffdd4d', urlMethodArr);

    if (urlMethodArr.includes(`${url}-${method}`)) {
      result.redirectUrl = url.replace(
        initiator,
        'http://127.0.0.1:4523/m1/2829907-0-default'
      );
      return result;
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
