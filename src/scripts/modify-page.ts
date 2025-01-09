
const START_PERCENT = 0.0;
const END_PERCENT = 0.5;


function isLetter(char: string) {
  return char.toLowerCase() != char.toUpperCase()
}



function modify(node: ChildNode) {
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

    if (START_PERCENT > END_PERCENT) { console.error("END_PERCENT must be smaller than START_PERCENT! This is an error in the implementation in code; if you are a user, please report this as a bug."); }


    // Indices of key parts of the text
    const textPartIndices = [
      Math.floor(indices[i-1]), // Start of first plain-text
      Math.floor(indices[i-1] + iDiff*START_PERCENT), // End of first plain-text; Start of bold
      Math.floor(indices[i-1] + iDiff*END_PERCENT), // End of bold; Start of last plain-text
      Math.ceil(indices[i]) // End of last plain-text
    ]

    // Add start plain-text component

    var startPlainText = text.substring(textPartIndices[0], textPartIndices[1]); // Select the first plain subsection of the text
    if (startPlainText.length > 0) {
      const startTextNode = document.createTextNode(startPlainText);
      parentSpan.appendChild(startTextNode);
    }

    // Create bold part of text

    const boldText = text.substring(textPartIndices[1], textPartIndices[2]);
    if (boldText.length > 0) {
      const boldNode = document.createElement("b");
      boldNode.textContent = text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2);
      boldNode.textContent = boldText;
      parentSpan.appendChild(boldNode);
    }

    // Add end plain-text component

    var endPlainText = text.substring(textPartIndices[2], textPartIndices[3]); // Select the first plain subsection of the text
    // if (endPlainText.length > 0) {
    //   const endTextNode = document.createTextNode(endPlainText);
    //   parentSpan.appendChild(endTextNode);
    // }

    // Concatenate all following sequential characters that are not meant to be bold

    var sequentialText = text.substring((indices[i] + indices[i-1]) / 2, indices[i]);

    while (i < indices.length && indices[i + 1] - indices[i] <= 1) {
      i++;
      sequentialText += text.charAt(indices[i]);
    }

    // Append the end plain text and sequential non-bold characters to the DOM
    const endTextNode = document.createTextNode(endPlainText + sequentialText);
    parentSpan.appendChild(endTextNode);
  }
}
