
// In-page cache of the user's options
const options: ModifierOptions = DEFAULT_OPTIONS;
const optionsForm = document.getElementById("optionsForm");

// Immediately persist options changes of startPercent
(optionsForm as HTMLFormElement).startPercent.addEventListener("change", (event: Event) => {
  options.modifiers[0].start = Number((event.target as HTMLInputElement).value);
  chrome.storage.sync.set({ options });
});
// Immediately persist options changes of endPercent
(optionsForm as HTMLFormElement).endPercent.addEventListener("change", (event: Event) => {
  options.modifiers[0].end = Number((event.target as HTMLInputElement).value);
  chrome.storage.sync.set({ options });
});

// Initialize the form with the user's option settings
const data = await chrome.storage.sync.get("options");
Object.assign(options, data.options);
(optionsForm as HTMLFormElement).startPercent.value = options.startPercent;
(optionsForm as HTMLFormElement).endPercent.value = options.endPercent;


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

const modifiersContainer = document.getElementById("modifiersContainer");
if (modifiersContainer) {
  for (let i = 0; i < options.modifiers.length; i++) {
    const modifier = options.modifiers[i]; // Select current modifier

    const modifierForm = document.createElement("form");
    modifierForm.id = "modifierForm" + i;
    modifiersContainer.appendChild(modifierForm);

    const startLabel = document.createElement("label");
    startLabel.textContent = "modifierForm" + i;
    modifiersContainer.appendChild(modifierForm);
  }
} else {
  throw new Error("The \"modifiersContainer\" element does not exist!")
}

export { };





/////////////////////////////////



enum MeasurementUnits {
  percent,
  characters
}

enum TextEffectTypes {
  bold,
  italic
  //strikethrough,
}

enum CharacterSets {
  alphabetic,
  numeric,
  alphanumeric
}

interface ModifierOption {
  start: number,
  startUnit: MeasurementUnits,
  startInclusive: boolean,
  end: number,
  endUnit: MeasurementUnits,
  endInclusive: boolean,
  effect: TextEffectTypes,
  groupCharacters: CharacterSets
}

interface ModifierOptions {
  modifiers: ModifierOption[]
}

