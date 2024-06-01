"use strict";
chrome.action.onClicked.addListener((tab) => {
    var _a;
    chrome.scripting.executeScript({
        target: { tabId: (_a = tab.id) !== null && _a !== void 0 ? _a : 0 },
        files: ["target/initiate-modification.js"]
    });
});
//# sourceMappingURL=background.js.map