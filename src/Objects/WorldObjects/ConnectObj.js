import MovementObj from "../WorldObjects/MovementObj";

/**
 * mecha object for bosses payer and other
 * Physics activated
 * @abstract abstract class, will sabotage itself to not work, please extend
 */
export default class ConnectObj extends MovementObj {
	/**
	 * Game physics object with premade movement methods and "arms" to hold onto stuff
	 *
	 * @param {Phaser.Scene} scene the object is in
	 * @param {number} x position
	 * @param {number} y position
	 * @param {string | Phaser.Textures.Texture} texture texture to display as the object texture
	 * @param {STATES.element} state tstate the object is in
	 * @param {number} collCat byte corresponding to the collision Category of the object
	 * @param {number | number[]} collWith byte or list of bytes corresponding to collision Categoryies to be collided with
	 * @param {method | undefined} moveMeth Method called to get input for movement, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set moveInputMethod
	 * @param {method | boolean | undefined} rotMeth Method called to get input for object rotation, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. OR if movement input should be direkty translaated to object rotation. If it cant be supplied set moveInputMethod.
	 * @param {method | undefined} jumpMeth Method called to get input for jumping, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set connJumpInputMethod
	 */
	constructor(
		scene,
		x,
		y,
		texture,
		state,
		collCat,
		collWith,
		moveMeth,
		rotMeth,
		jumpMeth
	) {
		super(scene, x, y, texture, state, collCat, collWith, moveMeth, rotMeth);

		//#region movement

		/**
		 * Method called to get input for jumping
		 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
		 * @returns {Phaser.Math.Vector2} vector with a limit of 1
		 * @type method
		 */
		this.connJumpInputMethod;
		if (jumpMeth != undefined) this.connJumpInputMethod = jumpMeth;

		/** movement speed when jumping */
		this.connSpdJump = 0;

		/**
		 * if object gave jump input
		 * @type {boolean} boolean
		 */
		this.connJumping = false;

		//#endregion
		//#region connections (tentacles)

		/** if the object arms are connected to a wall */
		this.connIsConnected;
		this.connSetConnected(true);

		//#endregion
	}

	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {
		super.update(delta, time);
	}

	//#region movement

	/**
	 * returns if the mech is jumping
	 * can move + connected + jump input
	 * @returns {boolean} if the mech is jumping
	 */
	mechIsJumping() {
		return this.connGetConnected() && this.moveCanMoveGet() && this.connJumping;
	}

	//#endregion
	//#region connections

	/**
	 * set if the object is connected to a wall
	 * @param {boolean} bool if the object is connected
	 */
	connSetConnected(bool) {
		this.connIsConnected = bool;

		switch (bool) {
			case true:
				this.setFrictionAir(this.move_ConnAirFric);

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
	connGetConnected() {
		return this.connIsConnected;
	}

	//#endregion
}
