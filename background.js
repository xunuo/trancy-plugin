chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['index.js'],
      //function: executeScript,
    });
  });
  
// function executeScript() {
// }