


function isLetter(char: string) {
  return char.toLowerCase() != char.toUpperCase()
}





function recursiveModifyText(element: HTMLElement | ChildNode) {
  if (element.nodeType === 3) {
    element as ChildNode;



    const text = element.textContent;
    if (text === null || text.length === 0) { return; }

    console.log(element)

    var indices = [0];
    for (var i=0; i < text.length; i++) {
      if (!isLetter(text[i])) { indices.push(i + 1); }
    }
    indices.push(text.length);
  
    //console.log(text)
    //console.log(indices)
  
    //var newHTML = ""
  
  
    for (var i=1; i < indices.length; i++) {
      if (indices[i] - indices[i - 1] <= 1) { continue; }

      if (text!.startsWith("From")) {
        console.log(indices[i-1] + " -> " + indices[i])
        console.log(text.substring(indices[i-1], indices[i]))
        console.log(indices)
      }

      const boldNode = document.createElement("b");
      boldNode.textContent = text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2);
      element.parentNode!.insertBefore(boldNode, element);
  
      const textNode = document.createTextNode(text.substring((indices[i] + indices[i-1]) / 2, indices[i]))
      //textNode.textContent = text.substring((indices[i] + indices[i-1]) / 2, indices[i]);
      element.parentNode!.insertBefore(textNode, element);

      //newHTML += "<b>" + text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2) + "</b>";
      //newHTML += text.substring((indices[i] + indices[i-1]) / 2, indices[i]);
    }
  
    
    
    //element.parentNode!.insertBefore(newNode, element);
    //newNode.innerHTML = newHTML;
    element.remove();
  }



  const children: ChildNode[] = [...element.childNodes]
  for (const subElement of children) {
    recursiveModifyText(subElement)
  }
}

recursiveModifyText(document.body);