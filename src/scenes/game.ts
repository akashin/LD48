import Phaser from 'phaser';
import { CONST } from '../const';
import { Skill } from '../objects/skill';
import { Submarine } from '../objects/submarine';
import { Encounter, EncounterWindow } from '../objects/encounter_window';
import { randomInt } from '../utils/math'

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  private submarine!: Submarine;

  private encounterWindow?: EncounterWindow = undefined;
  private nextEncounters?: Array<Encounter> = undefined;

  private timeSinceLastTick: number = 0;

  private currentDepth: number = 0;
  private currentDepthText!: Phaser.GameObjects.Text;

  private actionOutcomeText!: Phaser.GameObjects.Text;

  private qKey!: Phaser.Input.Keyboard.Key;

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

    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    this.addAction('Dive Deeper', (pointer: any) => this.newDiveAction());

    let skill0 = new Skill(this);
    let skill1 = new Skill(this);
    skill0.setPosition(300, 300);
    skill1.setPosition(460, 300);
    this.add.existing(skill0);
    this.add.existing(skill1);

    this.tweens.add({
      targets: skill0,
      // delay: randomInt(1000),
      y: 310,
      yoyo: true,
      repeat: -1,
      ease: 'Sin.easeOut',
      duration: 1000,
    });
  }

  setDepth(depth: number) {
    this.currentDepth = depth;
    this.currentDepthText.setText("Depth: " + String(depth));
  }

  newDiveAction() {
    console.log("Dive!")
    if (this.nextEncounters != undefined) {
      console.log("Next encounters are already chosen.");
      return;
    }

    this.nextEncounters = new Array<Encounter>();
    this.nextEncounters.push(new Encounter("Repair", { repair: 1 }));
    this.nextEncounters.push(new Encounter("Fight", { damage: 1 }));
    this.nextEncounters.push(new Encounter("Search", {}));
    this.encounterWindow = new EncounterWindow(this, {}, this.nextEncounters, (i: number) => this.resolveEncounter(i));
    this.add.existing(this.encounterWindow);
  }

  resolveEncounter(index: number) {
    if (this.encounterWindow != undefined && this.nextEncounters != undefined) {
      let encounter = this.nextEncounters[index];
      console.log("Resolving encounter ", encounter)

      if (encounter.damage !== undefined) {
        this.submarine.takeDamage(encounter.damage);
      }
      if (encounter.repair !== undefined) {
        this.submarine.repair(encounter.repair);
      }

      this.encounterWindow.destroy();
      this.nextEncounters = undefined;
      this.setDepth(this.currentDepth + 1);
    }
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

  onActionEnd(): void {
    this.submarine.useOxygen(CONST.oxygenPerAction);
    this.submarine.applyPressure(this.currentDepth);

    if (this.submarine.oxygen == 0) {
      alert("Your ran out of oxygen!");
    }
    if (this.submarine.hullHealth == 0) {
      alert("Your hull was breached!");
    }
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

    this.onActionEnd();
  }

  ascendAction(): void {
    if (this.currentDepth == 0) {
      console.log("You can't ascend more");
      return;
    }

    console.log("Ascend!")
    this.setDepth(this.currentDepth - 1);
    this.showActionOutcome("You ascended back!");

    this.onActionEnd();
  }

  diveAction() {
    this.submarine.applyPressure(this.currentDepth);

    this.onActionEnd();

    console.log("Dive!")
    this.setDepth(this.currentDepth + 1);
    this.showActionOutcome("You dived deeper!");
  }

  repairAction() {
    if (this.submarine.enoughLoot(CONST.repairCost)) {
      this.submarine.useLoot(CONST.repairCost);
      this.submarine.repair(CONST.repairAmount);
      this.showActionOutcome("Repaired")

      this.onActionEnd();
    } else {
      this.showActionOutcome("Not enough loot to repair")
    }
  }

  upgradeAction() {
    var upgradeCost = 5 * (2 ** this.submarine.hullStrength);
    if (this.submarine.enoughLoot(upgradeCost)) {
      this.showActionOutcome("Upgraded");
      this.submarine.useLoot(upgradeCost);
      this.submarine.upgradeHull();

      this.onActionEnd();
    } else {
      this.showActionOutcome("Not enough loot to upgrade\n, need " + String(upgradeCost));
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
  }
}
