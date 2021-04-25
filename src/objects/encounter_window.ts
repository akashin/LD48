import { CONST, GRAPHICS_CONST } from '../const';

export enum Difficulty {
  EASY,
  MEDIUM,
  HARD,
}

export enum EncounterType {
  FIGHT,
  SEARCH,
  UPGRADE,
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
  private encounter: Encounter;
  private difficultyBar: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, encounter: Encounter) {
    super(scene);
    this.encounter = encounter;

    let W = GRAPHICS_CONST.encounderCardWidth;
    let H = GRAPHICS_CONST.encounderCardHeight;

    let encounterBg = new Phaser.GameObjects.Rectangle(this.scene, W / 2, H / 2, W, H, 0x6666FF);
    // encounterBg.setInteractive();
    encounterBg.on('pointerover', () => {
      scene.tweens.add({
        targets: encounterBg,
        displayWidth: W + 10,
        displayHeight: H + 10,
        duration: 50,
        ease: 'Sin',
      });
    }, this)
    encounterBg.on('pointerout', () => {
      scene.tweens.add({
        targets: encounterBg,
        displayWidth: W + 0,
        displayHeight: H + 0,
        duration: 50,
        ease: 'Sin',
      });
    })
    this.add(encounterBg);

    let encounterSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'hammer');
    encounterSprite.setOrigin(0, 0);
    encounterSprite.setDisplaySize(128, 128);
    this.add(encounterSprite);

    let encounterText = new Phaser.GameObjects.Text(this.scene, 10, 128 + 10, encounter.title, {color: 'white', fontSize: '12pt'});
    this.add(encounterText);

    this.difficultyBar = new Phaser.GameObjects.Container(scene, 10, 128 + 30);
    this.add(this.difficultyBar);
    {
      let probabilities = [2, 3, 2];
      let x = 0;
      for (var level = 0; level < probabilities.length; ++level) {
        for (var i = 0; i < probabilities[level]; ++i) {
          let rect = new Phaser.GameObjects.Rectangle(this.scene, x, 0, 5, 10, CONST.difficulyLevelColor[level]);
          rect.setOrigin(0, 0);
          rect.alpha = 0.5;
          this.difficultyBar.add(rect);
          x += 5 + 2;
        }
        x += 2;
      }
    }

    this.setInteractive(new Phaser.Geom.Rectangle(0, 0, W, H), Phaser.Geom.Rectangle.Contains);
  }

  onEncounterResults(diceResult: number, onEncounterChosen: any): void {
    let timeline = this.scene.tweens.timeline();

    console.log("HELLO!");

    for (var child of this.difficultyBar.getAll()) {
      if (diceResult == 0) {
        break;
      }
      let rect = child as Phaser.GameObjects.Rectangle;
      // rect.alpha = 1.0;

      timeline.add({
        targets: rect,
        alpha: 1.0,
        duration: 500,
      });

      --diceResult;
    }

    timeline.play();
  }
}

export class EncounterWindow extends Phaser.GameObjects.Container {
  onComplete: any;
  encounterCards: Array<EncounterCard>;

  constructor(scene: Phaser.Scene, params: object, encounters: any, onComplete: any) {
    super(scene, 0, 0);
    this.onComplete = onComplete;
    this.encounterCards = new Array<EncounterCard>();

    for (let i = 0; i < encounters.length; ++i) {
      let encounterCard = new EncounterCard(scene, encounters[i]);
      encounterCard.setX(50 + i * (GRAPHICS_CONST.encounderCardWidth + 10));
      encounterCard.setY(50);
      this.add(encounterCard);
      this.encounterCards.push(encounterCard);
      let callback = (pointer: any) => this.showSummary(encounters[i]);
      encounterCard.on('pointerdown', () => encounterCard.onEncounterResults(5, callback));
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
