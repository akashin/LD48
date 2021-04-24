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
  constructor(scene: Phaser.Scene, params: object, encounters: any, onEncounterChosen: any) {
    super(scene, 0, 0);

    for (let i = 0; i < encounters.length; ++i) {
      var encounterText = scene.add.text(30, 70 + i * 20, encounters[i].title, {color: 'white', fontSize: '12pt'});
      this.add(encounterText);
      encounterText.setInteractive();
      // encounterText.on('pointerdown', (pointer: any) => console.log(i));
      encounterText.on('pointerdown', (pointer: any) => onEncounterChosen(i));
    }
  }
}
