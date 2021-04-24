import Phaser from 'phaser';
import { Submarine } from '../objects/submarine';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
    this.load.image('hammer', 'assets/hammer.png');
    this.load.image('submarine', 'assets/submarine.png');
  }

  create() {
    const logo = this.add.image(400, 70, 'logo');

    this.tweens.add({
      targets: logo,
      y: 350,
      duration: 1500,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1
    });

    let submarine = new Submarine(this, {});
    this.add.existing(submarine);
  }
}
