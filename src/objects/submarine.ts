import { CONST } from '../const';

export class Submarine extends Phaser.GameObjects.Container {
  hullStrength: number = 2;
  hullHealth: number = CONST.maxHullHealth;

  submarineSprite: Phaser.GameObjects.Sprite;
  infoText: Phaser.GameObjects.Text;
  resourcesText: Phaser.GameObjects.Text;

  oxygen: number = CONST.maxOxygen;
  loot: number = 0;

  constructor(scene: Phaser.Scene, params: object) {
    super(scene, 0, 0);

    this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
    this.submarineSprite.setScale(0.2, 0.2);
    this.add(this.submarineSprite);

    this.infoText = new Phaser.GameObjects.Text(scene, 0, 0, '', {color: 'white', fontSize: '12pt'});
    this.add(this.infoText);

    this.resourcesText = new Phaser.GameObjects.Text(scene, 0, 12, '', {color: 'white', fontSize: '12pt'});
    this.add(this.resourcesText);

    this.updateView();
  }

  applyPressure(depth: number): void {
    if (this.hullStrength < depth) {
      let damage = depth - this.hullStrength;
      this.takeDamage(damage);
    }
  }

  takeDamage(amount: number): void {
    this.hullHealth = Math.max(0, this.hullHealth - amount);

    console.log('Took ' + amount + ' damage, HP = ' + this.hullHealth);

    this.updateView();
  }

  repair(amount: number): void {
    this.hullHealth = Math.min(CONST.maxHullHealth, this.hullHealth + amount);

    console.log('Repaired ' + amount + ' HP, HP = ' + this.hullHealth);

    this.updateView();
  }

  useOxygen(amount: number): void {
    this.oxygen = Math.max(0, this.oxygen - amount);

    console.log('Used ' + amount + ' oxygen, OX = ' + this.oxygen);

    this.updateView();
  }

  addOxygen(amount: number): void {
    this.oxygen = Math.min(CONST.maxOxygen, this.oxygen + amount);

    console.log('Added ' + amount + ' oxygen, OX = ' + this.oxygen);

    this.updateView();
  }

  enoughLoot(amount: number): boolean {
    return this.loot >= amount;
  }

  useLoot(amount: number): void {
    if (this.enoughLoot(amount)) {
      this.loot -= amount;
      console.log('Used ' + amount + ' loot, loot = ' + this.loot);
    }

    this.updateView();
  }

  addLoot(amount: number): void {
    this.loot += amount;

    console.log('Added ' + amount + ' loot, loot = ' + this.loot);

    this.updateView();
  }

  private updateView(): void {
    this.infoText.setText('HP: ' + this.hullHealth + ', Strength: ' + this.hullStrength);
    this.resourcesText.setText('Oxygen: ' + this.oxygen + ', Loot: ' + this.loot);
  }
}
