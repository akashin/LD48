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

    this.addAction('Explore', (pointer: any) => this.exploreAction());
    this.addAction('Dive', (pointer: any) => this.diveAction());
    this.addAction('Repair', (pointer: any) => this.repairAction());
  }

  addAction(text: string, onClick: any) {
    var actionText = this.add.text(
      10, 10 + (24 + 10) * this.actions.length, text, { color: 'white', fontSize: '24pt' }
    )
    actionText.setInteractive();
    actionText.on('pointerup', onClick);
    this.actions.push(actionText);
  }

  exploreAction() {
    console.log("Explore!")
  }

  diveAction() {
    console.log("Dive!")
  }

  repairAction() {
    console.log("Repair!")
  }
}
