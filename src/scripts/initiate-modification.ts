
function initiateModification(): void {
  chrome.storage.sync.set({ "options": DEFAULT_OPTIONS })

  chrome.storage.sync.get("options", function(data) { // Get options
    const options: ModifierOptions = data.options;
    console.log("Found:")
    console.log(options)

    const boldElements = document.getElementsByTagName("b");

    var i = boldElements.length;
    while (i >= 0) {
      i--;

      if (!boldElements[i]) { continue; } // Guard clause

      boldElements[i].outerHTML = boldElements[i].innerHTML;
    }

    TextNodeTreeWalker(options.modifiers[0].start / 100 as number, options.modifiers[0].end / 100 as number);

    console.log("Finished emboldening page!")
  })
}

initiateModification();