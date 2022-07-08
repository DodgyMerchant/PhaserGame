import ConnectObj from "../ConnectObj";

/**
 * player object
 */
export default class Player extends ConnectObj {
	/**
	 * @param {Phaser.Scene} scene physics world to place the player in
	 * @param {number} config config object
	 */
	constructor(scene, config) {
		super(
			scene,
			config.x,
			config.y,
			config.textureBody_Key,
			config.state,
			config.collCat,
			config.collWith
		);

		//general
		this.setName("PlayerObject");

		this.setBody({
			type: "circle",
			addToWorld: true,
			radius: 20,
		});

		///// phys setup

		this.setFriction(0.1);
		this.setFrictionStatic(0.5);
		this.setDensity(1);

		//#region input

		this.input_Keyboard = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		//#endregion

		//#region overrides

		super.moveInputMethod = this.getInputMovementVector;
		super.connJumpInputMethod = this.getInputJumpVector;

		super.moveConnAirFric = 0.05;
		super.moveSpeed = 0.5;
		super.connSpdJump = 5;

		//#endregion

		// TEST TEST TEST TEST TEST TEST TEST TEST temporary TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST

		//used to update the air friction property
		super.connSetConnected(true);
	}

	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {
		super.update(delta, time);
	}

	//#region input

	/**
	 * gets the movement input as a vector
	 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
	 * @returns {Phaser.Math.Vector2} vector with a limit of 1
	 */
	getInputMovementVector(vec2) {
		if (vec2 == undefined) {
			vec2 = new Phaser.Math.Vector2();
		} else {
			vec2.reset();
		}

		// #region gamepad
		if (this.scene.input.gamepad.total > 0) {
			var gamepad = this.scene.input.gamepad.gamepads[0];

			if (gamepad.axes.length) {
				vec2.x = gamepad.axes[0].getValue();
				vec2.y = gamepad.axes[1].getValue();
			}
		}
		//#endregion
		//#region keyboard

		vec2.x +=
			this.input_Keyboard.right.isDown - this.input_Keyboard.left.isDown;
		vec2.y += this.input_Keyboard.down.isDown - this.input_Keyboard.up.isDown;

		// #endregion

		vec2.limit(1);
		return vec2;
	}

	/**
	 * gets the jumping input as a vector
	 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
	 * @returns {Phaser.Math.Vector2} vector with a limit of 1
	 */
	getInputJumpVector(vec2) {
		if (vec2 == undefined) {
			vec2 = new Phaser.Math.Vector2();
		} else {
			vec2.reset();
		}

		// #region gamepad
		// if (this.scene.input.gamepad.total > 0) {
		// 	var gamepad = this.scene.input.gamepad.gamepads[0];

		// 	if (gamepad.axes.length) {
		// 		vec2.x = gamepad.axes[0].getValue();
		// 		vec2.y = gamepad.axes[1].getValue();
		// 	}
		// }
		//#endregion
		//#region keyboard

		// vec2.x +=
		// 	this.input_Keyboard.right.isDown - this.input_Keyboard.left.isDown;
		// vec2.y += this.input_Keyboard.down.isDown - this.input_Keyboard.up.isDown;

		// #endregion

		vec2.limit(1);
		return vec2;
	}

	//#endregion
}
