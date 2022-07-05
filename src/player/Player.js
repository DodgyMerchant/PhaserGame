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

		//general
		this.setActive();
		this.setName("Player");
		this.world = world;

		//input
		this.input_Keyboard = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		this.input_vector = new Phaser.Math.Vector2();

		//#region--------------movement-----------------
		/** if player/system input to movement is possible */
		this.move_canMove = true;

		/** movement input and movement are disabled */
		this.frozen = false;

		//move speed
		/** movement speed when connected to a wall */
		this.moveSpd_connected = 2;
		/** movement speed when jumping */
		this.moveSpd_jump = 5;

		//#endregion
		//#region connections (tentacles)

		/** if the playes aarms are connected to a wall */
		this.conn_isConnected = true;

		//#endregion

		/** enum-like for player states */
		this.STATES = {
			/** player is free to move */
			free: "free",
			/** players action is disabled */
			stunned: "stunned",
			/** player obj is controlled by scene */
			controlled: "controlled",
			/** object is frozen */
			frozen: "frozen",
		};

		this.stateSwitch(this.STATES.free);

		// this.addToDisplayList();
		// this.addToUpdateList();
	}

	//#region general
	preload() {}

	create() {}

	preUpdate() {}

	update() {
		this.move_update();
	}
	//#endregion
	//#region states

	/**
	 *
	 * @param {string} str STATE state string. f.e. this.STATES.free
	 */
	stateSwitch(stateString) {
		this.state = stateString;

		switch (stateString) {
			case this.STATES.free:
				this.move_canMoveSet(true);
				break;
			case this.STATES.stunned:
				break;
			case this.STATES.controlled:
				break;
			case this.STATES.frozen:
				break;

			default:
				// console.error("///// Unknown state in: " + this.name + "!!!");
				break;
		}
	}

	//#endregion
	//#region movement

	/**
	 * runs continuously
	 * uses input to move player
	 */
	move_update() {
		this.input_vector = this.getInputMovementVector(this.input_vector);

		this.input_vector.scale(this.move_GetSpeed());
		this.move(this.input_vector);
	}

	/**
	 * moves the player if he can move
	 * wakes the physics body up
	 * @param {Phaser.Math.Vector2} vec2
	 */
	move(vec2) {
		if (this.move_canMove()) {
			this.setVelocity(vec2.x, vec2.y);
			this.setAwake();
		}
	}

	/**
	 * if the player is moving
	 * @returns {boolean} if player is moving
	 */
	move_isMoving() {
		return this.move_velocity.x != 0 || this.move_velocity.y != 0;
	}

	/**
	 * if the player can move
	 * @returns {boolean} if player can move
	 */
	move_canMove() {
		return this.move_canMove;
	}

	/**
	 * configues the objects input to movement ability
	 *
	 * @param {boolean} bool
	 */
	move_canMoveSet(bool) {
		this.move_canMove = bool;
	}

	/**
	 * if the player is frozen
	 * movement input and movement disabled
	 * @returns {boolean} if the player is frozen
	 */
	move_isFrozen() {
		return this.frozen;
	}

	/**
	 * sets if the player is frozen
	 * movement input and movement disabled
	 * WILL NOT REACTIVATE move_canMove ON ITS OWN
	 * @param {boolean} bool if player is frozen
	 */
	move_frozenSet(bool) {
		this.frozen = bool;
	}

	/**
	 * determines the current movement speed and returns it
	 * @returns {number} movement speed
	 */
	move_GetSpeed() {
		return this.moveSpd_connected;
	}

	//#endregion
	//#region input
	/**
	 * gets the movement input as a vector
	 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
	 * @returns {Phaser.Math.Vector2} vector with a limit of 1
	 */
	getInputMovementVector(vec2) {
		if (vec2 == undefined) {
			vec2 = new Phaser.Math.Vector2();
		}

		//#region keyboard
		vec2.x = this.input_Keyboard.right.isDown - this.input_Keyboard.left.isDown;
		vec2.y = this.input_Keyboard.down.isDown - this.input_Keyboard.up.isDown;

		//#endregion
		//#region gamepad
		// var pads = this.scene.input.gamepad.gamepads;

		// for (var i = 0; i < pads.length; i++) {
		// 	var gamepad = pads[i];

		// 	if (!gamepad) {
		// 		continue;
		// 	}

		// 	vec2.add(gamepad.leftStick);
		// }

		//#endregion

		vec2.limit(1).normalize();
		return vec2;
	}

	//#endregion
}
