chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id??0},
    files: ["target/initiate-modification.js"]
  });
});