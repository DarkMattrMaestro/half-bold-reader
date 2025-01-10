

let options: {
  startPercent: number,
  endPercent: number
} = {startPercent: 0, endPercent: 0.5};

chrome.management.onEnabled.addListener(() => {
  
});

// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.options?.newValue) {
    options = changes.options.newValue;
  }
});

// Initialize the form with the user's option settings
let data: { [key: string]: any; } = {  };
(async () => {
  try {
    data = await chrome.storage.sync.get("options");
  } catch (err) {
    console.error("Could not load user options!")
  }
})();
Object.assign(options, data.options);



// chrome.action.onClicked.addListener((tab) => {
//   chrome.scripting.executeScript({
//     target: {tabId: tab.id??0},
//     files: ["scripts/initiate-modification.js"]
//   });
// });

