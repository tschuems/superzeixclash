/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {
  init () {
    this.platforms = {}
  }
  preload () {
    // load level
    this.game.load.image('sky', 'assets/levels/sky.png')

    this.game.load.image('ground', 'assets/platform.png')
    this.game.load.image('star', 'assets/star.png')

    // load all characters
    this.game.load.spritesheet('dude', 'assets/characters/dude.png', 32, 48)
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'sky')

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group()

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true

    // Here we create the ground.
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2)

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true

    // The player and its settings
    this.player = new Player({
      game: this.game,
      x: 0,
      y: 0,
      character: 'dude',
      controls: {
        jump: this.game.input.keyboard.addKey(Phaser.KeyCode.UP),
        left: this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT),
        right: this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT),
        crouch: this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN),
        fire: this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
      }
    })

    this.game.add.existing(this.player)

    // Prevent directions and space key events bubbling up to browser,
    // since these keys will make web page scroll which is not
    // expected.
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ])
  }

  update () {
    this.game.physics.arcade.collide(this.player, this.platforms)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.player, 32, 32)
    }
  }
}
