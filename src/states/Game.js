/* globals __DEV__ */
import Phaser from 'phaser'
import Player from '../sprites/Player'

import config from '../config'

export default class extends Phaser.State {
  init () {
    this.platforms = {}
  }
  preload () {
    // load level
    this.game.load.image('background', 'assets/levels/background.png')

    this.game.load.image('ground', 'assets/platform.png')
    this.game.load.image('trumpet', 'assets/characters/marcel/weapon.png')

    // load all characters
    this.game.load.spritesheet('dude', 'assets/characters/dude.png', 32, 48)
    this.game.load.spritesheet('marcel', 'assets/characters/marcel/character.png', 100, 150)

    // sounds general
    this.game.load.audio('ah', 'assets/sounds/ah.mp3')
    this.game.load.audio('bulletCollission', 'assets/sounds/bulletCollission.mp3')

    // sounds marcel
    this.game.load.audio('marcelHit', 'assets/sounds/marcel/hit.wav')
    this.game.load.audio('marcelDeath', 'assets/sounds/marcel/death.wav')
  }

  create () {
    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    //  A simple background for our game
    this.game.add.sprite(0, 0, 'background')

    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.game.add.group()

    //  We will enable physics for any object that is created in this group
    this.platforms.enableBody = true

    // Here we create the ground.
    var ground = this.platforms.create(0, this.game.world.height - 64, 'ground')

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(4, 2)

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true

    // general sounds
    this.sounds = {
      bulletCollission: this.game.add.audio('bulletCollission')
    }

    // player Sounds sounds
    var ah = this.game.add.audio('ah')

    // marcel sounds
    var marcelHit = this.game.add.audio('marcelHit')
    var marcelDeath = this.game.add.audio('marcelDeath')

    // The player and its settings
    this.player = new Player({
      game: this.game,
      x: 0,
      y: 0,
      character: 'marcel',
      controls: {
        jump: this.game.input.keyboard.addKey(Phaser.KeyCode.W),
        left: this.game.input.keyboard.addKey(Phaser.KeyCode.A),
        right: this.game.input.keyboard.addKey(Phaser.KeyCode.D),
        crouch: this.game.input.keyboard.addKey(Phaser.KeyCode.S),
        fire: this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT)
      },
      sounds: {
        hit: marcelHit,
        death: marcelDeath
      }
    })

    this.player2 = new Player({
      game: this.game,
      x: this.world.width - 32,
      y: 0,
      character: 'marcel',
      controls: {
        jump: this.game.input.keyboard.addKey(Phaser.KeyCode.UP),
        left: this.game.input.keyboard.addKey(Phaser.KeyCode.LEFT),
        right: this.game.input.keyboard.addKey(Phaser.KeyCode.RIGHT),
        crouch: this.game.input.keyboard.addKey(Phaser.KeyCode.DOWN),
        fire: this.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR)
      },
      sounds: {
        hit: marcelHit,
        death: marcelDeath
      }
    })

    //  We need to enable physics on the player
    this.game.add.existing(this.player)
    this.game.add.existing(this.player2)

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys()
  }

  update () {
    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.player2, this.platforms)

    // //  Run collision
    this.game.physics.arcade.overlap(this.player2, this.player.weapon.bullets, this.collisionHandler)
    this.game.physics.arcade.overlap(this.player, this.player2.weapon.bullets, this.collisionHandler)

    this.game.physics.arcade.overlap(this.player.weapon.bullets, this.player2.weapon.bullets, (bullet, bullet2) => {
      this.sounds.bulletCollission.play()
      bullet.kill()
      bullet2.kill()
    })

    if (!this.player.alive || !this.player2.alive) {
      // this.endGame()
    }
  }

  collisionHandler (player, bullet) {
    // display lives
    bullet.destroy()
    player.health = player.health - config.player.damage

    if (player.health <= 0) {
      player.sounds.death.play()
      player.kill()
      // player.destroy()
    } else {
      player.hit()
      player.animations.play('hit')
    }

    console.log('player health: ' + player.health + ' player isAlive: ' + player.alive)

    this.stateText = 'GAME OVER \n Click to restart'
  }

  endGame () {
    this.game.paused = true
    this.game.add.text(this.game.world.centerX - 150, this.game.world.centerY - 100, 'game over', { font: '60px Raleway' })

    this.rePlay = this.game.add.sprite(this.game.world.centerX - 150, this.game.world.centerY + 100, 'rePlay')
    this.rePlay.anchor.setTo(0.5, 0.5)
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.player, 32, 32)
    // }
  }
}
