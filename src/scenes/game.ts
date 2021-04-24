import Phaser from 'phaser';
import { Submarine } from '../objects/submarine';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.image('hammer', 'assets/hammer.png');
    this.load.image('submarine', 'assets/submarine.png');
  }

  create() {
    let submarine = new Submarine(this, {});
    this.add.existing(submarine);
  }
}
