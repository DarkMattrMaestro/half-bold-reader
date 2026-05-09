
/// <reference path="./constants.ts">


// Check if a character is a letter, that is, a character with upper- and lower-case forms
function isLetter(char: string) {
  return char.toLowerCase() != char.toUpperCase()
}

// function addTextElement(startIndex: number, endIndex: number, isStyled: boolean, style: TextEffectTypes, text: string, span: HTMLElement): HTMLElement | Text | undefined {
//   if (Math.abs(endIndex - startIndex) < 1) { return; } // Ensure the is text to be added

//   // Get ordered indices
//   const realStartIndex = Math.min(startIndex, endIndex);
//   const realEndIndex = Math.max(startIndex, endIndex);

//   // Select the text
//   var selectedText = text.substring(realStartIndex, realEndIndex)

//   let textNode: HTMLElement | Text;

//   if (isStyled) {
//     // Add styled element
//     switch (style) {
//       case TextEffectTypes.bold: {
//         textNode = document.createElement("b");
//         break;
//       }
//       case TextEffectTypes.italic: {
//         textNode = document.createElement("i");
//         break;
//       }
//     }
    
//     if (textNode != undefined) {
//       textNode.textContent = selectedText;
//     } else {
//       (textNode as HTMLElement).className = ADDED_ELEMENT_CLASSNAME;
//     }
//   } else {
//     // Add plain-text element
//     textNode = document.createTextNode(selectedText);
//   }

//   span.appendChild(textNode);

//   return textNode;
// }

function toIndex(textLength: number, value: number, unit: MeasurementUnits, isInclusive: boolean): number {
  let index: number;
  switch (unit) {
    case MeasurementUnits.characters: {
      index = value;
      // Compensate for inclusivity
      if (!isInclusive) { index--; }
      break;
    }
    case MeasurementUnits.percent: {
      // Convert percentage to index
      index = value / 100 * textLength;
      // Compensate for inclusivity
      index = isInclusive ? Math.ceil(index) : Math.floor(index);
      break;
    }
  }

  return index;
}

