import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    this.gameSpeed = 10;
    const {height, width} = this.game.config;

    //scrollable infinite structure which we use as ground
    this.ground = this.add.tileSprite(0, height, width, 26, 'ground').setOrigin(0, 1)
    //dinosaur
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    //strength the dinosaur will be pulled to the ground at 5000 pixels per second
    .setGravityY(5000);

    this.handleInputs();
  }

  handleInputs() {
    //jumping
    this.input.keyboard.on('keydown_SPACE', () => {
      //prevents dinosaur from jumping mid-air
      if(!this.dino.body.onFloor()) {return;}
      this.dino.setVelocityY(-1600);
    })
  }


  //update is called 60 times per second (60fps)
  update() {
    //every update the ground will move gameSpeed pixels
    this.ground.tilePositionX += this.gameSpeed;
  }

}

export default PlayScene;
