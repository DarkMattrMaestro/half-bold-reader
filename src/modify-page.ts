

function isLetter(char: string) {
  return char.toLowerCase() != char.toUpperCase()
}



function modify(node: ChildNode) {
  if (!node.parentNode) { return; }
  
  const text = node.textContent;
  if (text === null || text.length === 0) { return; }

  var indices = [0];
  for (var i=0; i < text.length; i++) {
    if (!isLetter(text[i])) { indices.push(i + 1); }
  }
  indices.push(text.length);


  for (var i=1; i < indices.length; i++) {
    const boldText = text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2);
    if (boldText.length > 0) {
      const boldNode = document.createElement("b");
      boldNode.textContent = text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2);
      node.parentNode.insertBefore(boldNode, node);
    }

    var newText = text.substring((indices[i] + indices[i-1]) / 2, indices[i])
    while (i < indices.length && indices[i + 1] - indices[i] <= 1) {
      i++;
      newText += text.substring((indices[i] + indices[i-1]) / 2, indices[i])
    }

    const textNode = document.createTextNode(newText)

    if (node.parentNode) {
      node.parentNode.insertBefore(textNode, node);
    }
  }
}