function modify(node: ChildNode, options: ModifierOptions) {
  if (!node.parentNode || !node.parentElement) { return; }

  // Create parent Span to prevent unwanted gaps between created text containers
  // const parentSpan = node.parentElement!;
  const parentSpan = document.createElement("span");
  parentSpan.className = ADDED_ELEMENT_CLASSNAME
  node.parentNode.insertBefore(parentSpan, node);
  
  const text = node.textContent;
  if (text === null || text.length === 0) { return; }

  var indices = [-1];
  for (var i=0; i < text.length; i++) {
    if (!isLetter(text[i])) { indices.push(i); }
  }
  indices.push(text.length);

  console.log("Indices:", indices);


  for (var i=0; i < indices.length - 1;) {
    const sectionStartIndex = indices[i] + 1
    const sectionEndIndex = indices[i+1]
    const textLength = Math.abs(sectionEndIndex - sectionStartIndex);


    // console.log(`${sectionStartIndex} to ${sectionEndIndex}: "${text.substring(sectionStartIndex, sectionEndIndex)}" -> ${!isLetter(text.substring(sectionStartIndex, sectionEndIndex))}`)
    // // Add unstyled plaintext
    // if (i < indices.length - 1 && indices[i + 1] - indices[i] <= 1) {
    //   preSequentialText += text.charAt(indices[i]);
    //   i++;
    //   continue;
    // }

    // if (preSequentialText.length > 0) {
    //   const endTextNode = document.createTextNode(preSequentialText);
    //   parentSpan.appendChild(endTextNode);
    //   sequentialText = "";
    // }


    if (sectionStartIndex != sectionEndIndex) {


      var regionBoundariesSet = new Set([sectionStartIndex, sectionEndIndex]);
      var regionBoundaries: {[key: number]: {[effect in TextEffectTypes]?: number}} = {
        [sectionStartIndex]: {},
        [sectionEndIndex]: {}
      };
      for (let option of options.modifiers) {
        let startIndex = sectionStartIndex + toIndex(textLength, option.start.value, option.start.unit, option.start.isInclusive);
        let endIndex = sectionStartIndex + toIndex(textLength, option.end.value, option.end.unit, option.end.isInclusive);
        startIndex = Math.min(Math.max(sectionStartIndex, startIndex), sectionEndIndex)
        endIndex = Math.min(Math.max(sectionStartIndex, endIndex), sectionEndIndex)

        // Add start region boundary
        if (startIndex in regionBoundaries) {
          if (option.effect in regionBoundaries[startIndex]) {
            regionBoundaries[startIndex][option.effect]!++;
          } else {
            regionBoundaries[startIndex][option.effect] = 1;
          }
        } else {
          regionBoundaries[startIndex] = {[option.effect]: 1};
        }
        regionBoundariesSet.add(startIndex);

        // Add end region boundary
        if (endIndex in regionBoundaries) {
          if (option.effect in regionBoundaries[endIndex]) {
            regionBoundaries[endIndex][option.effect]!--;
          } else {
            regionBoundaries[endIndex][option.effect] = -1;
          }
        } else {
          regionBoundaries[endIndex] = {[option.effect]: -1};
        }
        regionBoundariesSet.add(endIndex);
      }

      // console.log("regionBoundaries: ", regionBoundaries)

      const sortedBoundaryList = [...regionBoundariesSet].sort((a, b) => a - b)
      // console.log("\nregionBoundariesSet: ", regionBoundariesSet)
      console.log("sorted regionBoundariesSet: ", sortedBoundaryList)
      
      let tally: {[effect in TextEffectTypes]: number} = Object.fromEntries(Object.values(TextEffectTypes).map((value)=> ([value, 0]) )) as {[effect in TextEffectTypes]: number}
      // console.log("\nregionBoundaries: ", regionBoundaries)
      // console.log("sortedBoundaryList: ", sortedBoundaryList)
      for (let i = 0; i < sortedBoundaryList.length - 1; i++) {
        const regionBoundary = sortedBoundaryList[i];
        let currParentElement: HTMLElement | Text = parentSpan;
        for (const possibleEffectName in TextEffectTypes) {
          const possibleEffect: TextEffectTypes = TextEffectTypes[possibleEffectName as keyof typeof TextEffectTypes];
          console.log(`regionBoundaries[${regionBoundary}]: `, regionBoundaries[regionBoundary])
          console.log(`regionBoundaries[${regionBoundary}][${possibleEffect}]: `, regionBoundaries[regionBoundary][possibleEffect]??0)
          tally[possibleEffect] += regionBoundaries[regionBoundary][possibleEffect]??0;
          if (tally[possibleEffect] > 0) {
            const subEffectElement = document.createElement(possibleEffect);
            subEffectElement.className = ADDED_ELEMENT_CLASSNAME;
            currParentElement.appendChild(subEffectElement);
            currParentElement = subEffectElement
          }
        }
        console.log("tally: ", tally)

        if (currParentElement.isEqualNode(parentSpan)) {
          // if (lastElemAdded != null && (lastElemAdded as HTMLElement).tagName.toLowerCase() == "span") {
          //   // Join plaintext to previous p element, if it directly precedes the new text
          //   currParentElement = lastElemAdded;
          // } else {
            // Create new span element
            const pElement = document.createElement("span");
            pElement.className = ADDED_ELEMENT_CLASSNAME;
            currParentElement.appendChild(pElement);
            currParentElement = pElement
          // }

          // const textNode = document.createTextNode("");
          // currParentElement.appendChild(textNode);
          // currParentElement = textNode;
        }

        // console.log("currParentElement: ", currParentElement)
        // console.log("from ", regionBoundary, " to ", sortedBoundaryList[i + 1])
        // console.log("text to add: ", text.substring(regionBoundary, sortedBoundaryList[i + 1]))
        currParentElement.textContent = text.substring(regionBoundary, sortedBoundaryList[i + 1])
        console.log(currParentElement)
      }
    }
    


    // // Indices of key parts of the text
    // let textPartIndices;
    
    // const centerBold = startPercent < endPercent;
    // if (centerBold) {
    //   textPartIndices = [
    //     Math.floor(startIndex), // Start of first plain-text
    //     Math.floor(startIndex + iDiff*startPercent), // End of first plain-text; Start of bold
    //     Math.floor(startIndex + iDiff*endPercent), // End of bold; Start of last plain-text
    //     Math.floor(endIndex) // End of last plain-text
    //   ]
    // } else {
    //   textPartIndices = [
    //     Math.floor(startIndex), // Start of first bold
    //     Math.floor(startIndex + iDiff*endPercent), // End of first bold; Start of plain-text
    //     Math.floor(startIndex + iDiff*startPercent), // End of plain-text; Start of last bold
    //     Math.floor(endIndex) // End of last bold
    //   ]
    // }

    // // Add start plain-text component
    // addTextElement(textPartIndices[0], textPartIndices[1], !centerBold, text, parentSpan);

    // // Create bold part of text
    // addTextElement(textPartIndices[1], textPartIndices[2], centerBold, text, parentSpan);

    // // Add end plain-text component
    // addTextElement(textPartIndices[2], textPartIndices[3], !centerBold, text, parentSpan);

    // // Add all following sequential characters that are not meant to be bold as plain text

    var sequentialText = "";

    do {
      i++;
      sequentialText += text.charAt(indices[i]);
    } while (i < indices.length - 1 && indices[i + 1] - indices[i] <= 1);

    const endTextNode = document.createTextNode(sequentialText);
    parentSpan.appendChild(endTextNode);
  }
}















