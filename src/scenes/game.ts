import Phaser from 'phaser';
import { Submarine } from '../objects/submarine';

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  constructor() {
    super('GameScene');
    this.actions = new Array<Phaser.GameObjects.Text>();
  }

  preload() {
    this.load.image('hammer', 'assets/hammer.png');
    this.load.image('submarine', 'assets/submarine.png');
  }

  create() {
    var gameWidth = this.game.config.width as number;
    var gameHeight = this.game.config.height as number;

    let submarine = new Submarine(this, {});
    this.add.existing(submarine);

    this.addAction('Explore', this.exploreAction);
    this.addAction('Dive', this.diveAction);
    this.addAction('Repair', this.repairAction);
  }

  addAction(text: string, onClick) {
    var actionText = this.add.text(
      10, 10 + (24 + 10) * this.actions.length, text, { color: 'white', fontSize: '24pt' }
    )
    actionText.setInteractive();
    actionText.on('pointerup', onClick);
    this.actions.push(actionText);
  }

  exploreAction(pointer: any) {
    console.log("Explore!")
  }

  diveAction(pointer: any) {
    console.log("Dive!")
  }

  repairAction(pointer: any) {
    console.log("Repair!")
  }
}
