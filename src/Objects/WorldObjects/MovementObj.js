import PhyObj from "../WorldObjects/PhyObj";

/**
 * physics movement configured object
 * has states and movement methods
 * @abstract abstract class, will sabotage itself to not work, please extend
 */
export default class MovementObj extends PhyObj {
	/**
	 * Game physics object with premade movement methods
	 *
	 * @param {Phaser.Scene} scene the object is in
	 * @param {number} x position
	 * @param {number} y position
	 * @param {string | Phaser.Textures.Texture} texture texture to display as the object texture
	 * @param {MovementConfig} movementConfig MovementConfig object
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} phyConfig config obj.
	 */
	constructor(scene, x, y, texture, movementConfig, phyConfig) {
		super(scene, x, y, texture, phyConfig);

		/*
    to overwrite and set:
    super.moveInputMethod;
    super.moveRotMethodSet(this.method);
		super.connJumpInputMethod;

    super.setFriction(0.1);
		super.setFrictionStatic(0.5);
		super.setDensity(1);

		super.move_Speed = 0.5;
		super.connSpdJump = 5;
		super.move_RotSpeed = 0.1;
    */

		//#region state
		this.stateSwitch(movementConfig.state);

		//#endregion state
		//#region input

		/**
		 * Method called to get input for movement
		 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
		 * @returns {Phaser.Math.Vector2} vector with a limit of 1
		 * @type method
		 */
		this.moveInputMethod;
		if (movementConfig.moveMeth != undefined)
			this.moveInputMethod = movementConfig.moveMeth;

		/**
		 * Method called to get input for rotation, if undefined will user movement input
		 * set by using moveRotMethodSet
		 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
		 * @returns {Phaser.Math.Vector2} vector with a limit of 1
		 * @type {method | boolean}
		 */
		this.moveRotInputMethod;
		/**
		 * if movment input should be directly used for rotation.
		 * 0 = method exists, 1 = movement to rotation, 2 = no rotation.
		 * set by using moveRotMethodSet
		 * @type {number}
		 */
		this.move_rotType = 2;

		if (movementConfig.rotMeth != undefined)
			this.moveRotMethodSet(movementConfig.rotMeth);

		//#endregion input
		//#region movement

		/** if some input to movement is possible */
		this.move_CanMove = true;
		/** movement input and movement are disabled */
		this.move_Frozen = false;
		
		///SPEED
		/** movement speed*/
		this.move_Speed = movementConfig.speed;

		//#endregion movement
		//#region rotation

		/**
		 * rotation target ange in radians
		 * @type {number} in radians
		 */
		this.move_rotTarget = 0;

		/** movement speed per frame in percent of one full rotation
		 * @type {number} 0-1
		 */
		this.move_RotSpeed = movementConfig.rotSpeed;

		//#endregion rotation

		/**
		 * vector to be used and thrown away for calculations
		 * dont save stuff in it
		 * alsways reset before using
		 * @type {Phaser.Math.Vector2} type
		 */
		this.workVec = new Phaser.Math.Vector2();
	}

	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {
		super.update(delta, time);
		//my stuff
		// console.log("MOVEMENT - update");

		//moves mech
		// this.moveRotUpdate();
		// this.moveUpdate();
	}

	fixedUpdate(delta, time, executesLeft) {
		super.fixedUpdate(delta, time);
		//stuff to perform based on fps -->

		// console.log("MOVEMENT - update fixed");

		//moves mech
		this.moveRotUpdate();
		this.moveUpdate();

		//#region debug

		let input = this.moveInputMethod();
		if (this.body.speed != 0 || !this.moveRotationIsSettled())
			console.log(
				"trn spd: ",
				this.move_RotSpeed.toFixed(2),
				"input: ",
				input.x.toFixed(2),
				"/",
				input.y.toFixed(2),
				" | spd: ",
				this.body.speed.toFixed(4),
				" | vel: ",
				this.body.velocity.x.toFixed(2),
				"/",
				this.body.velocity.y.toFixed(2)
			);

		//#endregion
	}

	//#region states

