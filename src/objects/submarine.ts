import { CONST } from '../const';

export class Submarine extends Phaser.GameObjects.Container {
  hullStrength: number = 10;
  hullHealth: number = 100;

  submarineSprite: Phaser.GameObjects.Sprite;
  infoText: Phaser.GameObjects.Text;
  resourcesText: Phaser.GameObjects.Text;

  oxygen: number = 1000;
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

  tick(pressure: number): void {
    if (this.hullStrength < pressure) {
      let damage = pressure - this.hullStrength;
      this.takeDamage(damage);
    }

    this.oxygen = Math.max(0, this.oxygen - CONST.oxygenPerTick);

    this.updateView();
  }

  takeDamage(damage: number): void {
    this.hullHealth = Math.max(0, this.hullHealth - damage);

    this.updateView();
  }

  addOxygen(amount: number): void {
    this.oxygen += amount;

    this.updateView();
  }

  addLoot(amount: number): void {
    this.loot += amount;

    this.updateView();
  }

  private updateView(): void {
    this.infoText.setText('HP: ' + this.hullHealth + ', Strength: ' + this.hullStrength);
    this.resourcesText.setText('Oxygen: ' + this.oxygen + ', Loot: ' + this.loot);
  }
}
