import Phaser from 'phaser';
import { CONST } from '../const';
import { Skill } from '../objects/skill';
import { Submarine, ResourceType } from '../objects/submarine';
import { Encounter, EncounterWindow, EncounterOutcome, EncounterType, Difficulty } from '../objects/encounter_window';
import { generateEncounters, resourcesByDifficulty, thresholdByDifficulty } from '../logic/encounter_generation';
import { randomInt } from '../utils/math'
import { AttributesUI } from '../objects/attributes';

function encounterConsumedResource(encounterType: EncounterType): ResourceType {
  switch (encounterType) {
    case EncounterType.FIGHT: {
      return ResourceType.HULL;
    }
    case EncounterType.SEARCH: {
      return ResourceType.BIOFUEL;
    }
    case EncounterType.UPGRADE: {
      return ResourceType.MATERIALS;
    }
  }
}

function encounterGeneratedResource(encounterType: EncounterType): ResourceType {
  switch (encounterType) {
    case EncounterType.FIGHT: {
      return ResourceType.BIOFUEL;
    }
    case EncounterType.SEARCH: {
      return ResourceType.MATERIALS;
    }
    case EncounterType.UPGRADE: {
      return ResourceType.HULL;
    }
  }
}

export default class GameScene extends Phaser.Scene {
  private actions: Array<Phaser.GameObjects.Text>;

  private submarine!: Submarine;

  private encounterWindow?: EncounterWindow = undefined;
  private nextEncounters?: Array<Encounter> = undefined;
  private encounterOutcome?: EncounterOutcome = undefined;

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
    this.load.image('fight', 'assets/fight.jpeg');
    this.load.image('hammer', 'assets/hammer.png');
    this.load.image('explore', 'assets/explore.png');
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

    // let skill0 = new Skill(this);
    // let skill1 = new Skill(this);
    // skill0.setPosition(450, 400);
    // skill1.setPosition(610, 400);
    // this.add.existing(skill0);
    // this.add.existing(skill1);

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
    this.attributes.setPosition(450, 400);
    this.add.existing(this.attributes);
  }

  setDepth(depth: number) {
    this.currentDepth = depth;
    this.currentDepthText.setText("Depth: " + String(depth));
  }

  generateEncounterOutcome(encounter: Encounter): EncounterOutcome {
    let outcome = new EncounterOutcome();
    outcome.roll = 1 + randomInt(10) + this.submarine.getAttribute(encounter.type);
    outcome.checkDifficulty = thresholdByDifficulty(encounter.difficulty) + Math.floor(this.currentDepth / 10);
    outcome.success = outcome.roll >= outcome.checkDifficulty;
    if (outcome.success) {
      outcome.text = "Success!";
      if (encounter.difficulty == Difficulty.HARD) {
        outcome.boostedAttributed[encounter.type] = 1;
      }
      outcome.resourceTypeToAmount[encounterGeneratedResource(encounter.type)] = resourcesByDifficulty(encounter.difficulty);
    } else {
      outcome.text = "Failure!";
      outcome.resourceTypeToAmount[encounterConsumedResource(encounter.type)] = -resourcesByDifficulty(encounter.difficulty);
    }
    console.log('Boosted attributes:', outcome.boostedAttributed);
    this.encounterOutcome = outcome;
    return outcome;
  }

  chooseEncounter() {
    console.log("Dive!")
    if (this.nextEncounters != undefined) {
      console.log("Next encounters are already chosen.");
      return;
    }

    this.nextEncounters = generateEncounters();
    this.encounterWindow = new EncounterWindow(this, {}, this.nextEncounters, 
                                               (encounter: Encounter) => this.generateEncounterOutcome(encounter),
                                               (encounter: Encounter) => this.resolveEncounter(encounter));
    this.add.existing(this.encounterWindow);
  }

  resolveEncounter(encounter: Encounter) {
    if (this.encounterOutcome === undefined) {
      this.encounterOutcome = this.generateEncounterOutcome(encounter);
    }
    if (this.encounterWindow != undefined && this.nextEncounters != undefined && this.encounterOutcome != undefined) {
      console.log("Resolving encounter ", encounter)
      for (let resourceType of [ResourceType.HULL, ResourceType.BIOFUEL, ResourceType.MATERIALS]) {
        this.submarine.addResourceAmount(resourceType, this.encounterOutcome.resourceTypeToAmount[resourceType]);
      }
      for (let encounterType of [EncounterType.FIGHT, EncounterType.SEARCH, EncounterType.UPGRADE]) {
        this.submarine.addAttribute(encounterType, this.encounterOutcome.boostedAttributed[encounterType]);
      }
      this.attributes.update();

      this.encounterWindow.destroy();
      this.nextEncounters = undefined;
      this.encounterOutcome = undefined;
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
