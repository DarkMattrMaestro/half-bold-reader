
// In-page cache of the user's options
// const optionsForm = document.getElementById("optionsForm");

// // Immediately persist options changes of startPercent
// (optionsForm as HTMLFormElement).startPercent.addEventListener("change", (event: Event) => {
//   options.modifiers[0].start = Number((event.target as HTMLInputElement).value);
//   chrome.storage.sync.set({ options });
// });
// // Immediately persist options changes of endPercent
// (optionsForm as HTMLFormElement).endPercent.addEventListener("change", (event: Event) => {
//   options.modifiers[0].end = Number((event.target as HTMLInputElement).value);
//   chrome.storage.sync.set({ options });
// });

// // Initialize the form with the user's option settings
// const data = await chrome.storage.sync.get("options");
// Object.assign(options, data.options);
// (optionsForm as HTMLFormElement).startPercent.value = options.startPercent;
// (optionsForm as HTMLFormElement).endPercent.value = options.endPercent;

function getCurrentTab(callback: Function) {
  let queryOptions = { active: true, lastFocusedWindow: true };

  chrome.tabs.query(queryOptions, ([tab]) => {
    if (chrome.runtime.lastError) { console.error(chrome.runtime.lastError); }

    callback(tab);
  });
}



const emboldenBtn = document.getElementById("emboldenBtn");
if (emboldenBtn) {
  emboldenBtn.onclick = function() {
    console.log("Make text bold") // TODO: connect to initiate-modification.js
    getCurrentTab((tab: any) => {
      chrome.scripting.executeScript({
        target: {tabId: tab.id??0},
        files: ["scripts/initiate-modification.js"]
      });
    })
  };
}

// const modifiersContainer = document.getElementById("modifiersContainer");
// if (modifiersContainer) {
//   for (let i = 0; i < options.modifiers.length; i++) {
//     const modifier = options.modifiers[i]; // Select current modifier

//     const modifierForm = document.createElement("form");
//     modifierForm.id = "modifierForm" + i;
//     modifiersContainer.appendChild(modifierForm);

//     const startLabel = document.createElement("label");
//     startLabel.textContent = "modifierForm" + i;
//     modifiersContainer.appendChild(modifierForm);
//   }
// } else {
//   throw new Error("The \"modifiersContainer\" element does not exist!")
// }

// export { };





/////////////////////////////////



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
            <select class="" name="effect">
              <option ${modifier.effect == TextEffectTypes.bold ? "selected" : ""}>bold</option>
              <option ${modifier.effect == TextEffectTypes.italic ? "selected" : ""}>italic</option>
            </select>
          </div>
          <div class="option">
            <label for="characters">Characters:</label>
            <select class="" name="characters">
              <option ${modifier.groupCharacters == CharacterSets.alphabetic ? "selected" : ""}>alphabetic</option>
              <option ${modifier.groupCharacters == CharacterSets.numeric ? "selected" : ""}>numeric</option>
              <option ${modifier.groupCharacters == CharacterSets.alphanumeric ? "selected" : ""}>alphanumeric</option>
            </select>
          </div>
        </div>

        <div class="effect-range">
          <div class="amount">
            <input type="number" class="" aria-label="start" name="start" maxlength="4" size=2 value="${modifier.start.value}">
            <select class="">
              <option ${modifier.start.unit == MeasurementUnits.percent ? "selected" : ""}>%</option>
              <option ${modifier.start.unit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
            </select>
          </div>
          <select class="">
            <option ${!modifier.start.isInclusive ? "selected" : ""}>&lt;</option>
            <option ${modifier.start.isInclusive ? "selected" : ""}>&le;</option>
          </select>
          
          Effected Text
          
          <select class="">
            <option ${!modifier.end.isInclusive ? "selected" : ""}>&lt;</option>
            <option ${modifier.end.isInclusive ? "selected" : ""}>&le;</option>
          </select>
          
          <div class="amount">
            <input type="number" class="" aria-label="end" name="end" maxlength="4" size=2 value="${modifier.end.value}">
            <select class="">
              <option ${modifier.end.unit == MeasurementUnits.percent ? "selected" : ""} value="percent">%</option>
              <option ${modifier.end.unit == MeasurementUnits.characters ? "selected" : ""} value="characters">characters</option>
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

function getIndex(element: HTMLElement): number | null {
  let parent: HTMLElement = element;
  while (parent.getAttribute("data-index") == null && parent.parentElement != null) {
    console.log(parent)
    parent = parent.parentElement;
  }
  console.log("Final parent: ", parent)
  if (parent.getAttribute("data-index") == null) {
    return null;
  } else {
    return parseInt(parent.getAttribute("data-index")!, 10);
  }
}

chrome.storage.sync.get("options", function(data) { // Get options
  let options: ModifierOptions = data.options;
  if (options == undefined) {
    chrome.storage.sync.set({ "options": DEFAULT_OPTIONS })
    options = DEFAULT_OPTIONS
  }


  for (let i = 0; i < options.modifiers.length; i++) {
    document.querySelector("#modifiersList")!.innerHTML += appendModifier(options.modifiers[i], i);
  }


  const inputs = document.getElementsByTagName('input');
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", function(evt) { resizeInput(this); });
    resizeInput(inputs[i]);

    let index = getIndex(inputs[i]);
    console.log(index)
    if (index != null) {
      inputs[i].addEventListener("input", function(evt) { updateStorage(parseInt(this.value), index, this.name, "value"); });
    }
  }

  const selects = document.getElementsByTagName('select');
  for (let i = 0; i < selects.length; i++) {
    selects[i].addEventListener("input", function(evt) { resizeSelect(this); });
    resizeSelect(selects[i]);
  }

  for (const btn of document.getElementsByClassName("modifier-removal-btn")) {
    (btn as HTMLElement).addEventListener("click", function(evt) { deleteModifier(getIndex(this)!); })
  }
  document.getElementById("add-btn")?.addEventListener("click", function(evt) { addDefaultModifier(); })
})



function resizeInput(input: HTMLInputElement) {
  hiddenSpan.textContent = input.value;
  input.style.width = hiddenSpan.offsetWidth + 4 + "px";
}

function resizeSelect(select: HTMLSelectElement) {
  hiddenSpan.textContent = select.value;
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

    window.location.reload();
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

    window.location.reload();
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

    chrome.storage.sync.set({ "options": options })
  })
}
