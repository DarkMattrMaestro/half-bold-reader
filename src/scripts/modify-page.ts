
// // Check if a character is a letter, that is, a character with upper- and lower-case forms
// function isLetter(char: string) {
//   return char.toLowerCase() != char.toUpperCase()
// }

// function addTextElement(startIndex: number, endIndex: number, isStyled: boolean, style: TextEffectTypes, text: string, span: HTMLSpanElement) {
//   if (Math.abs(endIndex - startIndex) < 1) { return; } // Ensure the is text to be added

//   // Get ordered indices
//   const realStartIndex = Math.min(startIndex, endIndex);
//   const realEndIndex = Math.max(startIndex, endIndex);

//   // Select the text
//   var selectedText = text.substring(realStartIndex, realEndIndex)

//   let textNode;

//   if (isStyled) {
//     // Add styled element
//     textNode = document.createElement("b");
//     textNode.textContent = selectedText;
//   } else {
//     // Add plain-text element
//     textNode = document.createTextNode(selectedText);
//   }

//   span.appendChild(textNode);

//   return;
// }

// function toIndex(textLength: number, value: number, unit: MeasurementUnits, isInclusive: boolean): number {
//   let index;
//   switch (unit) {
//     case MeasurementUnits.characters: {
//       index = value;
//       // Compensate for inclusivity
//       if (!isInclusive) { index--; }
//       break;
//     }
//     case MeasurementUnits.percent: {
//       // Convert percentage to index
//       index = value / 100 * textLength;
//       // Compensate for inclusivity
//       index = isInclusive ? Math.ceil(index) : Math.floor(index);
//       break;
//     }
//   }

//   return index;
// }

// function modify(node: ChildNode, options: ModifierOptions) {
//   if (!node.parentNode) { return; }

//   // Create parent Span to prevent unwanted gaps between created text containers
//   const parentSpan = document.createElement("span");
//   node.parentNode.insertBefore(parentSpan, node);
  
//   const text = node.textContent;
//   if (text === null || text.length === 0) { return; }

//   var indices = [-1];
//   for (var i=0; i < text.length; i++) {
//     if (!isLetter(text[i])) { indices.push(i); }
//   }
//   indices.push(text.length);

//   console.log("Indices:", indices);


//   for (var i=0; i < indices.length - 1;) {
//     const sectionStartIndex = indices[i] + 1
//     const sectionEndIndex = indices[i+1]
//     const textLength = sectionStartIndex - sectionEndIndex;


//     var regionBoundaries: {[key: number]: {[effect in TextEffectTypes]?: number}} = {
//       0: {},
//       [text.length]: {}
//     };
//     for (let option of options.modifiers) {
//       let startIndex = toIndex(textLength, option.start.value, option.start.unit, option.start.isInclusive);
//       let endIndex = toIndex(textLength, option.end.value, option.end.unit, option.end.isInclusive);

//       // Add start region boundary
//       if (startIndex in regionBoundaries) {
//         if (option.effect in regionBoundaries[startIndex]) {
//           regionBoundaries[startIndex][option.effect]!++;
//         } else {
//           regionBoundaries[startIndex][option.effect] = 1;
//         }
//       } else {
//         regionBoundaries[startIndex] = {[option.effect]: 1};
//       }

//       // Add end region boundary
//       if (endIndex in regionBoundaries) {
//         if (option.effect in regionBoundaries[endIndex]) {
//           regionBoundaries[endIndex][option.effect]!--;
//         } else {
//           regionBoundaries[endIndex][option.effect] = -1;
//         }
//       } else {
//         regionBoundaries[endIndex] = {[option.effect]: -1};
//       }
//     }

//     console.log("regionBoundaries")
//     console.log(regionBoundaries)


//     // // Indices of key parts of the text
//     // let textPartIndices;
    
//     // const centerBold = startPercent < endPercent;
//     // if (centerBold) {
//     //   textPartIndices = [
//     //     Math.floor(startIndex), // Start of first plain-text
//     //     Math.floor(startIndex + iDiff*startPercent), // End of first plain-text; Start of bold
//     //     Math.floor(startIndex + iDiff*endPercent), // End of bold; Start of last plain-text
//     //     Math.floor(endIndex) // End of last plain-text
//     //   ]
//     // } else {
//     //   textPartIndices = [
//     //     Math.floor(startIndex), // Start of first bold
//     //     Math.floor(startIndex + iDiff*endPercent), // End of first bold; Start of plain-text
//     //     Math.floor(startIndex + iDiff*startPercent), // End of plain-text; Start of last bold
//     //     Math.floor(endIndex) // End of last bold
//     //   ]
//     // }

//     // // Add start plain-text component
//     // addTextElement(textPartIndices[0], textPartIndices[1], !centerBold, text, parentSpan);

//     // // Create bold part of text
//     // addTextElement(textPartIndices[1], textPartIndices[2], centerBold, text, parentSpan);

//     // // Add end plain-text component
//     // addTextElement(textPartIndices[2], textPartIndices[3], !centerBold, text, parentSpan);

//     // // Add all following sequential characters that are not meant to be bold as plain text

//     // var sequentialText = "";

//     // do {
//     //   i++;
//     //   sequentialText += text.charAt(indices[i]);
//     // } while (i < indices.length - 1 && indices[i + 1] - indices[i] <= 1);

//     // const endTextNode = document.createTextNode(sequentialText);
//     // parentSpan.appendChild(endTextNode);
//   }
// }
