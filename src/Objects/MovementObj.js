import PhyObj from "./PhyObj";

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
	 * @param {STATES.element} state tstate the object is in
	 * @param {number} collCat byte corresponding to the collision Category of the object
	 * @param {method | undefined} moveMeth Method called to get input for movement, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set moveInputMethod
	 * @param {method | undefined} jumpMeth Method called to get input for jumping, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set connJumpInputMethod
	 */
	constructor(scene, x, y, texture, state, collCat, collWith, moveMeth) {
		super(scene, x, y, texture, collCat, collWith);

		/*
    to set:
    super.moveInputMethod;
		super.connJumpInputMethod;

    super.setFriction(0.1);
		super.setFrictionStatic(0.5);
		super.setDensity(1);

    super.moveConnAirFric = 0.05;
		super.moveSpeed = 0.5;
		super.connSpdJump = 5;
    */

		//#region state
		this.stateSwitch(state);

		//#endregion
		//#region input

		/**
		 * Method called to get input for movement
		 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
		 * @returns {Phaser.Math.Vector2} vector with a limit of 1
		 * @type method
		 */
		this.moveInputMethod;
		if (moveMeth != undefined) this.moveInputMethod = moveMeth;

		//#endregion
		//#region movement

		/** if some input to movement is possible */
		this.moveCanMove = true;
		/** movement input and movement are disabled */
		this.moveFrozen = false;
		/** air friction of the object if connected */
		this.moveConnAirFric = 1;
		this.setFrictionAir(this.moveConnAirFric);
		///SPEED
		/** movement speed*/
		this.moveSpeed = 0;

		//#endregion

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

		//moves mech
		this.move_update();
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
	//#region movement

	/**
	 * runs continuously
	 * moves mech
	 */
	move_update() {
		if (this.moveCanMoveGet()) {
			this.workVec = this.moveInputMethod(this.workVec);

			if (this.workVec.x != 0 || this.workVec.y != 0) {
				let _x = this.workVec.x;
				let _y = this.workVec.y;
				let _spd = this.moveGetSpeed();

				//applying movement speed

				this.workVec.scale(_spd);
				//moving mech
				super.phyMoveAdd(this.workVec);

				this.setRotation(this.workVec.angle());

				//debug
				console.log(
					"input: ",
					_x.toFixed(2),
					"/",
					_y.toFixed(2),
					" | vel: ",
					this.body.velocity.x.toFixed(2),
					"/",
					this.body.velocity.y.toFixed(2),
					" | spd: ",
					_spd
				);
			}
		}
	}

	/**
	 * if the mech can move
	 * @returns {boolean} if mech can move
	 */
	moveCanMoveGet() {
		return this.moveCanMove;
	}

	/**
	 * configues the objects input to movement ability
	 *
	 * @param {boolean} bool
	 */
	moveCanMoveSet(bool) {
		this.moveCanMove = bool;
	}

	/**
	 * if the mech is frozen
	 * movement input and movement disabled
	 * @returns {boolean} if the mech is frozen
	 */
	moveIsFrozen() {
		return this.moveFrozen;
	}

	/**
	 * sets if the mech is frozen
	 * movement input and movement disabled
	 * WILL NOT REACTIVATE moveCanMove ON ITS OWN
	 * @param {boolean} bool if mech is frozen
	 */
	moveFrozenSet(bool) {
		this.moveFrozen = bool;
	}

	/**
	 * determines the current movement speed and returns it
	 * @returns {number} movement speed
	 */
	moveGetSpeed() {
		return this.moveSpeed;
	}

	//#endregion
}

/**
 * enum-like for player states
 * only change states with: this.stateSwitch(STATES.statename);
 */
export class STATES {
	/** mech is free to move */
	static FREE = Symbol("free");
	/** mech action is disabled */
	static STUNNED = Symbol("stunned");
	/** mech obj is controlled by scene */
	static CONTROLLED = Symbol("controlled");
	/** mech is frozen */
	static FROZEN = Symbol("frozen");
}
