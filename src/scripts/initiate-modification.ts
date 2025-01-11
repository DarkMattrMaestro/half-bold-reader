
function initiateModification(): void {
  // // Initialize the form with the user's option settings
  // let options: {
  //   startPercent: number,
  //   endPercent: number
  // } = DEFAULT_OPTIONS;
  // let data: {
  //   [key: string]: {
  //     startPercent: number,
  //     endPercent: number
  //   }
  // } = {  };
  // (async () => {
  //   try {
  //     data = await chrome.storage.sync.get("options");
  //   } catch (err) {
  //     console.error("Could not load user options!")
  //   }
  // })();
  // Object.assign(options, data.options);

  chrome.storage.sync.get("options", function(data) { // Get options
    const options = data.options;
    console.log("Found:")
    console.log(options)

    const boldElements = document.getElementsByTagName("b");

    var i = boldElements.length;
    while (i >= 0) {
      i--;

      if (!boldElements[i]) { continue; } // Guard clause

      boldElements[i].outerHTML = boldElements[i].innerHTML;
    }

    TextNodeTreeWalker(options.startPercent as number, options.endPercent as number);

    console.log("Finished emboldening page!")
  })
}

initiateModification();