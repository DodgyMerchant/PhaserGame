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
		this.setName("PlayerObject");
		this.world = world;
		this.setCircle(20);

		///// phys

		this.setFriction(0.1);
		this.setFrictionStatic(0.5);
		this.setDensity(1);

		/** movement speed when connected to a wall */
		this.moveSpd_connected = 0.5;
		/** air friction of the object if connected */
		this.move_connAirFric = 0.05;
		/** movement speed when jumping */
		this.moveSpd_jump = 5;
		/** maximum movement speed when connected UN-USED */
		this.moveMax_connected = 3;

		///// phys

		//#region state
		this.stateSwitch(STATES.FREE);

		//#endregion
		//#region input
		this.input_Keyboard = this.scene.input.keyboard.addKeys({
			up: Phaser.Input.Keyboard.KeyCodes.W,
			down: Phaser.Input.Keyboard.KeyCodes.S,
			left: Phaser.Input.Keyboard.KeyCodes.A,
			right: Phaser.Input.Keyboard.KeyCodes.D,
		});

		this.input_vector = new Phaser.Math.Vector2();
		/** if player gave jump input */
		this.input_jumping = false;

		//#endregion
		//#region movement

		/** if player/system input to movement is possible */
		this.move_canMove = true;
		/** movement input and movement are disabled */
		this.frozen = false;

		//move speed

		//max speed

		//#endregion
		//#region connections (tentacles)

		/** if the playes aarms are connected to a wall */
		this.conn_isConnected;
		this.conn_setConnected(true);

		//#endregion

		// this.addToDisplayList();
		// this.addToUpdateList();

		/**
		 * vector to be used and thrown away for calculations
		 * dont save stuff in it
		 * alsways reset before using
		 */
		this.workVec = new Phaser.Math.Vector2();
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
	 * switchtches object to given state including changes depending on the state.
	 *
	 * @param {string} str STATE state string. f.e. STATES.FREE
	 */
	stateSwitch(stateString) {
		switch (stateString) {
			case STATES.FREE:
				this.move_canMoveSet(true);
				this.move_frozenSet(false);
				break;
			case STATES.STUNNED:
				this.move_canMoveSet(false);
				this.move_frozenSet(false);
				break;
			case STATES.CONTROLLED:
				this.move_canMoveSet(false);
				this.move_frozenSet(false);
				break;
			case STATES.FROZEN:
				this.move_canMoveSet(false);
				this.move_frozenSet(true);
				break;
			default:
				console.error("///// Unknown state in: " + this.name + "!!!");
				return;
		}

		this.setState(stateString);
	}

	/**
	 * returns the current objects state as a string
	 * from STATES enum-like
	 * @returns {string} state as a string
	 */
	stateGet() {
		return this.state;
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

	//#endregion
	//#region movement

	/**
	 * runs continuously
	 * uses input to move player
	 */
	move_update() {
		if (!this.move_isJumping()) {
			this.input_vector = this.getInputMovementVector(this.input_vector);

			if (this.input_vector.x != 0 || this.input_vector.y != 0) {
				var _scale = this.input_vector.length();

				//applying movement speed
				this.workVec.copy(this.input_vector).scale(this.move_getSpeed());
				//moving player
				this.moveAdd(this.workVec);
				// this.move_RestrictTo(this.move_getMaximum() * _scale);

				//debug
				console.log(
					"input: ",
					this.input_vector.x.toFixed(2),
					"/",
					this.input_vector.y.toFixed(2),
					"|| speed: ",
					this.body.velocity.x.toFixed(2),
					"/",
					this.body.velocity.y.toFixed(2)
				);
			}
		} else {
		}
	}

	/**
	 * sets the player movement
	 * wakes the physics body up
	 * @param {number} x movement on the x axis
	 * @param {number} y movement on the y axis
	 */
	moveSet(x, y) {
		if (this.move_canMoveGet()) {
			this.setVelocity(x, y);
			this.setAwake();
		}
	}

	/**
	 * adds to the player movement
	 * wakes the physics body up
	 * @param {Phaser.Math.Vector2} vec2 vector 2D with movement x y
	 */
	moveAdd(vec2) {
		this.applyForce(vec2);
	}

	/**
	 * restricts the player movement speed to a maximum
	 * @param {number} val number to restrict the player movement speed to
	 */
	move_RestrictTo(val) {
		this.workVec.copy(this.body.velocity).limit(val);

		this.setVelocity(this.workVec.x, this.workVec.y);
	}

	/**
	 * if the player is moving
	 * @returns {boolean} if player is moving
	 */
	move_isMoving() {
		return this.body.velocity.x != 0 || this.body.velocity.y != 0;
	}

	/**
	 * if the player can move
	 * @returns {boolean} if player can move
	 */
	move_canMoveGet() {
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
	move_getSpeed() {
		return this.moveSpd_connected;
	}

	/**
	 * determines the current maximum movement speed and returns it
	 * @returns {number} maximum movement speed
	 */
	move_getMaximum() {
		return this.moveMax_connected;
	}

	/**
	 * returns if the player is jumping
	 * can move + connected + player input
	 * @returns {boolean} if the player is jumping
	 */
	move_isJumping() {
		return (
			this.conn_getConnected() && this.move_canMoveGet() && this.input_jumping
		);
	}

	//#endregion
	//#region connections

	/**
	 * set if the object is connected to a wall
	 * @param {boolean} bool if the object is connected
	 */
	conn_setConnected(bool) {
		this.conn_isConnected = bool;

		switch (bool) {
			case true:
				this.setFrictionAir(this.move_connAirFric);

				break;
			case false:
				this.setFrictionAir(0);
				break;
		}
	}
	/**
	 * returns if the object is connected to a wall
	 * @returns {boolean} if the object is connected
	 */
	conn_getConnected() {
		return this.conn_isConnected;
	}

	//#endregion
}

/**
 * enum-like for player states
 * only change states with: this.stateSwitch(STATES.statename);
 */
export class STATES {
	/** player is free to move */
	static FREE = Symbol("free");
	/** players action is disabled */
	static STUNNED = Symbol("stunned");
	/** player obj is controlled by scene */
	static CONTROLLED = Symbol("controlled");
	/** object is frozen */
	static FROZEN = Symbol("frozen");
}
