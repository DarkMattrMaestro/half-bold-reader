function getCurrentTab(callback: Function) {
  let queryOptions = { active: true, lastFocusedWindow: true };

  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) { console.error(chrome.runtime.lastError); }

    callback(tab);
  });
}