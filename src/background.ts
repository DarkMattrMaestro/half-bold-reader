chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id??0},
    files: ["scripts/initiate-modification.js"]
  });
});


// function setDebugMode() { /* ... */ }

// // Watch for changes to the user's options & apply them
// chrome.storage.onChanged.addListener((changes, area) => {
//   if (area === 'sync' && changes.options?.newValue) {
//     const startPercent = Number(changes.options.newValue.startPercent);
//     console.log('enable debug mode?', startPercent);
//     setDebugMode(debugMode);
//   }
// });