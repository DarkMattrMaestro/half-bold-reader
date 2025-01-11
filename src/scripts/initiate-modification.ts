
function initiateModification(): void {
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