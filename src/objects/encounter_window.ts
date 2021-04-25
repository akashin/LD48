import { GRAPHICS_CONST } from '../const';

export class Encounter {
  title: string
  damage?: number
  repair?: number

  constructor(title: string, params: { damage?: number, repair?: number }) {
    this.title = title;
    this.damage = params.damage;
    this.repair = params.repair;
  }
}

export class EncounterWindow extends Phaser.GameObjects.Container {
  onEncounterChosen: any;
  encounters: Array<Phaser.GameObjects.Container>;

  constructor(scene: Phaser.Scene, params: object, encounters: any, onEncounterChosen: any) {
    super(scene, 0, 0);
    this.onEncounterChosen = onEncounterChosen;
    this.encounters = new Array<Phaser.GameObjects.Container>();

    for (let i = 0; i < encounters.length; ++i) {
      var encounterContainter = this.makeEncounterContainer(encounters[i]);
      encounterContainter.setX(50 + i * (GRAPHICS_CONST.encounderCardWidth + 10));
      encounterContainter.setY(50);
      this.add(encounterContainter);
      this.encounters.push(encounterContainter);
      encounterContainter.on('pointerdown', (pointer: any) => this.chooseEncounter(encounters[i]));
    }
  }

  makeEncounterContainer(encounter: Encounter): Phaser.GameObjects.Container {
    let encounterContainer = new Phaser.GameObjects.Container(this.scene, 0, 0);

    let encounterBg = new Phaser.GameObjects.Rectangle(
      this.scene, 0, 0, GRAPHICS_CONST.encounderCardWidth, GRAPHICS_CONST.encounderCardHeight, 0x6666FF);
    encounterBg.setOrigin(0, 0);
    encounterContainer.add(encounterBg);

    let encounterSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'hammer');
    encounterSprite.setOrigin(0, 0);
    encounterSprite.setDisplaySize(128, 128);
    encounterContainer.add(encounterSprite);

    let encounterText = new Phaser.GameObjects.Text(
      this.scene, 10, 128 + 10, encounter.title, {color: 'white', fontSize: '12pt'});
    encounterContainer.add(encounterText);

    encounterContainer.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, GRAPHICS_CONST.encounderCardWidth, GRAPHICS_CONST.encounderCardHeight),
      Phaser.Geom.Rectangle.Contains,
    );

    return encounterContainer;
  }

  chooseEncounter(encounter: Encounter) {
    for (let encounterObject of this.encounters) {
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
    encounterSummary.on('pointerdown', (pointer: any) => this.onEncounterChosen(encounter));
  }
}