	/**
	 * switchtches object to given state including changes depending on the state.
	 *
	 * @param {string} str STATE state string. f.e. STATES.FREE
	 */
	stateSwitch(stateString) {
		switch (stateString) {
			case STATES.FREE:
				this.moveCanMoveSet(true);
				this.moveFrozenSet(false);
				break;
			case STATES.STUNNED:
				this.moveCanMoveSet(false);
				this.moveFrozenSet(false);
				break;
			case STATES.CONTROLLED:
				this.moveCanMoveSet(false);
				this.moveFrozenSet(false);
				break;
			case STATES.FROZEN:
				this.moveCanMoveSet(false);
				this.moveFrozenSet(true);
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
	//#region rotation

	/**
	 * sets the rotation method
	 * @param {method | boolean} rotMeth Method called to get input for object rotation, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. OR if movement input should be direkty translaated to object rotation.
	 */
	moveRotMethodSet(rotMeth) {
		if (typeof rotMeth == "function") {
			this.moveRotInputMethod = rotMeth;
			this.move_rotType = 0;
		} else if (rotMeth) {
			this.move_rotType = 1;
		} else {
			this.move_rotType = 2;
		}
	}

	moveRotUpdate() {
		//should rotate and can rotate
		if (this.move_rotType == 0 && this.moveCanMoveGet()) {
			this.workVec = this.moveRotInputMethod(this.workVec);

			//if rotational movement is happening
			if (this.workVec.x != 0 || this.workVec.y != 0) {
				this.move_rotTarget = this.workVec.angle();
			}

			/** new angle in radians */
			let newAng = Phaser.Math.Angle.RotateTo(
				this.rotation,
				this.move_rotTarget,
				this.move_RotSpeed
			);

			//applay rotation
			this.setRotation(newAng);
		}
	}

	/**
	 * if the rotation is stopped
	 * @returns {boolean} boolean
	 */
	moveRotationIsSettled() {
		return this.rotation == this.move_rotTarget;
	}

	//#endregion
	//#region movement

	/**
	 * runs continuously
	 * moves mech
	 */
	moveUpdate(mult) {
		// console.log("mult: ", mult);

		if (this.moveCanMoveGet()) {
			this.workVec = this.moveInputMethod(this.workVec);

			if (this.workVec.x != 0 || this.workVec.y != 0) {
				let _x = this.workVec.x;
				let _y = this.workVec.y;
				let _spd = this.moveGetSpeed();

				//applying movement speed
				this.workVec.scale(_spd);

				//set rotation
				//rotation is derived from movement
				if (this.move_rotType == 1) {
					this.setRotation(this.workVec.angle());
				}

				//apply movmeent
				super.phyMoveAdd(this.workVec);
				// this.thrust(this.workVec.length()); does the same thing
			}
		}
	}

	/**
	 * if the mech can move
	 * @returns {boolean} if mech can move
	 */
	moveCanMoveGet() {
		return this.move_CanMove;
	}

	/**
	 * configues the objects input to movement ability
	 *
	 * @param {boolean} bool
	 */
	moveCanMoveSet(bool) {
		this.move_CanMove = bool;
	}

	/**
	 * if the mech is frozen
	 * movement input and movement disabled
	 * @returns {boolean} if the mech is frozen
	 */
	moveIsFrozen() {
		return this.move_Frozen;
	}

	/**
	 * sets if the mech is frozen
	 * movement input and movement disabled
	 * WILL NOT REACTIVATE move_CanMove ON ITS OWN
	 * @param {boolean} bool if mech is frozen
	 */
	moveFrozenSet(bool) {
		this.move_Frozen = bool;
	}

	/**
	 * determines the current movement speed and returns it
	 * @returns {number} movement speed
	 */
	moveGetSpeed() {
		return this.move_Speed;
	}

	//#endregion
}

/*
@param {State} state tstate the object is in
@param {method | undefined} moveMeth Method called to get input for movement, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set moveInputMethod
@param {method | boolean | undefined} rotMeth Method called to get input for object rotation, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. OR if movement input should be direkty translaated to object rotation. If it cant be supplied set moveInputMethod.
*/
/**
 * @typedef {{
 * speed: (number),
 * rotSpeed: (number),
 * state: (State),
 * moveMeth: (method | undefined),
 * rotMeth: (method | boolean | undefined),
 * }} MovementConfig Config for a movement object
 */

/**
 * @type {MovementConfig}
 */
let obj = {};

/**
 * @typedef {symbol} State a sttate to be in for a MovementObj
 */
/**
 * enum-like for player states
 * only change states with: this.stateSwitch(STATES.statename);
 * @type {object}
 */
export class STATES {
	/**
	 * mech is free to move
	 * @type {State}
	 */
	static FREE = Symbol("free");
	/**
	 * mech action is disabled
	 * @type {State}
	 */
	static STUNNED = Symbol("stunned");
	/**
	 * mech obj is controlled by scene
	 * @type {State}
	 */
	static CONTROLLED = Symbol("controlled");
	/**
	 * mech is frozen
	 * @type {State}
	 */
	static FROZEN = Symbol("frozen");
}
