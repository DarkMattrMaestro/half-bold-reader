var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
function isLetter(char) {
    return char.toLowerCase() != char.toUpperCase();
}
function recursiveModifyText(element) {
    if (element.nodeType === 3) {
        element;
        var text = element.textContent;
        if (text === null || text.length === 0) {
            return;
        }
        console.log(element);
        var indices = [0];
        for (var i = 0; i < text.length; i++) {
            if (!isLetter(text[i])) {
                indices.push(i + 1);
            }
        }
        indices.push(text.length);
        //console.log(text)
        //console.log(indices)
        //var newHTML = ""
        for (var i = 1; i < indices.length; i++) {
            if (indices[i] - indices[i - 1] <= 1) {
                continue;
            }
            if (text.startsWith("From")) {
                console.log(indices[i - 1] + " -> " + indices[i]);
                console.log(text.substring(indices[i - 1], indices[i]));
                console.log(indices);
            }
            var boldNode = document.createElement("b");
            boldNode.textContent = text.substring(indices[i - 1], (indices[i] + indices[i - 1]) / 2);
            element.parentNode.insertBefore(boldNode, element);
            var textNode = document.createTextNode(text.substring((indices[i] + indices[i - 1]) / 2, indices[i]));
            //textNode.textContent = text.substring((indices[i] + indices[i-1]) / 2, indices[i]);
            element.parentNode.insertBefore(textNode, element);
            //newHTML += "<b>" + text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2) + "</b>";
            //newHTML += text.substring((indices[i] + indices[i-1]) / 2, indices[i]);
        }
        //element.parentNode!.insertBefore(newNode, element);
        //newNode.innerHTML = newHTML;
        element.remove();
    }
    var children = __spreadArray([], element.childNodes, true);
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var subElement = children_1[_i];
        recursiveModifyText(subElement);
    }
}
recursiveModifyText(document.body);
