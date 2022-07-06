import MovementObj from "./MovementObj";

/**
 * mecha object for bosses payer and other
 * Physics activated
 * @abstract abstract class, will sabotage itself to not work, please extend
 */
export default class ConnectObj extends MovementObj {
	constructor(scene, x, y, image, state) {
		super(scene, x, y, image, state);

		//#region movement

		/**
		 * Method called to get input for jumping
		 * @returns Phaser.Math.Vector2
		 * @type method
		 */
		this.connJumpInputMethod;

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
				this.setFrictionAir(this.moveConnAirFric);

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
