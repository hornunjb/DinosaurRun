import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    const {height, width} = this.game.config;

    //adds scrollable infinite structure which we use as ground
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground').setOrigin(0, 1)
    //adds dinosaur
    this.dino = this.physics.add.sprite(0, height, 'dino-idle').setOrigin(0, 1);
  }

  update() {

  }

}

export default PlayScene;
