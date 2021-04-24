import Phaser from 'phaser';
import { CONST } from '../const';
import { Submarine } from '../objects/submarine';
import { randomInt } from '../utils/math'

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  private submarine!: Submarine;

  private timeSinceLastTick: number = 0;

  private currentDepth: number = 0;
  private currentDepthText!: Phaser.GameObjects.Text;

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
    this.submarine.setPosition(200, 200);
    this.add.existing(this.submarine);

    this.currentDepthText = this.add.text(gameWidth * 0.7, 10, "", { color: 'white', fontSize: '24pt' });
    this.setDepth(0);

    this.addAction('Explore', (pointer: any) => this.exploreAction());
    this.addAction('Dive', (pointer: any) => this.diveAction());
    this.addAction('Repair', (pointer: any) => this.repairAction());
  }

  setDepth(depth: number) {
    this.currentDepth = depth;
    this.currentDepthText.setText("Depth: " + String(depth));
  }

  addAction(text: string, onClick: any) {
    // TODO: Turn these into a prettier images.
    var actionText = this.add.text(
      10, 10 + (CONST.actionTextSize + 10) * this.actions.length, text,
      { color: 'white', fontSize: String(CONST.actionTextSize) + 'pt' }
    )
    actionText.setInteractive();
    actionText.on('pointerdown', onClick);
    this.actions.push(actionText);
  }

  exploreAction() {
    console.log("Explore!")
    var event = randomInt(3);
    switch (event) {
      case 0: {
        console.log("Take damage");
        this.submarine.takeDamage(5);
        break;
      }
      case 1: {
        console.log("Get loot");
        this.submarine.addLoot(10);
        break;
      }
      case 2: {
        console.log("Get oxygen");
        this.submarine.addOxygen(25);
        break;
      }
    }
  }

  getPressureFromDepth(depth: number) {
    return 5 + depth * 5;
  }

  diveAction() {
    console.log("Dive!")
    this.setDepth(this.currentDepth + 1);
  }

  repairAction() {
    console.log("Repair!")
    this.submarine.hullHealth += 10;
  }

  update(time: number, delta: number): void {
    this.timeSinceLastTick += delta;

    while (this.timeSinceLastTick >= CONST.tickDuration) {
      this.timeSinceLastTick -= CONST.tickDuration;
      this.tick();
    }
  }

  tick(): void {
    this.submarine.tick(this.getPressureFromDepth(this.currentDepth));
  }
}
