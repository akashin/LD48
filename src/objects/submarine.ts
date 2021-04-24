export class Submarine extends Phaser.GameObjects.Container {
    submarineSprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, params: object) {
        super(scene, 100, 100);

        this.submarineSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, 'submarine');
        this.submarineSprite.setScale(0.2, 0.2);
        this.add(this.submarineSprite);
    }
}
