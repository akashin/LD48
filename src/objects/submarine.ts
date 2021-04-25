import { CONST } from '../const';
import { EncounterType } from '../objects/encounter_window';

export enum ResourceType {
  // Ship hull integrity.
  HULL = 0,
  // Bio fuel.
  BIOFUEL = 1,
  // Materials for repairs and upgrades.
  MATERIALS = 2,
}

function resourceTypeToString(resourceType: ResourceType): string {
  switch (resourceType) {
    case ResourceType.HULL: return "Hull integrity";
    case ResourceType.BIOFUEL: return "Biofuel";
    case ResourceType.MATERIALS: return "Materials";
  }
}

function encounterTypeToAttributeName(encounterType: EncounterType): string {
  switch (encounterType) {
    case EncounterType.FIGHT: {
      return "Fighting";
    }
    case EncounterType.SEARCH: {
      return "Exploration";
    }
    case EncounterType.UPGRADE: {
      return "Crafting";
    }
  }
}

export class Submarine extends Phaser.GameObjects.Container {
  resourceToAmount: Map<ResourceType, number>;
  resourceToText: Map<ResourceType, Phaser.GameObjects.Text>;

  submarineSprite: Phaser.GameObjects.Sprite;

  encounterTypeToAttribute: Map<EncounterType, number>;

  // Attributes
  enginePower: number = 0;
  firePower: number = 0;
  navigation: number = 0;
  freeAttributesToSpend: number = 10;

  constructor(scene: Phaser.Scene, params: object) {
    super(scene, 0, 0);

    this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
    this.submarineSprite.setScale(0.2, 0.2);
    this.submarineSprite.setOrigin(0, 0);
    this.add(this.submarineSprite);

    this.resourceToAmount = new Map<ResourceType, number>();
    this.resourceToText = new Map<ResourceType, Phaser.GameObjects.Text>();
    this.resourceToText.set(ResourceType.HULL, new Phaser.GameObjects.Text(
      scene, this.submarineSprite.displayWidth, 0, '', {color: 'white', fontSize: '12pt'}));
    this.add(this.resourceToText.get(ResourceType.HULL));
    this.setResourceAmount(ResourceType.HULL, CONST.maxHullHealth);

    this.resourceToText.set(ResourceType.BIOFUEL, new Phaser.GameObjects.Text(
      scene, this.submarineSprite.displayWidth, 20, '', {color: 'white', fontSize: '12pt'}));
    this.add(this.resourceToText.get(ResourceType.BIOFUEL));
    this.setResourceAmount(ResourceType.BIOFUEL, 10);

    this.resourceToText.set(ResourceType.MATERIALS, new Phaser.GameObjects.Text(
      scene, this.submarineSprite.displayWidth, 40, '', {color: 'white', fontSize: '12pt'}));
    this.add(this.resourceToText.get(ResourceType.MATERIALS));
    this.setResourceAmount(ResourceType.MATERIALS, 10);
  }

  setResourceAmount(resourceType: ResourceType, amount: number) {
    this.resourceToAmount.set(resourceType, amount);
    this.resourceToText.get(resourceType).setText(
      resourceTypeToString(resourceType) + ": " + amount);
  }

  addResourceAmount(resourceType: ResourceType, delta: number) {
    this.setResourceAmount(resourceType, this.resourceToAmount.get(resourceType) + delta);
  }

  addAttribute(encounterType: EncounterType, delta: number) {
    switch (encounterType) {
      case EncounterType.FIGHT: {
        this.firePower += delta;
      }
      case EncounterType.SEARCH: {
        this.enginePower += delta;
      }
      case EncounterType.UPGRADE: {
        this.navigation += delta;
      }
    }
  }

  getAttribute(encounterType: EncounterType): number {
    switch (encounterType) {
      case EncounterType.FIGHT: {
        return this.firePower;
      }
      case EncounterType.SEARCH: {
        return this.enginePower;
      }
      case EncounterType.UPGRADE: {
        return this.navigation;
      }
    }
  }
}
