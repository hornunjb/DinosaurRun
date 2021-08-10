import Phaser from 'phaser';

class PlayScene extends Phaser.Scene {

  constructor() {
    super('PlayScene');
  }

  create() {
    this.isGameRunning = false;
    this.gameSpeed = 10;
    const {height, width} = this.game.config;

    //cretes invisible box that when the dinosaur hits, the game starts
    this.startTrigger = this.physics.add.sprite(0, 10).setOrigin(0, 1).setImmovable();
    //scrollable infinite structure which we use as ground
    this.ground = this.add.tileSprite(0, height, 88, 26, 'ground').setOrigin(0, 1)
    //dinosaur
    this.dino = this.physics.add.sprite(0, height, 'dino-idle')
    .setOrigin(0, 1)
    .setCollideWorldBounds(true)
    //strength the dinosaur will be pulled to the ground at 5000 pixels per second
    .setGravityY(5000);

    this.initAnims();
    this.initStartTrigger();
    this.handleInputs();

  }

  //whenver dinosaur hits invisible box this fires to start game
  initStartTrigger() {
    const {width, height} = this.game.config;
    //overlaps box on dinosaur
    this.physics.add.overlap(this.startTrigger, this.dino, () => {
      //moves trigger when hit
      if(this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, height);
        return;
      }
      //executes trigger only once, since it overlaps with the dinosaur now
      this.startTrigger.disableBody(true, true);

      const startEvent = this.time.addEvent({
        delay: 1000/60,
        loop: true,
        callbackScope: this,
        //callback executes 60 times per second
        //when the ground has the size of the canvas width, we start the game
        callback: () => {
          this.dino.setVelocityX(80);
          this.dino.play('dino-run', 1);

          if(this.ground.width < width) {
            this.ground.width += 17 * 2;
          }

          if(this.ground.width >= width) {
            this.ground.width = width;
            this.isGameRunning = true;
            this.dino.setVelocity(0);
            startEvent.remove();
          }
        }
      });

    }, null, this)
  }

  initAnims() {
    //uses the dino-run png using the last two frames to create the running animation
    this.anims.create({
      key: 'dino-run',
      //frame starts at index zero, that's why we have the start and end values at 2 and 3
      frames: this.anims.generateFrameNumbers('dino', {start: 2, end: 3}),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      //dinosaur is ducking
      key: 'dino-down-anim',
      frames: this.anims.generateFrameNumbers('dino-down', {start: 0, end: 1}),
      frameRate: 10,
      repeat: -1,
    })

    this.anims.create({
      //enemy bird
      key: 'enemy-dino-fly',
      frames: this.anims.generateFrameNumbers('enemy-bird', {start: 0, end: 1}),
      frameRate: 6,
      repeat: -1,
    })
  }

  handleInputs() {
    //jumping
    this.input.keyboard.on('keydown_SPACE', () => {
      //prevents dinosaur from jumping mid-air
      if(!this.dino.body.onFloor()) {return;}
      //normal height of dinosaur
      this.dino.body.height = 92;
      //doesn't need offset since we are just jumping, dinosaur not changing
      this.dino.body.offset.y = 0;
      this.dino.setVelocityY(-1600);
    })

    //ducking
    this.input.keyboard.on('keydown_DOWN', () => {
      //prevents dinosaur from jumping mid-air
      if(!this.dino.body.onFloor()) {return;}
      // 34 + 58 = 92
      this.dino.body.height = 58;
      //needs offset because we are ducking, dino is changing
      this.dino.body.offset.y = 34;
    })

    //goes back to original position
    this.input.keyboard.on('keydown_UP', () => {
      this.dino.body.height = 92;
      this.dino.body.offset.y = 0;
    })
  }


  //update is called 60 times per second (60fps)
  update() {
    //nothing happens unless game is running
    if (!this.isGameRunning) {return;}
    //every update the ground will move gameSpeed pixels
    this.ground.tilePositionX += this.gameSpeed;

    //if the dinosaur is changing position, then we are jumping so we stop the animations
    if(this.dino.body.deltaAbsY() > 0) {
      this.dino.anims.stop();
      this.dino.setTexture('dino', 0);
    }
    //sets ducking animation
    else {
      this.dino.body.height <= 58 ? this.dino.play('dino-down-anim', true) : 
      this.dino.play('dino-run', true);
    }

  }

}

export default PlayScene;
