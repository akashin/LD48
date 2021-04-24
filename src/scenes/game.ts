import Phaser from 'phaser';
import { CONST } from '../const';
import { Submarine } from '../objects/submarine';

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  private submarine!: Submarine;

  private timeSinceLastTick: number = 0;

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

    this.submarine = new Submarine(this, {});
    this.add.existing(this.submarine);

    this.addAction('Explore', (pointer: any) => this.exploreAction());
    this.addAction('Dive', (pointer: any) => this.diveAction());
    this.addAction('Repair', (pointer: any) => this.repairAction());
  }

  addAction(text: string, onClick: any) {
    // TODO: Turn these into a prettier images.
    var actionText = this.add.text(
      10, 10 + (CONST.actionTextSize + 10) * this.actions.length, text,
      { color: 'white', fontSize: String(CONST.actionTextSize) + 'pt' }
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

  update(time: number, delta: number): void {
    this.timeSinceLastTick += delta;

    while (this.timeSinceLastTick >= CONST.tickDuration) {
      this.timeSinceLastTick -= CONST.tickDuration;
      this.tick();
    }
  }

  tick(): void {
    this.submarine.applyPressure(11);
  }
}
