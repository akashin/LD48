import Phaser from 'phaser';
import { CONST } from '../const';
import { Skill } from '../objects/skill';
import { Submarine } from '../objects/submarine';
import { Encounter, EncounterWindow } from '../objects/encounter_window';
import { generateEncounter } from '../logic/encounter_generation';
import { randomInt } from '../utils/math'
import { AttributesUI } from '../objects/attributes';

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  private submarine!: Submarine;

  private encounterWindow?: EncounterWindow = undefined;
  private nextEncounters?: Array<Encounter> = undefined;

  private timeSinceLastTick: number = 0;

  private currentDepth: number = 0;
  private currentDepthText!: Phaser.GameObjects.Text;

  private attributes!: AttributesUI;

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
    this.submarine.setPosition(50, 450);
    this.add.existing(this.submarine);

    this.currentDepthText = this.add.text(gameWidth * 0.7, 10, "", { color: 'white', fontSize: '24pt' });
    this.setDepth(0);

    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

    this.addAction('Dive Deeper', (pointer: any) => this.chooseEncounter());

    let skill0 = new Skill(this);
    let skill1 = new Skill(this);
    skill0.setPosition(450, 400);
    skill1.setPosition(610, 400);
    this.add.existing(skill0);
    this.add.existing(skill1);

    // this.tweens.add({
    //   targets: skill0,
    //   // delay: randomInt(1000),
    //   y: 410,
    //   yoyo: true,
    //   repeat: -1,
    //   ease: 'Sin.easeOut',
    //   duration: 1000,
    // });

    this.attributes = new AttributesUI(this, this.submarine);
    this.attributes.setPosition(170, 400);
    this.add.existing(this.attributes);
  }

  setDepth(depth: number) {
    this.currentDepth = depth;
    this.currentDepthText.setText("Depth: " + String(depth));
  }

  chooseEncounter() {
    console.log("Dive!")
    if (this.nextEncounters != undefined) {
      console.log("Next encounters are already chosen.");
      return;
    }

    this.nextEncounters = new Array<Encounter>();
    for (let i = 0; i < 3; ++i) {
      this.nextEncounters.push(generateEncounter());
    }

    this.encounterWindow = new EncounterWindow(this, {}, this.nextEncounters, (i: number) => this.resolveEncounter(i));
    this.add.existing(this.encounterWindow);
  }

  resolveEncounter(encounter: Encounter) {
    if (this.encounterWindow != undefined && this.nextEncounters != undefined) {
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

  update(time: number, delta: number): void {
    this.timeSinceLastTick += delta;

    while (this.timeSinceLastTick >= CONST.tickDuration) {
      this.timeSinceLastTick -= CONST.tickDuration;
      this.tick();
    }

    this.attributes.update();
  }

  tick(): void {
  }
}
