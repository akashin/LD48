import { CONST } from '../const';

export class Submarine extends Phaser.GameObjects.Container {
  depthRating: number = 2;
  depthRatingText: Phaser.GameObjects.Text;

  oxygen: number = CONST.maxOxygen;
  oxygenText: Phaser.GameObjects.Text;

  hullHealth: number = CONST.maxHullHealth;
  hullHealthText: Phaser.GameObjects.Text;

  submarineSprite: Phaser.GameObjects.Sprite;
  infoText: Phaser.GameObjects.Text;
  resourcesText: Phaser.GameObjects.Text;

  oxygen: number = CONST.maxOxygen;
  loot: number = 5;

  constructor(scene: Phaser.Scene, params: object) {
    super(scene, 0, 0);

    this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
    this.submarineSprite.setScale(0.2, 0.2);
    this.add(this.submarineSprite);

    this.infoText = new Phaser.GameObjects.Text(scene, 0, 0, '', {color: 'white', fontSize: '12pt'});
    this.add(this.infoText);

    this.resourcesText = new Phaser.GameObjects.Text(scene, 0, 12, '', {color: 'white', fontSize: '12pt'});
    this.add(this.resourcesText);

    this.oxygenText = scene.add.text(30, 70, '', {color: 'white', fontSize: '12pt'});
    this.add(this.oxygenText);
    this.setOxygen(CONST.maxOxygen);

    this.depthRatingText = scene.add.text(30, 90, '', {color: 'white', fontSize: '12pt'});
    this.add(this.depthRatingText);
    this.setDepthRating(2);

    this.hullHealthText = scene.add.text(30, 110, '', {color: 'white', fontSize: '12pt'});
    this.add(this.hullHealthText);
    this.setHullHealth(CONST.maxHullHealth);

    this.updateView();
  }

  setDepthRating(depthRating: number) {
    this.depthRating = depthRating;
    this.depthRatingText.setText('Depth rating: ' + depthRating);
  }

  setHullHealth(hullHealth: number) {
    this.hullHealth = hullHealth;
    this.hullHealthText.setText('Hull health: ' + hullHealth);
  }

  setOxygen(oxygen: number) {
    this.oxygen = oxygen;
    this.oxygenText.setText('Oxygen: ' + oxygen);
  }

  applyPressure(depth: number): void {
    if (this.depthRating < depth) {
      let damage = depth - this.depthRating;
      this.takeDamage(damage);
    }
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

  upgradeHull(): void {
    this.depthRating += 1;
  }

  private updateView(): void {
    this.resourcesText.setText('Loot: ' + this.loot);
  }
}
