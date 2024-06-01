"use strict";
function initiateModification() {
    const boldElements = document.getElementsByTagName("b");
    var i = boldElements.length;
    while (i >= 0) {
        i--;
        if (!boldElements[i]) {
            continue;
        }
        boldElements[i].outerHTML = boldElements[i].innerHTML;
    }
    TextNodeTreeWalker();
}
initiateModification();
//# sourceMappingURL=initiate-modification.js.map