import { Submarine } from "./submarine";

export class AttributesUI extends Phaser.GameObjects.Container {
  private submarine: Submarine;

  private titleText: Phaser.GameObjects.Text;
  private attributeTexts: Array<Phaser.GameObjects.Text>;

  constructor(scene: Phaser.Scene, submarine: Submarine) {
    super(scene, 0, 0);
    this.submarine = submarine;

    this.titleText = new Phaser.GameObjects.Text(scene, 0, 0, 'Attributes', {color: 'white', fontSize: '22pt'});
    // this.titleText.setX(-this.titleText.getBounds().width);
    this.add(this.titleText);

    this.attributeTexts = new Array<Phaser.GameObjects.Text>();
    this.attributeTexts.push(new Phaser.GameObjects.Text(scene, 0, 30, '', {color: 'white', fontSize: '20pt'}));
    this.attributeTexts.push(new Phaser.GameObjects.Text(scene, 0, 60, '', {color: 'white', fontSize: '20pt'}));
    this.attributeTexts.push(new Phaser.GameObjects.Text(scene, 0, 90, '', {color: 'white', fontSize: '20pt'}));

//     this.attributeTexts[0].setInteractive();
//     this.attributeTexts[0].on('pointerdown', function() {
//       if (submarine.freeAttributesToSpend > 0) {
//         submarine.enginePower += 1;
//         submarine.freeAttributesToSpend -= 1;
//       }
//     }, this);
// 
//     this.attributeTexts[1].setInteractive();
//     this.attributeTexts[1].on('pointerdown', function() {
//       if (submarine.freeAttributesToSpend > 0) {
//         submarine.firePower += 1;
//         submarine.freeAttributesToSpend -= 1;
//       }
//     }, this);
// 
//     this.attributeTexts[2].setInteractive();
//     this.attributeTexts[2].on('pointerdown', function() {
//       if (submarine.freeAttributesToSpend > 0) {
//         submarine.navigation += 1;
//         submarine.freeAttributesToSpend -= 1;
//       }
//     }, this);

    for (var i = 0; i < this.attributeTexts.length; ++i) {
      this.add(this.attributeTexts[i]);
    }
    this.update();
  }

  update(): void {
    // this.titleText.setText('Skills:' + this.submarine.freeAttributesToSpend);
    this.titleText.setText('Skills:');
    this.updateAttributeText(this.attributeTexts[0], 'Fighting', this.submarine.firePower, this.submarine.freeAttributesToSpend);
    this.updateAttributeText(this.attributeTexts[1], 'Exploration', this.submarine.navigation, this.submarine.freeAttributesToSpend);
    this.updateAttributeText(this.attributeTexts[2], 'Crafting', this.submarine.enginePower, this.submarine.freeAttributesToSpend);
  }

  private updateAttributeText(attributeText: Phaser.GameObjects.Text, attributeName: string, level: number, freeAttributes: number): void {
    attributeText.setText(attributeName);
    // let width = attributeText.getBounds().width;
    // attributeText.setX(-width);

    let text = attributeName + ':' + level;
    // if (freeAttributes > 0) {
    //   text += ' +';
    // }
    attributeText.setText(text);
  }
}
