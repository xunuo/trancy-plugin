// const script = document.createElement('script');
// script.src = chrome.runtime.getURL('injectedScript.js');
// setTimeout(function(){
//     console.log(netfix);
// },1000);
// (document.head || document.documentElement).appendChild(script);
// script.onload = function() {
//   script.remove();
// };



var script = document.createElement('script');
script.textContent = `
    (function() {
        // 这里的代码将运行在页面的上下文中，可以访问页面的全局对象
        console.log(121212121212);
    })();
`;
(document.head || document.documentElement).appendChild(script);
script.remove();