

// Check if a character is a letter, that is, a character with upper- and lower-case forms
function isLetter(char: string) {
  return char.toLowerCase() != char.toUpperCase()
}

function addTextElement(startIndex: number, endIndex: number, isBold: boolean, text: string, span: HTMLSpanElement) {
  if (Math.abs(endIndex - startIndex) < 1) { return; } // Ensure the is text to be added

  // Get ordered indices
  const realStartIndex = Math.min(startIndex, endIndex);
  const realEndIndex = Math.max(startIndex, endIndex);

  // Select the text
  var selectedText = text.substring(realStartIndex, realEndIndex);

  let textNode;

  // If it is the right order and should be bold, or the wrong order and should be plain-text, add bold text.
  if ((startIndex < endIndex) == (isBold)) {
    // Add bold element
    textNode = document.createElement("b");
    textNode.textContent = selectedText;
  } else {
    // Add plain-text element
    textNode = document.createTextNode(selectedText);
  }

  span.appendChild(textNode);

  return;
}

function modify(node: ChildNode, startPercent: number, endPercent: number) {
  if (!node.parentNode) { return; }

  // Create parent Span to prevent unwanted gaps between created text containers
  const parentSpan = document.createElement("span");
  node.parentNode.insertBefore(parentSpan, node);
  
  const text = node.textContent;
  if (text === null || text.length === 0) { return; }

  var indices = [0];
  for (var i=0; i < text.length; i++) {
    if (!isLetter(text[i])) { indices.push(i + 1); }
  }
  indices.push(text.length);


  for (var i=1; i < indices.length; i++) {
    const iDiff = indices[i] - indices[i-1];

    if (startPercent > endPercent) { console.error("END_PERCENT must be smaller than START_PERCENT! This is an error in the implementation in code; if you are a user, please report this as a bug."); }


    // Indices of key parts of the text
    const textPartIndices = [
      Math.floor(indices[i-1]), // Start of first plain-text
      Math.floor(indices[i-1] + iDiff*startPercent), // End of first plain-text; Start of bold
      Math.floor(indices[i-1] + iDiff*endPercent), // End of bold; Start of last plain-text
      Math.ceil(indices[i]) // End of last plain-text
    ]

    // Add start plain-text component
    addTextElement(textPartIndices[0], textPartIndices[1], false, text, parentSpan);

    // if (textPartIndices[0] < textPartIndices[1]) {
    //   var startPlainText = text.substring(textPartIndices[0], textPartIndices[1]); // Select the first plain subsection of the text
    //   if (startPlainText.length > 0) {
    //     const startTextNode = document.createTextNode(startPlainText);
    //     parentSpan.appendChild(startTextNode);
    //   }
    // }

    // Create bold part of text
    addTextElement(textPartIndices[1], textPartIndices[2], true, text, parentSpan);

    // if (textPartIndices[1] < textPartIndices[2]) {
    //   const boldText = text.substring(textPartIndices[1], textPartIndices[2]);
    //   if (boldText.length > 0) {
    //     const boldNode = document.createElement("b");
    //     boldNode.textContent = boldText;
    //     parentSpan.appendChild(boldNode);
    //   }
    // }

    // Add end plain-text component
    addTextElement(textPartIndices[2], textPartIndices[3], false, text, parentSpan);

    // if (textPartIndices[2] < textPartIndices[3]) {
    //   var endPlainText = text.substring(textPartIndices[2], textPartIndices[3]); // Select the first plain subsection of the text
    //   // if (endPlainText.length > 0) {
    //   //   const endTextNode = document.createTextNode(endPlainText);
    //   //   parentSpan.appendChild(endTextNode);
    //   // }

    //   const italicNode = document.createElement("i");
    //   italicNode.textContent = endPlainText;
    //   parentSpan.appendChild(italicNode);
    // }

    // Concatenate all following sequential characters that are not meant to be bold

    var sequentialText = "";

    while (i < indices.length - 1 && indices[i + 1] - indices[i] <= 1) {
      sequentialText += text.charAt(indices[i]);
      i++;
    }

    // sequentialText += text.charAt(indices[i + 1]);

    // Append the end plain text and sequential non-bold characters to the DOM
    const endTextNode = document.createTextNode(sequentialText);
    parentSpan.appendChild(endTextNode);
  }
}