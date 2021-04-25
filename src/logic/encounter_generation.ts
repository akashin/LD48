import { Encounter } from '../objects/encounter_window';
import { randomInt } from '../utils/math'

function generateFightEncounter(): Encounter {
  return new Encounter("Fight", { damage: randomInt(3) });
}

function generateSearchEncounter(): Encounter {
  return new Encounter("Search", { });
}

function generateRepairEncounter(): Encounter {
  return new Encounter("Repair", { repair: randomInt(3) });
}

export function generateEncounter(): Encounter {
  let eventType = randomInt(3);
  switch (eventType) {
    case 0: {
      return generateFightEncounter();
    }
    case 1: {
      return generateRepairEncounter();
    }
    case 2: {
      return generateSearchEncounter();
    }
  }
}
