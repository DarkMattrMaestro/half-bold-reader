

function isLetter(char) {
  return char.toLowerCase() != char.toUpperCase()
}

var elements = document.getElementsByTagName("p");
elements = [...elements, ...document.getElementsByTagName("li")];

for (const element of elements) {
  const text = element.innerText;

  var indices = [0];
  for (var i=0; i < text.length; i++) {
    if (!isLetter(text[i])) { indices.push(i + 1); }
  }

  console.log(text)
  console.log(indices)

  var newHTML = ""


  for (var i=1; i < indices.length - 1; i++) {
    console.log(indices[i-1] + " -> " + indices[i] + " -> " + indices[i+1])

    newHTML += "<b>" + text.substring(indices[i-1], (indices[i] + indices[i-1]) / 2) + "</b>";
    newHTML += text.substring((indices[i] + indices[i-1]) / 2, indices[i]);
  }

  console.log(newHTML)
  element.innerHTML = newHTML;
}