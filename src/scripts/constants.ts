

enum MeasurementUnits {
  percent="percent",
  characters="characters"
}

enum TextEffectTypes {
  bold="b",
  italic="i",
  underline="u",
  strikethrough="del",
}

enum CharacterSets {
  alphabetic="alphabetic",
  numeric="numeric",
  alphanumeric="alphanumeric"
}

interface ModifierIndex {
  value: number,
  unit: MeasurementUnits,
  isInclusive: boolean
}

interface ModifierOption {
  start: ModifierIndex,
  end: ModifierIndex,
  effect: TextEffectTypes,
  groupCharacters: CharacterSets
}

interface ModifierOptions {
  modifiers: ModifierOption[]
}

const DEFAULT_OPTION: ModifierOption = {
  start: {
    value: 0,
    unit: MeasurementUnits.percent,
    isInclusive: true
  },
  end: {
    value: 50,
    unit: MeasurementUnits.percent,
    isInclusive: true
  },
  effect: TextEffectTypes.bold,
  groupCharacters: CharacterSets.alphabetic
}

const DEFAULT_OPTIONS: ModifierOptions = {
  modifiers: [
    DEFAULT_OPTION
  ]
};

const ADDED_ELEMENT_CLASSNAME = "half-bold-reader-added"
