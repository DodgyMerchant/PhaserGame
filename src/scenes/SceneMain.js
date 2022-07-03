export default class SceneMain extends Phaser.Scene {
	constructor() {
		super("SceneMain");
	}

	preload() {
		console.log("preload");
	}
	create() {
		console.log("createeeeee");
		this.player = new Phaser.Physics.Matter.Sprite(this.matter.world);
		// this.player.setSleepThreshold(-1);

		this.inputKeys = this.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});
	}
	update() {
		const speed = 2.5;
		let playerVelocity = new Phaser.Math.Vector2();

		playerVelocity.x = this.inputKeys.right.isDown - this.inputKeys.left.isDown;
		playerVelocity.y = this.inputKeys.down.isDown - this.inputKeys.up.isDown;

		playerVelocity.normalize();
		playerVelocity.scale(speed);
		this.player.setVelocity(playerVelocity.x, playerVelocity.y);
    this.player.setAwake();
	}
}
