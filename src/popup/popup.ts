
function getCurrentTab(callback: Function) {
  let queryOptions = { active: true, lastFocusedWindow: true };

  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) { console.error(chrome.runtime.lastError); }

    callback(tab);
  });
}



function processEffectStage(msg: string, isDoneProcessing: boolean) {
  document.getElementById("effect-status-msg")!.textContent = msg;
  (document.querySelector(".loading-content") as HTMLElement).hidden = isDoneProcessing;
  (document.getElementById("embolden-btn") as HTMLButtonElement).disabled = !isDoneProcessing;
}

const emboldenBtn = document.getElementById("embolden-btn");
if (emboldenBtn) {
  emboldenBtn.onclick = function() {
    processEffectStage(`Applying modifiers...`, false);

    getCurrentTab((tab: any) => {
      chrome.tabs.sendMessage(
        tab.id??0,
        {from: 'popup', subject: 'startEffect'},
        () => { processEffectStage(`Last applied modifiers at ${(new Date()).toLocaleTimeString()}`, true); }
      )
    })
  }
}

function initializeEffectLoadingUI(res: {"msg": string, "isDoneProcessing": boolean}) {
  // console.log(res)
  processEffectStage(res["msg"], res["isDoneProcessing"]);
}

// Load from previous state
getCurrentTab((tab: any) => {
  processEffectStage(`Applying modifiers...`, false);

  chrome.tabs.sendMessage(
    tab.id??0,
    {from: 'popup', subject: 'queryStatus'},
    initializeEffectLoadingUI
  )
})



/////////////////////////////////

function optionChoices(realValue: any, enumType: any, useName: boolean = false, expression?: (realValue: any, value: any) => boolean) {
  let res = "";
  for (let value in enumType) {
    console.log(`Value: ${value}`);
    res += `<option ${(expression??(() => realValue == value))(realValue, value) ? "selected" : ""} value="${value}">${useName ? value : enumType[value as keyof typeof enumType]}</option>`
  };
  return res
}



function appendModifier(modifier: ModifierOption, index: number) {
  return `
  <div class="modifier-slot" data-index="${index}">
    <button type="button" class="modifier-removal-btn">
      <b class="arrow-btn">-</b>
    </button>

    <div class="modifier-content">
      <div class="modifier-options">
        <div class="option">
          <label for="effect">Effect:</label>
          <select class="effect" name="effect">
            ${optionChoices(modifier.effect, TextEffectTypes, true)}
          </select>
        </div>
        <div class="option">
          <label for="characters">Characters:</label>
          <select class="group-characters" name="characters" disabled>
            ${optionChoices(modifier.groupCharacters, CharacterSets)}
          </select>
        </div>
      </div>

      <div class="effect-range">
        <div class="amount" data-position="start">
          <input type="number" class="" aria-label="start" maxlength="4" size=2 value="${modifier.start.value}">
          <select class="unit">
            ${optionChoices(modifier.start.unit, MeasurementUnits)}
          </select>
        </div>
        <select class="is-inclusive" data-position="start">
          <option ${!modifier.start.isInclusive ? "selected" : ""}>&lt;</option>
          <option ${modifier.start.isInclusive ? "selected" : ""}>&le;</option>
        </select>
        
        Effected Text
        
        <select class="is-inclusive" data-position="end">
          <option ${!modifier.end.isInclusive ? "selected" : ""}>&lt;</option>
          <option ${modifier.end.isInclusive ? "selected" : ""}>&le;</option>
        </select>
        
        <div class="amount" data-position="end">
          <input type="number" class="unit" aria-label="end" maxlength="4" size=2 value="${modifier.end.value}">
          <select class="unit">
            ${optionChoices(modifier.end.unit, MeasurementUnits)}
          </select>
        </div>
      </div>
    </div>
  </div>
  `;
}

const hiddenSpan = document.createElement("span");
hiddenSpan.id = "hidden-span";
document.body.appendChild(hiddenSpan);

document.getElementById("add-btn")?.addEventListener("click", function(evt) { addDefaultModifier(); })

function getParentData(element: HTMLElement, dataName: string): string | null {
  let parent: HTMLElement = element;
  while (parent.getAttribute(dataName) == null && parent.parentElement != null) {
    console.log("getAttribute: ", parent.getAttribute(dataName), " ; parentElement: ", parent.parentElement)
    parent = parent.parentElement;
  }
  console.log("aaaaa  getAttribute: ", parent.getAttribute(dataName), " ; parentElement: ", parent.parentElement)
  return parent.getAttribute(dataName);
}

