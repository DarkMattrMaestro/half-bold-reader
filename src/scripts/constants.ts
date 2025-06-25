
export enum MeasurementUnits {
  percent,
  characters
}

export enum TextEffectTypes {
  bold,
  italic
  //strikethrough,
}

export enum CharacterSets {
  alphabetic,
  numeric,
  alphanumeric
}

export interface ModifierOption {
  start: number,
  startUnit: MeasurementUnits,
  startInclusive: boolean,
  end: number,
  endUnit: MeasurementUnits,
  endInclusive: boolean,
  effect: TextEffectTypes,
  groupCharacters: CharacterSets
}

export interface ModifierOptions {
  modifiers: ModifierOption[]
}

export const DEFAULT_OPTIONS: ModifierOptions = {
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

export const ADDED_ELEMENT_CLASSNAME = "half-bold-reader-added"