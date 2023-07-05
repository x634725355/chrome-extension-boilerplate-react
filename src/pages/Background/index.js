console.log('This is the background page.');
console.log('Put the background scripts here.');

console.log('%c Line:4 🥥', 'color:#42b983');
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    const { initiator, url } = details;
    let result = {};
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
