import { Encounter, Difficulty, EncounterType } from '../objects/encounter_window';
import { randomInt } from '../utils/math'

function resourcesByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    case Difficulty.EASY: return 1;
    case Difficulty.MEDIUM: return 3;
    case Difficulty.HARD: return 6;
  }
}

function thresholdByDifficulty(difficulty: Difficulty): number {
  switch (difficulty) {
    // Should give 80% success.
    // 5..20 out of 20
    case Difficulty.EASY: return 5;
    // Should give 50% success.
    // 11..20 out of 20
    case Difficulty.MEDIUM: return 11;
    // Should give 20% success.
    // 17..20 out of 20
    case Difficulty.HARD: return 17;
  }
}

function generateFightEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("Sharks", difficulty, EncounterType.FIGHT);
}

function generateSearchEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("Cave", difficulty, EncounterType.SEARCH);
}

function generateUpgradeEncounter(difficulty: Difficulty): Encounter {
  return new Encounter("Science idea", difficulty, EncounterType.UPGRADE);
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
