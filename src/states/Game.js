/* globals __DEV__ */
import Phaser from 'phaser'
// import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {
    this.player = {}
    this.player2 = {}
    this.platforms = {}
    this.bullets = {}
    this.clashOptions = {
      fireRate: 200,
      nextFire: 0,
      playerHeight: 48,
      playerHealth: 100,
      playerDemage: 100
    }

    this.keys = {
      space: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    }
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

    //  Now let's create two ledges
    var ledge = this.platforms.create(400, 400, 'ground')
    ledge.body.immovable = true

    ledge = this.platforms.create(-150, 250, 'ground')
    ledge.body.immovable = true

    // The player and its settings
    this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude')
    this.player2 = this.game.add.sprite(32, this.game.world.height - 150, 'dude')

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player)
    this.game.physics.arcade.enable(this.player2)

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.body.bounce.y = 0.2
    this.player.body.gravity.y = 1000
    this.player.body.collideWorldBounds = true
    this.player.height = this.clashOptions.playerHeight
    this.player.demage = this.clashOptions.playerDemage
    this.player.health = this.clashOptions.playerHealth



    this.player2.body.bounce.y = 0.2
    this.player2.body.gravity.y = 1000
    this.player2.body.collideWorldBounds = true
    this.player2.height = this.clashOptions.playerHeight
    this.player2.demage = this.clashOptions.playerDemage
    this.player2.health = this.clashOptions.playerHealth

    //  Our two animations, walking left and right.
    this.player.animations.add('left', [0, 1, 2, 3], 10, true)
    this.player.animations.add('right', [5, 6, 7, 8], 10, true)

    this.weapon = this.game.add.weapon(20, 'star')
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 600
    this.weapon.fireRate = this.clashOptions.fireRate

    this.weapon.trackSprite(this.player, 0, this.clashOptions.playerHeight / 2, false)

    //  The score
    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' })

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys()
  }

  update () {
    //  Collide the player and the stars with the platforms
    var hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms)
    this.game.physics.arcade.collide(this.player2, this.platforms)
    this.game.physics.arcade.collide(this.stars, this.platforms)

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this)

    //  Reset the players velocity (movement)
    this.player.body.velocity.x = 0

    // TODO: player angle not bird-view
    if (this.cursors.left.isDown) {
      this.weapon.fireAngle = 180
    }

    if (this.cursors.right.isDown) {
      this.weapon.fireAngle = 0
    }

    if (this.cursors.left.isDown) {
      //  Move to the left
      this.player.body.velocity.x = -150

      this.player.animations.play('left')
    } else if (this.cursors.right.isDown) {
      //  Move to the right
      this.player.body.velocity.x = 150

      this.player.animations.play('right')
    } else {
      //  Stand still
      this.player.animations.stop()

      this.player.frame = 4
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
      this.player.body.velocity.y = -350
    }

    if (this.keys.space.isDown) {
      console.log(this.weapon.fireAngle)
      console.log(this.player2.health)
      this.weapon.fire()
    }
  }

  fire () {
    if (this.game.time.now > this.clashOptions.nextFire && this.bullets.countDead() > 0) {
      this.clashOptions.nextFire = this.game.time.now + this.clashOptions.fireRate

      var bullet = this.bullets.getFirstDead()

      bullet.reset(this.player.x - 8, this.player.y - 8)

      this.game.physics.arcade.moveToPointer(bullet, 300)
    }
  }

  render () {
    // if (__DEV__) {
    //   this.game.debug.spriteInfo(this.mushroom, 32, 32)
    // }
  }
}
