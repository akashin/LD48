export class Submarine extends Phaser.GameObjects.Container {
  hullStrength: number = 10;
  hullHealth: number = 100;

  submarineSprite: Phaser.GameObjects.Sprite;
  infoText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, params: object) {
    super(scene, 100, 100);

    this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
    this.submarineSprite.setScale(0.2, 0.2);
    this.add(this.submarineSprite);

    this.infoText = new Phaser.GameObjects.Text(scene, 0, 0, 'hello', {color: 'white', fontSize: '14pt'});
    this.add(this.infoText);
  }

  applyPressure(pressure: number) {
    if (this.hullStrength >= pressure) {
      return;
    }

    let damage = pressure - this.hullStrength;
    this.hullHealth = Math.max(0, this.hullHealth - damage);

    this.updateInfo();
  }

  private updateInfo(): void {
    this.infoText.setText('HP: ' + this.hullHealth + ', Strength: ' + this.hullStrength);
  }
}
