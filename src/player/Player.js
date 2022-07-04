/**
 * player object
 */
export default class Player extends Phaser.Physics.Matter.Sprite {
	/**
	 * @param {Phaser.Physics.Matter.World} world physics world to place the player in
	 * @param {number} x player position x
	 * @param {number} y player position y
	 */
	constructor(world, x, y) {
		super(world, x, y);
		this.addToDisplayList();
		this.addToUpdateList();
	}

	preload() {}

	create() {
		this.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		console.log("Player - create done");
	}

	preUpdate() {}
	update() {
		const speed = 2.5;
		let playerVelocity = new Phaser.Math.Vector2();

		playerVelocity.x = this.inputKeys.right.isDown - this.inputKeys.left.isDown;
		playerVelocity.y = this.inputKeys.down.isDown - this.inputKeys.up.isDown;

		playerVelocity.normalize();
		playerVelocity.scale(speed);
		this.move(playerVelocity.x, playerVelocity.y);
	}

	move(x, y) {
		console.log("moving");
		this.setVelocity(x, y);
		this.setAwake();
	}
}