function TextNodeTreeWalker(options: ModifierOptions) { // https://stackoverflow.com/a/2579869/21416476
  const IGNORED_TAGS = [
    "STYLE",
    "SCRIPT",
  ]

  var walker = document.createTreeWalker(
      document.body, 
      NodeFilter.SHOW_TEXT, 
      null
  );

  var node: Node | null;
  var textNodes: ChildNode[] = [];

  while(node = walker.nextNode()) {
    if (!node.nodeValue?.replace(/\s/g, '').length || IGNORED_TAGS.includes(node.parentElement?.tagName??"")) {
      continue;
    }
    textNodes.push(node as ChildNode);

    // console.log("Content: ", (node as ChildNode).textContent??"");
    // (node as ChildNode).parentElement!.textContent += (node as ChildNode).textContent??"";
    
    console.log("\nModifying node: ", node)
    
    modify(node as ChildNode, options);
    // (node as ChildNode).remove();
  }

  for (var i = 0; i < textNodes.length; i++) {
    textNodes[i].remove();
  }
}








function initiateModification(): void {
  console.log("Default Options: ", DEFAULT_OPTIONS)

  chrome.storage.sync.get("options", function(data) { // Get options
    let options: ModifierOptions = data.options;
    if (options == undefined) {
      chrome.storage.sync.set({ "options": DEFAULT_OPTIONS })
      options = DEFAULT_OPTIONS
    }
    console.log("Found options:")
    console.log(options)
    console.log("\n\n\n\n")
    
    // Remove elements added in previous processing attempts
    for (let element of Array.from(document.getElementsByClassName(ADDED_ELEMENT_CLASSNAME))) {
      element.outerHTML = element.innerHTML;
    }
    console.log("Removed previously added nodes.")

    // Remove text effects
    const ELEM_TAGS = ["b", "i"]
    for (const elemTag of ELEM_TAGS) {
      for (let element of Array.from(document.getElementsByTagName(elemTag))) {
        element.outerHTML = element.innerHTML;
      }
    }
    console.log("Removed styled nodes.")

    TextNodeTreeWalker(options);

    console.log("Finished emboldening page!")
  })
}

initiateModification();