import ConnectObj from "../ConnectObj";
import { State } from "../MovementObj";
import { CollisionCategory } from "../PhyObj";

/**
 * player object
 */
export default class Player extends ConnectObj {
	/**
	 * @param {Phaser.Scene} scene physics world to place the player in
	 * @param {PlayerConfig} config config object
	 */
	constructor(scene, config) {
		super(
			scene,
			config.x,
			config.y,
			config.textureBody_Key,
			config.state,
			config.connCat,
			config.connWith,
			undefined,
			undefined,
			undefined,
			config.phyConfig
		);

		//general
		this.setName(config.name);

		this.setBody({
			type: "circle",
			addToWorld: true,
			radius: 20,
		});

		//#region input

		/**
		 * input directional
		 */
		this.inputDir = new Phaser.Math.Vector2();

		/** keyboard input keys */
		this.input_Keyboard = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
			jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
		});

		//#endregion
		//#region overrides

		super.moveInputMethod = this.getInputMovementVector;
		super.moveRotMethodSet(this.getInputRotationVector);
		super.connJumpInputMethod = this.getInputJumpVector;

		this.setFriction(0.1);
		this.setFrictionStatic(0.1);
		this.setDensity(1);

		super.move_ConnAirFric = 0.039;
		super.move_Speed = 0.5;
		super.connSpdJump = 5;
		super.move_RotSpeed = 0;

		super.connRange = 100;

		//#endregion
		//#region rotation

		// super.moveFrozenSet

		this.rotSpeed = {
			/**
			 * rotation speed minimum
			 * @type {number}
			 */
			rotSpdMin: 0.1, //0.13
			/**
			 * rotation speed maximum
			 * @type {number}
			 */
			rotSpdMax: 0.03, //0.05 >  > 0.03
			/**
			 * start of the speed range that scales rotation speed
			 * @type {number}
			 */
			rotSpdMinRange: 1,
			/**
			 * end of the speed range that scales rotation speed
			 * @type {number}
			 */
			rotSpdMaxRange: 2.5,
		};

		//#endregion

		//#region TEST TEST TEST TEST TEST TEST TEST TEST temporary TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST

		//used to update the air friction property
		super.connSetConnected(true);

		//#endregion
	}

	//#region phaser methods
	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {
		//update player input
		this.inputDir = this.getInputVector(this.inputDir);

		super.update(delta, time);
	}
	//#endregion
	//#region input

	/**
	 * gets the movement input as a vector
	 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
	 * @returns {Phaser.Math.Vector2} vector with a limit of 1
	 */
	getInputVector(vec2) {
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

		vec2 = this.inputDir.clone();

		return vec2;
	}

	/**
	 * gets the movement input as a vector
	 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
	 * @returns {Phaser.Math.Vector2} vector with a limit of 1
	 */
	getInputRotationVector(vec2) {
		if (vec2 == undefined) {
			vec2 = new Phaser.Math.Vector2();
		} else {
			vec2.reset();
		}

		let velocityRange = this.body.speed - this.rotSpeed.rotSpdMinRange;
		let velocityEnd =
			this.rotSpeed.rotSpdMaxRange - this.rotSpeed.rotSpdMinRange;

		//update rotation speed
		this.move_RotSpeed = Phaser.Math.Linear(
			this.rotSpeed.rotSpdMin,
			this.rotSpeed.rotSpdMax,
			// Phaser.Math.Easing.Expo.Out(
			Phaser.Math.Clamp(velocityRange / velocityEnd, 0, 1)
			// )
		);

		//update rotation vector
		vec2 = this.inputDir.clone();

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

		// vec2 = this.inputDir.clone();

		return vec2;
	}

	//#endregion
}

/**
 * @typedef {{
 * name: (string),
 * x: (number),
 * y: (number),
 * state: (State),
 * textureBody_Key: (string | Phaser.Textures.Texture),
 * connCat: (CollisionCategory | CollisionCategory[]),
 * connWith: (CollisionCategory | CollisionCategory[]),
 * phyConfig: (Phaser.Types.Physics.Matter.MatterBodyConfig | undefined),
 * }} PlayerConfig Config for a player object
 *
 */
