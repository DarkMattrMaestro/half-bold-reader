
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
  var selectedText = text.substring(realStartIndex, realEndIndex)

  let textNode;

  if (isBold) {
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

  var indices = [-1];
  for (var i=0; i < text.length; i++) {
    if (!isLetter(text[i])) { indices.push(i); }
  }
  indices.push(text.length);

  console.log("Indices:", indices)


  for (var i=0; i < indices.length - 1;) {
    const startIndex = indices[i] + 1
    const endIndex = indices[i+1]
    const iDiff = endIndex - startIndex;


    // Indices of key parts of the text
    let textPartIndices;
    
    const centerBold = startPercent < endPercent;
    if (centerBold) {
      textPartIndices = [
        Math.floor(startIndex), // Start of first plain-text
        Math.floor(startIndex + iDiff*startPercent), // End of first plain-text; Start of bold
        Math.floor(startIndex + iDiff*endPercent), // End of bold; Start of last plain-text
        Math.floor(endIndex) // End of last plain-text
      ]
    } else {
      textPartIndices = [
        Math.floor(startIndex), // Start of first bold
        Math.floor(startIndex + iDiff*endPercent), // End of first bold; Start of plain-text
        Math.floor(startIndex + iDiff*startPercent), // End of plain-text; Start of last bold
        Math.floor(endIndex) // End of last bold
      ]
    }

    // Add start plain-text component
    addTextElement(textPartIndices[0], textPartIndices[1], !centerBold, text, parentSpan);

    // Create bold part of text
    addTextElement(textPartIndices[1], textPartIndices[2], centerBold, text, parentSpan);

    // Add end plain-text component
    addTextElement(textPartIndices[2], textPartIndices[3], !centerBold, text, parentSpan);

    // Add all following sequential characters that are not meant to be bold as plain text

    var sequentialText = "";

    do {
      i++;
      sequentialText += text.charAt(indices[i]);
    } while (i < indices.length - 1 && indices[i + 1] - indices[i] <= 1);

    const endTextNode = document.createTextNode(sequentialText);
    parentSpan.appendChild(endTextNode);
  }
}
