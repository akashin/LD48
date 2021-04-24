import { CONST } from '../const';

export class Submarine extends Phaser.GameObjects.Container {
  oxygen: number = CONST.maxOxygen;
  oxygenText: Phaser.GameObjects.Text;

  hullHealth: number = CONST.maxHullHealth;
  hullHealthText: Phaser.GameObjects.Text;

  submarineSprite: Phaser.GameObjects.Sprite;

  loot: number = 5;
  lootText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, params: object) {
    super(scene, 0, 0);

    this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
    this.submarineSprite.setScale(0.2, 0.2);
    this.add(this.submarineSprite);

    this.oxygenText = scene.add.text(30, 70, '', {color: 'white', fontSize: '12pt'});
    this.add(this.oxygenText);
    this.setOxygen(CONST.maxOxygen);

    this.hullHealthText = scene.add.text(30, 90, '', {color: 'white', fontSize: '12pt'});
    this.add(this.hullHealthText);
    this.setHullHealth(CONST.maxHullHealth);

    this.lootText = scene.add.text(30, 110, '', {color: 'white', fontSize: '12pt'});
    this.add(this.lootText);
    this.setLoot(5);
  }

  setHullHealth(hullHealth: number) {
    this.hullHealth = hullHealth;
    this.hullHealthText.setText('Hull health: ' + hullHealth);
  }

  setLoot(loot: number) {
    this.loot = loot;
    this.lootText.setText('Loot: ' + loot);
  }

  setOxygen(oxygen: number) {
    this.oxygen = oxygen;
    this.oxygenText.setText('Oxygen: ' + oxygen);
  }

  takeDamage(amount: number): void {
    this.setHullHealth(Math.max(0, this.hullHealth - amount));
    console.log('Took ' + amount + ' damage, HP = ' + this.hullHealth);
  }

  repair(amount: number): void {
    this.setHullHealth(Math.min(CONST.maxHullHealth, this.hullHealth + amount));
    console.log('Repaired ' + amount + ' HP, HP = ' + this.hullHealth);
  }

  useOxygen(amount: number): void {
    this.setOxygen(Math.max(0, this.oxygen - amount));
    console.log('Used ' + amount + ' oxygen, OX = ' + this.oxygen);
  }

  addOxygen(amount: number): void {
    this.setOxygen(Math.min(CONST.maxOxygen, this.oxygen + amount));
    console.log('Added ' + amount + ' oxygen, OX = ' + this.oxygen);
  }

  enoughLoot(amount: number): boolean {
    return this.loot >= amount;
  }

  useLoot(amount: number): void {
    if (this.enoughLoot(amount)) {
      this.setLoot(this.loot - amount);
      console.log('Used ' + amount + ' loot, loot = ' + this.loot);
    }
  }

  addLoot(amount: number): void {
    this.setLoot(this.loot + amount);
    console.log('Added ' + amount + ' loot, loot = ' + this.loot);
  }
}
