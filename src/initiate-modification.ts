


function initiateModification(): void {
  const boldElements = document.getElementsByTagName("b");

  var i = boldElements.length;
  while (i >= 0) {
    i--;

    if (!boldElements[i]) { continue; } // Guard clause

    boldElements[i].outerHTML = boldElements[i].innerHTML;
  }

  TextNodeTreeWalker();
}

initiateModification();