function greeter(modifier: ModifierOption, index: number) {
  // /*
  // return `
  //   <form id="optionsForm${index}">
  //     <label for="start">
  //       <input type="number" name="start" id="start" maxlength="4" value="${modifier.start}">
  //       Start
  //     </label>
  //     <label for="end">
  //       <input type="number" name="end" id="end" maxlength="4" value="${modifier.end}">
  //       End
  //     </label>
  //   </form>
  // `;
  // */

  // /*
  // return `
  // <li class="list-group-item">
  //   <form action="">
  //     <div class="col pad-3">
  //       <div class="row">
  //         <div class="col">
  //           <label for="start">Start</label>
  //         </div>
  //         <div class="col6">
  //           <label for="effect">Effect</label>
  //           <select class="dropdown-toggle" name="effect">
  //             <option ${modifier.effect == TextEffectTypes.bold ? "selected" : ""}>bold</option>
  //             <option ${modifier.effect == TextEffectTypes.italic ? "selected" : ""}>italic</option>
  //           </select>
  //         </div>
  //         <div class="col">
  //           <label for="end">End</label>
  //         </div>
  //       </div>

  //       <div class="row">
  //         <div class="input-group mb-3 col">
  //           <div class="input-group-prepend">
  //             <select class="input-group-text">
  //               <option ${!modifier.startInclusive ? "selected" : ""}>&gt;</option>
  //               <option ${modifier.startInclusive ? "selected" : ""}>&ge;</option>
  //             </select>
  //           </div>
  //           <input type="number" class="form-control" aria-label="start" name="start" maxlength="4" ${modifier.startUnit == MeasurementUnits.percent ? 'min="0" max="100"' : ''} value="${modifier.start}">
  //           <div class="input-group-append">
  //             <select class="input-group-text">
  //               <option ${modifier.startUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
  //               <option ${modifier.startUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
  //             </select>
  //           </div>
  //         </div>

  //         <div class="col-1"></div>

  //         <div class="input-group mb-3 col">
  //           <div class="input-group-prepend">
  //             <select class="input-group-text">
  //               <option ${!modifier.endInclusive ? "selected" : ""}>&lt;</option>
  //               <option ${modifier.endInclusive ? "selected" : ""}>&le;</option>
  //             </select>
  //           </div>
  //           <input type="number" class="form-control" aria-label="end" name="end" maxlength="4" ${modifier.endUnit == MeasurementUnits.percent ? 'min="0" max="100"' : ''} value="${modifier.end}">
  //           <div class="input-group-append">
  //             <select class="input-group-text">
  //               <option ${modifier.endUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
  //               <option ${modifier.endUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
  //             </select>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </form>
  // </li>
  // `;
  // */

  // /*
  // return `
  //   <div class="input-group">
  //     <div class="input-group-prepend">
  //       <span class="input-group-text">
  //         <div class="list-group">
  //           <button type="button" class="btn btn-link p-0"><b>&and;</b></button>
  //           ${index+1}
  //           <button type="button" class="btn btn-link p-0"><b>&or;</b></button>
  //         </div>
  //       </span>
  //     </div>

  //     <div class="form-control">
  //       <form action="">
  //         <div class="col pad-3">
  //           <div class="row">
  //             <div class="col">
  //               <label for="start">Start</label>
  //             </div>
  //             <div class="col6">
  //               <label for="effect">Effect</label>
  //               <select class="dropdown-toggle" name="effect">
  //                 <option ${modifier.effect == TextEffectTypes.bold ? "selected" : ""}>bold</option>
  //                 <option ${modifier.effect == TextEffectTypes.italic ? "selected" : ""}>italic</option>
  //               </select>
  //             </div>
  //             <div class="col">
  //               <label for="end">End</label>
  //             </div>
  //           </div>

  //           <div class="row">
  //             <div class="input-group mb-3 col">
  //               <div class="input-group-prepend">
  //                 <select class="input-group-text">
  //                   <option ${!modifier.startInclusive ? "selected" : ""}>&gt;</option>
  //                   <option ${modifier.startInclusive ? "selected" : ""}>&ge;</option>
  //                 </select>
  //               </div>
  //               <input type="number" class="form-control" aria-label="start" name="start" maxlength="4" ${modifier.startUnit == MeasurementUnits.percent ? 'min="0" max="100"' : ''} value="${modifier.start}">
  //               <div class="input-group-append">
  //                 <select class="input-group-text">
  //                   <option ${modifier.startUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
  //                   <option ${modifier.startUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
  //                 </select>
  //               </div>
  //             </div>

  //             <div class="col-1"></div>

  //             <div class="input-group mb-3 col">
  //               <div class="input-group-prepend">
  //                 <select class="input-group-text">
  //                   <option ${!modifier.endInclusive ? "selected" : ""}>&lt;</option>
  //                   <option ${modifier.endInclusive ? "selected" : ""}>&le;</option>
  //                 </select>
  //               </div>
  //               <input type="number" class="form-control" aria-label="end" name="end" maxlength="4" ${modifier.endUnit == MeasurementUnits.percent ? 'min="0" max="100"' : ''} value="${modifier.end}">
  //               <div class="input-group-append">
  //                 <select class="input-group-text">
  //                   <option ${modifier.endUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
  //                   <option ${modifier.endUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
  //                 </select>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </form>
  //     </div>
  //   </div>
  //   `;
  //   */

    return `
    <div class="modifier-slot">
      <div class="modifier-index">
        <button type="button" class="arrow-btn"><b>&and;</b></button>
        ${index+1}
        <button type="button" class="arrow-btn"><b>&or;</b></button>
      </div>

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
            <input type="number" class="" aria-label="start" name="start" maxlength="4" size=2 value="${modifier.start}">
            <select class="">
              <option ${modifier.startUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
              <option ${modifier.startUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
            </select>
          </div>
          <select class="">
            <option ${!modifier.startInclusive ? "selected" : ""}>&lt;</option>
            <option ${modifier.startInclusive ? "selected" : ""}>&le;</option>
          </select>
          
          Effected Text
          
          <select class="">
            <option ${!modifier.endInclusive ? "selected" : ""}>&lt;</option>
            <option ${modifier.endInclusive ? "selected" : ""}>&le;</option>
          </select>
          
          <div class="amount">
            <input type="number" class="" aria-label="end" name="end" maxlength="4" size=2 value="${modifier.end}">
            <select class="">
              <option ${modifier.endUnit == MeasurementUnits.percent ? "selected" : ""}>%</option>
              <option ${modifier.endUnit == MeasurementUnits.characters ? "selected" : ""}>characters</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    `;
}

const DEFAULT_OPTIONS: ModifierOptions = {
  modifiers: [
        {
            start: 0,
            startUnit: MeasurementUnits.percent,
            startInclusive: true,
            end: 50,
            endUnit: MeasurementUnits.percent,
            endInclusive: true,
            effect: TextEffectTypes.bold,
            groupCharacters: CharacterSets.alphabetic
        },
        {
            start: 2,
            startUnit: MeasurementUnits.characters,
            startInclusive: false,
            end: 100,
            endUnit: MeasurementUnits.percent,
            endInclusive: false,
            effect: TextEffectTypes.italic,
            groupCharacters: CharacterSets.numeric
        }
    ]
};

const hiddenSpan = document.createElement("span");
hiddenSpan.id = "hidden-span";
document.body.appendChild(hiddenSpan);

const inputs = document.getElementsByTagName('input');
for (let i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener("input", function(evt) { resizeInput(this); });
  resizeInput(inputs[i]);
}

const selects = document.getElementsByTagName('select');
for (let i = 0; i < selects.length; i++) {
  selects[i].addEventListener("input", function(evt) { resizeSelect(this); });
  resizeSelect(selects[i]);
}

function resizeInput(input) {
  console.log(input.value); // TODO: remove
  hiddenSpan.textContent = input.value;
  input.style.width = hiddenSpan.offsetWidth + 2 + 2*5 + "px";
}

function resizeSelect(select) {
  hiddenSpan.textContent = select.value;
  select.style.width = hiddenSpan.offsetWidth + 12 + 2*5 + "px";
}
