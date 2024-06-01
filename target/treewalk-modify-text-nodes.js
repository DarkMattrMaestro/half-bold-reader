"use strict";
const IGNORED_TAGS = [
    "STYLE",
    "SCRIPT",
];
function TextNodeTreeWalker() {
    var _a, _b, _c;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    var textNodes = [];
    while (node = walker.nextNode()) {
        if (!((_a = node.nodeValue) === null || _a === void 0 ? void 0 : _a.replace(/\s/g, '').length) || IGNORED_TAGS.includes((_c = (_b = node.parentElement) === null || _b === void 0 ? void 0 : _b.tagName) !== null && _c !== void 0 ? _c : "")) {
            continue;
        }
        textNodes.push(node);
        modify(node);
    }
    for (var i = 0; i < textNodes.length; i++) {
        textNodes[i].remove();
    }
}
//# sourceMappingURL=treewalk-modify-text-nodes.js.map