import Phaser from 'phaser'
import config from '../config'

/**
 * the player class
 *
 * @export
 * @class
 * @extends {Phaser.Sprite}
 */
export default class extends Phaser.Sprite {
  constructor ({ game, x, y, character, controls }) {
    super(game, x, y, character)

    this.game = game

    this.character = character
    this.controls = controls

    this.create()
  }

  create () {
    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this)

    this.body.bounce.y = 0.2
    this.body.gravity.y = 1000
    this.body.collideWorldBounds = true

    this.height = config.player.height
    this.damage = config.player.damage
    this.health = config.player.health

    //  Our two animations, walking left and right.
    this.animations.add('left', [0, 1, 2, 3], 10, true)
    this.animations.add('right', [5, 6, 7, 8], 10, true)

    this.createWeapon()
  }

  update () {
    //  Collide the player and the stars with the platforms
    // var hitPlatform = this.game.physics.arcade.collide(this, this.platforms)

    //  Reset the players velocity (movement)
    this.body.velocity.x = 0

    if (this.controls.left.isDown) {
      //  Move to the left
      this.body.velocity.x = -150

      this.animations.play('left')
      this.weapon.fireAngle = 180
    } else if (this.controls.right.isDown) {
      //  Move to the right
      this.body.velocity.x = 150

      this.animations.play('right')
      this.weapon.fireAngle = 0
    } else {
      //  Stand still
      this.animations.stop()
    }

    //  Allow the player to jump if they are touching the ground.
    if (this.controls.jump.isDown && this.body.touching.down) {
      this.body.velocity.y = -350
    }

    if (this.controls.fire.isDown) {
      this.weapon.fire()
    }
  }

  createWeapon () {
    this.weapon = this.game.add.weapon(20, 'star')
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    this.weapon.fireAngle = 0
    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 600
    this.weapon.fireRate = config.player.fireRate

    this.weapon.trackSprite(this, 0, (config.player.height / 2), false)
  }
}
