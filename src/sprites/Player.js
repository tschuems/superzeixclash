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
  constructor ({ game, x, y, character, controls, sounds }) {
    super(game, x, y, character)

    this.game = game

    this.knockOut = false

    this.character = character
    this.controls = controls

    this.sounds = sounds

    this.create()
    this.createHUD(x)
  }

  create () {
    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this)

    this.body.bounce.y = 0
    this.body.gravity.y = config.player.gravity
    this.body.collideWorldBounds = true

    this.height = config.player.height
    this.width = config.player.width
    this.damage = config.player.damage
    this.health = config.player.health

    //  Our two animations, walking left and right.
    this.animations.add('stay_left', [6, 7], 2.5, true)
    this.animations.add('stay_right', [8, 9], 2.5, true)
    this.animations.add('left', [1, 2, 3, 4, 5], 10, true)
    this.animations.add('right', [10, 11, 12, 13, 14], 10, true)

    this.animations.add('hit_left', [0, 7], 1, true)
    this.animations.add('hit_right', [8, 15], 1, true)

    this.createWeapon()
  }

  update () {
    //  Reset the players velocity (movement)
    this.body.velocity.x = 0
    this.display.life.text = 'lives:' + this.health + '/' + config.player.health

    if (!this.knockOut) {
      if (this.controls.left.isDown) {
        //  Move to the left
        this.body.velocity.x = -config.player.velocity

        this.animations.play('left')
        this.weapon.fireAngle = 180
      } else if (this.controls.right.isDown) {
        //  Move to the right
        this.body.velocity.x = config.player.velocity

        this.animations.play('right')
        this.weapon.fireAngle = 0
      } else if (this.weapon.fireAngle === 0) {
        //  Stand still
        this.animations.play('stay_right')
      } else {
        this.animations.play('stay_left')
      }

      //  Allow the player to jump if they are touching the ground.
      if (this.controls.jump.isDown && this.body.touching.down) {
        this.body.velocity.y = -config.player.jump
      }

      if (this.controls.fire.isDown && this.alive) {
        this.sounds.shoot.play()
        this.weapon.fire()
      }
    }
  }

  hit () {
    this.knockOut = true
    this.sounds.hit.play()
    if (this.weapon.fireAngle === 0) {
      console.log('hit right')
      this.animations.play('hit_right')
    } else {
      console.log('hit left')
      this.animations.play('hit_left')
    }

    this.knockOut = false

    // setTimeout(() => {
    //   this.knockOut = true
    // }, 0)
  }

  createHUD (x) {
    this.display = {
      // name: this.game.add.text(x, 16, 'Name', { fontSize: '32px', fill: '#000' }),
      life: this.game.add.text(x + 10, 10, 'lives:' + this.health + '/' + config.player.health, { fontSize: '16px', fill: '#000' })
    }
  }

  createWeapon () {
    this.weapon = this.game.add.weapon(20, 'trumpet')
    this.weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS

    this.weapon.fireAngle = 0
    //  The speed at which the bullet is fired
    this.weapon.bulletSpeed = 600
    this.weapon.fireRate = config.player.fireRate

    this.weapon.trackSprite(this, 0, (config.player.height / 2), false)
  }
}
