import { CONST, GRAPHICS_CONST } from '../const';

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export enum EncounterType {
  FIGHT = 0,
  SEARCH = 1,
  UPGRADE = 2,
}

export class EncounterOutcome {
  text?: string;
  roll?: number;
  checkDifficulty?: number;
  success?: boolean;
  resourceTypeToAmount: Array<number> = [0, 0, 0];
  boostedAttributed: Array<number> = [0, 0, 0];

  constructor() {
  }
}

export class Encounter {
  title: string
  difficulty: Difficulty
  type: EncounterType
  damage: number
  repair: number

  constructor(title: string, difficulty: Difficulty, type: EncounterType) {
    this.title = title;
    this.difficulty = difficulty;
    this.type = type;
    this.damage = 0;
    this.repair = 0;
  }
}

export class EncounterCard extends Phaser.GameObjects.Container {
  encounterBg: Phaser.GameObjects.Rectangle;
  private encounter: Encounter;
  private outcomeBar: Phaser.GameObjects.Container;

  private rollBox: Phaser.GameObjects.Rectangle;
  private rollText: Phaser.GameObjects.Text;
  private difBox: Phaser.GameObjects.Rectangle;
  private difText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, encounter: Encounter) {
    super(scene);
    this.encounter = encounter;

    let W = GRAPHICS_CONST.encounderCardWidth;
    let H = GRAPHICS_CONST.encounderCardHeight;

    this.encounterBg = new Phaser.GameObjects.Rectangle(this.scene, W / 2, H / 2, W, H, 0x6666FF);
    this.add(this.encounterBg);

    let encounterSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'hammer');
    encounterSprite.setOrigin(0, 0);
    encounterSprite.setDisplaySize(128, 128);
    this.add(encounterSprite);

    let encounterText = new Phaser.GameObjects.Text(this.scene, 10, 128 + 10, encounter.title, {color: 'white', fontSize: '12pt'});
    this.add(encounterText);

    this.outcomeBar = new Phaser.GameObjects.Container(scene, 30, 128 + 30);
    {
      this.rollBox = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 30, 30, 0x705114);
      this.rollBox.setOrigin(0, 0);
      this.outcomeBar.add(this.rollBox);

      this.rollText = new Phaser.GameObjects.Text(this.scene, 0, 0, '', {color: 'white', fontSize: '12pt'});
      this.rollText.setOrigin(0, 0);
      this.rollText.alpha = 0.0;
      this.outcomeBar.add(this.rollText);

      let vsText = new Phaser.GameObjects.Text(this.scene, 35, 8, 'VS', {color: 'white', fontSize: '12pt'});
      vsText.setOrigin(0, 0);
      this.outcomeBar.add(vsText);

      this.difBox = new Phaser.GameObjects.Rectangle(this.scene, 60, 0, 30, 30, 0x705114);
      this.difBox.setOrigin(0, 0);
      this.outcomeBar.add(this.difBox);

      this.difText = new Phaser.GameObjects.Text(this.scene, 60, 0, '', {color: 'white', fontSize: '12pt'});
      this.difText.setOrigin(0, 0);
      this.outcomeBar.add(this.difText);
    }
    this.add(this.outcomeBar);

    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, W, H), Phaser.Geom.Rectangle.Contains);
  }

  private updateOutcome(roll?: number, dif?: number): void {
    this.rollText.setText(String(roll));
    let rollTextBounds = this.rollText.getBounds();
    this.rollText.setPosition(this.rollBox.x + (30 - rollTextBounds.width) / 2, this.rollBox.y + (30 - rollTextBounds.height) / 2);

    this.difText.setText(String(dif));
    let difTextBounds = this.difText.getBounds();
    this.difText.setPosition(this.difBox.x + (30 - difTextBounds.width) / 2, this.difBox.y + (30 - difTextBounds.height) / 2);
  }

  onEncounterResults(outcome: EncounterOutcome, onEncounterChosen: any): void {
    this.updateOutcome(outcome.roll, outcome.checkDifficulty);

    let timeline = this.scene.tweens.timeline({
      onComplete: onEncounterChosen,
    });
    timeline.add({
      targets: this.rollText,
      alpha: 1.0,
      duration: 2000,
    });
    timeline.add({
      targets: this.rollText,
      alpha: 1.0,
      duration: 1000,
    });

    timeline.play();
  }
}

export class EncounterWindow extends Phaser.GameObjects.Container {
  generateOutcome: any;
  onComplete: any;
  encounterCards: Array<EncounterCard>;

  constructor(scene: Phaser.Scene, params: object, encounters: any, generateOutcome: any, onComplete: any) {
    super(scene, 0, 0);
    this.generateOutcome = generateOutcome;
    this.onComplete = onComplete;
    this.encounterCards = new Array<EncounterCard>();

    for (let i = 0; i < encounters.length; ++i) {
      let encounterCard = new EncounterCard(scene, encounters[i]);
      encounterCard.setX(50 + i * (GRAPHICS_CONST.encounderCardWidth + 10));
      encounterCard.setY(50);
      this.add(encounterCard);
      this.encounterCards.push(encounterCard);
      let callback = (pointer: any) => this.showSummary(encounters[i]);
      encounterCard.on('pointerdown', () => encounterCard.onEncounterResults(generateOutcome(encounters[i]), callback));

      let W = GRAPHICS_CONST.encounderCardWidth;
      let H = GRAPHICS_CONST.encounderCardHeight;
      encounterCard.on('pointerover', () => {
        scene.tweens.add({
          targets: encounterCard.encounterBg,
          displayWidth: W + 10,
          displayHeight: H + 10,
          duration: 50,
          ease: 'Sin',
        });
      }, this)
      encounterCard.on('pointerout', () => {
        scene.tweens.add({
          targets: encounterCard.encounterBg,
          displayWidth: W + 0,
          displayHeight: H + 0,
          duration: 50,
          ease: 'Sin',
        });
      })
    }
  }

  showSummary(encounter: Encounter) {
    for (let encounterObject of this.encounterCards) {
      encounterObject.destroy();
    }

    var summaryText = "Summary: ";
    if (encounter.damage !== undefined) {
      summaryText += "damage: " + encounter.damage + "\n";
    }
    if (encounter.repair !== undefined) {
      summaryText += "repair: " + encounter.repair + "\n";
    }
    let encounterSummary = this.scene.add.text(250, 50, summaryText, { color: 'white', fontSize: '24pt' });
    this.add(encounterSummary);
    encounterSummary.setInteractive();
    encounterSummary.on('pointerdown', (pointer: any) => this.onComplete(encounter));
  }
}
