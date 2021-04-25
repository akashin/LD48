import { CONST } from '../const';

export enum ResourceType {
  // Ship hull integrity.
  HULL,
  // Bio fuel.
  BIOFUEL,
  // Materials for repairs and upgrades.
  MATERIALS,
}

function resourceTypeToString(resourceType: ResourceType): string {
  switch (resourceType) {
    case ResourceType.HULL: return "Hull integrity";
    case ResourceType.BIOFUEL: return "Biofuel";
    case ResourceType.MATERIALS: return "Materials";
  }
}

export class Submarine extends Phaser.GameObjects.Container {
  resourceToAmount: Map<ResourceType, number>;
  resourceToText: Map<ResourceType, Phaser.GameObjects.Text>;

  submarineSprite: Phaser.GameObjects.Sprite;

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
}
