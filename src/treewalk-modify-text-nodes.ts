


const IGNORED_TAGS = [
  "STYLE",
  "SCRIPT",
]


function TextNodeTreeWalker() { // https://stackoverflow.com/a/2579869/21416476
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
    modify(node as ChildNode);
  }

  for (var i = 0; i < textNodes.length; i++) {
    textNodes[i].remove();
  }
}