function getIndex(element: HTMLElement): number | null {
  const indexStr = getParentData(element, "data-index");
  if (indexStr == null) {
    return null;
  } else {
    return parseInt(indexStr, 10);
  }
}

function getPosition(element: HTMLElement): string | null {
  return getParentData(element, "data-position");
}

function loadOptionsList() {
  chrome.storage.sync.get("options", function(data) { // Get options
    let options: ModifierOptions = data.options;
    if (options === undefined) {
      chrome.storage.sync.set({ "options": DEFAULT_OPTIONS })
      options = DEFAULT_OPTIONS
    }


    let newInnerHTML = ""
    for (let i = 0; i < options.modifiers.length; i++) {
      newInnerHTML += appendModifier(options.modifiers[i], i);
    }
    document.querySelector("#modifiersList")!.innerHTML = newInnerHTML;


    const inputs = document.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", function(evt) { resizeInput(this); });
      resizeInput(inputs[i]);

      inputs[i].addEventListener("input", function(evt) { updateStorage(parseInt(this.value), getIndex(inputs[i])!, getPosition(this)!, "value"); });
    }

    const selects = document.getElementsByTagName('select');
    for (let i = 0; i < selects.length; i++) {
      selects[i].addEventListener("input", function(evt) { resizeSelect(this); });
      resizeSelect(selects[i]);

      switch (selects[i].className) {
        case "unit": {
          selects[i].addEventListener("input", function(evt) {
            updateStorage(this.value, getIndex(this)!, getPosition(this)!, "unit");
          });
          break;
        }
        case "is-inclusive": {
          selects[i].addEventListener("input", function(evt) {
            updateStorage(this.value != "<", getIndex(this)!, getPosition(this)!, "isInclusive");
          });
          break;
        }
        case "group-characters": {
          selects[i].addEventListener("input", function(evt) {
            updateStorage(CharacterSets[this.value as keyof typeof CharacterSets], getIndex(this)!, "groupCharacters");
          });
          break;
        }
        case "effect": {
          selects[i].addEventListener("input", function(evt) {
            updateStorage(TextEffectTypes[this.value as keyof typeof TextEffectTypes], getIndex(this)!, "effect");
          });
          break;
        }
      }
    }

    for (const btn of document.getElementsByClassName("modifier-removal-btn")) {
      (btn as HTMLElement).addEventListener("click", function(evt) { deleteModifier(getIndex(this)!); })
    }
  })
}

loadOptionsList()



function resizeInput(input: HTMLInputElement) {
  hiddenSpan.textContent = input.value;
  input.style.width = hiddenSpan.offsetWidth + 4 + "px";
}

function resizeSelect(select: HTMLSelectElement) {
  hiddenSpan.textContent = select.options[select.selectedIndex].text;
  select.style.width = hiddenSpan.offsetWidth + 5 + 2*5 + "px";
}



function deleteModifier(index: number) {
  chrome.storage.sync.get("options", function(data) { // Get options
    let options: ModifierOptions | undefined = data.options;
    if (options == undefined) {
      options = DEFAULT_OPTIONS;
    }

    options.modifiers.splice(index, 1);

    chrome.storage.sync.set({ "options": options })

    loadOptionsList()
  })
}


function addDefaultModifier() {
  chrome.storage.sync.get("options", function(data) { // Get options
    let options: ModifierOptions | undefined = data.options;
    if (options == undefined) {
      options = DEFAULT_OPTIONS;
    }

    options.modifiers.push(DEFAULT_OPTION);

    chrome.storage.sync.set({ "options": options })

    loadOptionsList()
  })
}


function updateStorage(value: any, index: number, firstKey: string, secondKey?: string) {
  chrome.storage.sync.get("options", function(data) { // Get options
    let options: any = data.options;
    if (options == undefined) {
      options = DEFAULT_OPTIONS
    }

    if (secondKey === undefined) {
      options.modifiers[index][firstKey] = value
    } else {
      options.modifiers[index][firstKey][secondKey] = value
    }

    // console.log(options)
    chrome.storage.sync.set({ "options": options })
  })
}
