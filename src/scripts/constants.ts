
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
  effects: TextEffectTypes[],
  groupCharacters: CharacterSets
}

interface ModifierOptions {
  modifiers: ModifierOption[]
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
            effects: [
                TextEffectTypes.bold
            ],
            groupCharacters: CharacterSets.alphabetic
        },
        {
            start: 2,
            startUnit: MeasurementUnits.characters,
            startInclusive: false,
            end: 100,
            endUnit: MeasurementUnits.percent,
            endInclusive: false,
            effects: [
                TextEffectTypes.italic
            ],
            groupCharacters: CharacterSets.numeric
        }
    ]
};

const ADDED_ELEMENT_CLASSNAME = "half-bold-reader-added"