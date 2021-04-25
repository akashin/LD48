export class Encounter {
  title: string
  damage?: number
  repair?: number

  constructor(title: string, params: { damage?: number, repair?: repair }) {
    this.title = title;
    this.damage = params.damage;
    this.repair = params.repair;
  }
}

export class EncounterWindow extends Phaser.GameObjects.Container {
  onEncounterChosen: any;
  encounters: Array<Phaser.GameObjects.GameObject>;

  constructor(scene: Phaser.Scene, params: object, encounters: any, onEncounterChosen: any) {
    super(scene, 0, 0);
    this.onEncounterChosen = onEncounterChosen;
    this.encounters = new Array<Phaser.GameObjects.GameObject>();

    for (let i = 0; i < encounters.length; ++i) {
      var encounterText = scene.add.text(30, 70 + i * 20, encounters[i].title, {color: 'white', fontSize: '12pt'});
      this.add(encounterText);
      this.encounters.push(encounterText);
      encounterText.setInteractive();
      encounterText.on('pointerdown', (pointer: any) => this.chooseEncounter(encounters[i]));
    }
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
