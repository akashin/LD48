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

  private actionOutcomeText!: Phaser.GameObjects.Text;

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

    this.actionOutcomeText = this.add.text(gameWidth * 0.5 - 100, gameHeight * 0.1, "",
                                           { color: 'white', fontSize: '24pt' });

    this.addAction('Explore', (pointer: any) => this.exploreAction());
    this.addAction('Ascend', (pointer: any) => this.ascendAction());
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

  showActionOutcome(outcome_text: string) {
    // console.log(outcome_text);
    this.actionOutcomeText.setText(outcome_text);
  }

  exploreAction() {
    console.log("Explore!")
    var event = randomInt(3);
    switch (event) {
      case 0: {
        this.submarine.takeDamage(CONST.exploreDamage);
        this.showActionOutcome("You were damaged");
        break;
      }
      case 1: {
        var loot = 1 + randomInt(2 ** (this.currentDepth + 1));
        this.submarine.addLoot(loot);
        this.showActionOutcome("You got " + String(loot) + " loot");
        break;
      }
      case 2: {
        this.submarine.addOxygen(CONST.exploreOxygenIncome);
        this.showActionOutcome("You got oxygen");
        break;
      }
    }
  }

  ascendAction(): void {
    if (this.currentDepth == 0) {
      console.log("You can't ascend more");
      return;
    }

    console.log("Ascend!")
    this.setDepth(this.currentDepth - 1);
    this.showActionOutcome("You ascended back!");
  }

  diveAction() {
    console.log("Dive!")
    this.setDepth(this.currentDepth + 1);
    this.showActionOutcome("You dived deeper!");
  }

  repairAction() {
    if (this.submarine.loot >= CONST.repairCost) {
      this.submarine.addLoot(-CONST.repairCost);
      this.submarine.repair(CONST.repairAmount);
      this.showActionOutcome("Repaired")
    } else {
      this.showActionOutcome("Not enough loot to repair")
    }
  }

  update(time: number, delta: number): void {
    this.timeSinceLastTick += delta;

    while (this.timeSinceLastTick >= CONST.tickDuration) {
      this.timeSinceLastTick -= CONST.tickDuration;
      this.tick();
    }
  }

  tick(): void {
    this.submarine.applyPressure(this.currentDepth);
  }
}
