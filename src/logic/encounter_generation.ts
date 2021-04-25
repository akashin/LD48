import { Encounter, Difficulty, EncounterType } from '../objects/encounter_window';
import { randomInt } from '../utils/math'

export function resourcesByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case Difficulty.EASY: return 1;
    case Difficulty.MEDIUM: return 3;
    case Difficulty.HARD: return 6;
  }
}

export function thresholdByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    // Should give 80% success.
    // 3..10 out of 10
    case Difficulty.EASY: return 3;
    // Should give 50% success.
    // 6..10 out of 10
    case Difficulty.MEDIUM: return 6;
    // Should give 30% success.
    // 8..10 out of 10
    case Difficulty.HARD: return 8;
  }
}

function generateFightEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("", difficulty, EncounterType.FIGHT);
}

function generateSearchEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("", difficulty, EncounterType.SEARCH);
}

function generateUpgradeEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("", difficulty, EncounterType.UPGRADE);
}

export function generateEncounter(type: EncounterType, difficulty: Difficulty): Encounter {
  switch (type) {
    case EncounterType.FIGHT: {
      return generateFightEncounter(difficulty);
    }
    case EncounterType.SEARCH: {
      return generateSearchEncounter(difficulty);
    }
    case EncounterType.UPGRADE: {
      return generateUpgradeEncounter(difficulty);
    }
  }
}

export function generateEncounters(): Array<Encounter> {
  let encounters = new Array<Encounter>();
  let types: Array<EncounterType> = [EncounterType.FIGHT, EncounterType.SEARCH, EncounterType.UPGRADE];
  // Shuffle types.
  for (let i = 0; i < 3; ++i) {
    let newPos = i + randomInt(3 - i);
    if (i !== newPos) {
      [types[i], types[newPos]] = [types[newPos], types[i]];
    }
  }
  encounters.push(generateEncounter(types[0], Difficulty.EASY));
  encounters.push(generateEncounter(types[1], Difficulty.MEDIUM));
  encounters.push(generateEncounter(types[2], Difficulty.HARD));
  return encounters;
}
