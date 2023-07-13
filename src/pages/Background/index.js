import { POPUP_INIT, POPUP_SUBMIT } from './constant';

console.log('%c Line:2 🌮', 'color:#3f7cff', 'start');

const state = {
  open: false,
  initiator: '',
  options: [
    {
      url: '',
      open: false,
      method: 'GET',
      key: +new Date(),
    },
  ],
};

chrome.storage.local.get(['open', 'options'], (result) => {
  console.log('%c Line:17 🍌 result', 'color:#4fff4B', result);
  if (!result.open) {
    chrome.storage.local.set(state);
  } else {
    state.initiator = result.initiator;
    state.open = result.open;
    state.options = result.options;
  }
});

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
        chrome.storage.local.set({ open: data.open });
      }
      if (data.options) {
        state.options = data.options;
        chrome.storage.local.set({ options: data.options });
      }
      if (data.initiator) {
        state.options = data.initiator;
        chrome.storage.local.set({ initiator: data.initiator });
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

    if (urlMethodArr.includes(`${url}-${method}`)) {
      console.log('%c Line:57 🍅', 'color:#ffdd4d', urlMethodArr, method);
      result.redirectUrl = url.replace(
        initiator,
        initiator || 'http://127.0.0.1:4523/m1/2829907-0-default'
      );
      return result;
    }
  },
  { urls: ['<all_urls>'] },
  ['blocking']
);
