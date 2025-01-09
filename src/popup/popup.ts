

// In-page cache of the user's options
const options: {
  startPercent: Number,
  endPercent: Number
} = {startPercent: 0, endPercent: 0};
const optionsForm = document.getElementById("optionsForm");

// Immediately persist options changes
(optionsForm as HTMLFormElement).startPercent.addEventListener("change", (event: Event) => {
  options.startPercent = Number((event.target as HTMLInputElement).value);
  chrome.storage.sync.set({ options });
});

// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);
(optionsForm as HTMLFormElement).startPercent.value = options.startPercent;



const emboldenBtn = document.getElementById("emboldenBtn");
if (emboldenBtn) {
  emboldenBtn.onclick = function() {
    console.log("Make text bold") // TODO: connect to initiate-modification.js
    getCurrentTab((tab: any) => {
      chrome.scripting.executeScript({
        target: {tabId: tab.id??0},
        files: ["scripts/initiate-modification.js"]
      });
    })
  };
}

export { };
