import { CONST } from '../const';

export class Skill extends Phaser.GameObjects.Container {
  private bgRectangle: Phaser.GameObjects.Rectangle;
  private skillRectangle: Phaser.GameObjects.Rectangle;
  private skillSprite: Phaser.GameObjects.Sprite;
  private descriptionText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.bgRectangle = new Phaser.GameObjects.Rectangle(scene, 0, 0, 150, 150, 0x6666FF);
    this.bgRectangle.setOrigin(0, 0);
    this.add(this.bgRectangle);

    this.skillRectangle = new Phaser.GameObjects.Rectangle(scene, 10, 10, 64, 64, 0x444444);
    this.skillRectangle.setOrigin(0, 0);
    this.add(this.skillRectangle);

    this.skillSprite = new Phaser.GameObjects.Sprite(scene, 10, 10, 'hammer');
    this.skillSprite.setDisplaySize(64, 64);
    this.skillSprite.setOrigin(0, 0);
    this.add(this.skillSprite);

    this.descriptionText = new Phaser.GameObjects.Text(scene, 10, 10 + 64 + 10, '', {color: 'white', fontSize: '8pt', wordWrap: {width: 150 - 20, useAdvancedWrap: true}});
    this.descriptionText.setText("The quick brown fox jumps over the lazy dog");
    this.add(this.descriptionText);
  }
}
