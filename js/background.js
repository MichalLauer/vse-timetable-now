// // background.js
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "callFunctionInContentScript") {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const activeTab = tabs[0];
//         chrome.scripting.executeScript({
//           target: { tabId: activeTab.id },
//           function: callFunctionInContentScript,
//           args: [message.param],
//         });
//       });
//     }
//   });
  
//   function callFunctionInContentScript(param) {
//     update_tt(param)
//   }
  