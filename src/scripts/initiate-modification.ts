
function initiateModification(): void {
  // Initialize the form with the user's option settings
  let data: { [key: string]: any; } = {  };
  (async () => {
    try {
      data = await chrome.storage.sync.get("options");
    } catch (err) {
      console.error("Could not load user options!")
    }
  })();
  const options = data.options;

  const boldElements = document.getElementsByTagName("b");

  var i = boldElements.length;
  while (i >= 0) {
    i--;

    if (!boldElements[i]) { continue; } // Guard clause

    boldElements[i].outerHTML = boldElements[i].innerHTML;
  }

  TextNodeTreeWalker(options.startPercent??0, options.endPercent??0.5);
}

initiateModification();