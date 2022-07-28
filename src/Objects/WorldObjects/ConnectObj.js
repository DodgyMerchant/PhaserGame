import MovementObj, { State } from "../WorldObjects/MovementObj";
import { COLLCAT } from "./PhyObj";

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
	 * @param {ConnectConfig} connectConfig connectconfig object
	 * @param {MovementConfig} movementConfig MovementConfig object
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} phyConfig config obj.
	 */
	constructor(scene, x, y, texture, connectConfig, movementConfig, phyConfig) {
		super(scene, x, y, texture, movementConfig, phyConfig);

		//#region movement

		/**
		 * Method called to get input for jumping
		 * @param {Phaser.Math.Vector2 | undefined} vec2 optional vector to overwrite
		 * @returns {Phaser.Math.Vector2} vector with a limit of 1
		 * @type method
		 */
		this.connJumpInputMethod;
		if (connectConfig.jumpMeth != undefined)
			this.connJumpInputMethod = connectConfig.jumpMeth;

		/** movement speed when jumping */
		this.connSpdJump = connectConfig.jumpSpeed;

		/**
		 * if object gave jump input
		 * @type {boolean} boolean
		 */
		this.connJumping = false;

		/** air friction of the object if connected */
		this.move_ConnAirFric = connectConfig.connAirFric;

		//#endregion
		//#region connections (tentacles)

		/**
		 * if the object arms are connected to a wall
		 * @type {boolean}
		 * */
		this.connIsConnected;
		this.connSetConnected(true);

		/**
		 * range in wich connection to aa object is possible
		 * @type {number} value in pixels
		 */
		this.connRange = connectConfig.range;

		/**
		 * the range circle used for calculations
		 * @type {MatterJS.BodyType}
		 */
		this.connCircle = this.scene.matter.add.circle(
			this.x,
			this.y,
			this.connRange,
			{
				collisionFilter: {
					category: connectConfig.connCat,
					mask: connectConfig.connWith,
				},
				mass: 0,
				ignoreGravity: true,
				ignorePointer: true,
				isStatic: false,
				isSensor: true,
				onCollideCallback: this.connStart,
				onCollideEndCallback: this.connEnd,
				sleepThreshold: 60,
				label: "Connection Circle",
			}
		);

		// this.scene.matter.world.on("collisionstart", this.connStart);
		// this.scene.matter.world.on("collisionend", this.connEnd);

		// this.connCircle.gameObject = this;

		// console.log("this.connCircle: ", this.connCircle);

		//#endregion
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}

	update(time, delta) {
		super.update(time, delta);
		//my stuff
		// console.log("CONNECT - update");

		this.connUpdate();
	}

	fixedUpdate(time, delta, executesLeft, looseDelta) {
		super.fixedUpdate(time, delta);
		//stuff to perform based on fps -->
		// console.log("CONNECT - update fixed");
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
	 * updates connected properties and runs checks
	 */
	connUpdate() {
		this.connCircleMaintenance();
		this.connCheckConnected();
		this.connFindFootholds();
	}

	/**
	 * check if this object is connected
	 */
	connCheckConnected() {
		// let overlap = this.scene.matter.overlap(this.connCircle);
		// console.log("log - overlap: ", overlap);
	}

	connCircleMaintenance() {
		//range is different update circle
		if (this.connRange != this.connCircle.circleRadius) {
			this.connCircle.circleRadius = this.connRange;
		}

		//pos is different update circle
		if (this.x != this.connCircle.x || this.y != this.connCircle.y) {
			// this.connCircle.position.x = this.x;
			// this.connCircle.position.y = this.y;

			this.scene.matter.body.setPosition(this.connCircle, this.body.position);
		}
	}

	/**
	 * set if the object is connected to a wall
	 * @param {boolean} bool if the object is connected
	 */
	connSetConnected(bool) {
		console.log("CONN - connection set for: ", this.name, " to: ", bool);

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

	connStart(a, b, c) {
		console.log("CONN - Start a,b,c: ", a, b, c);
	}

	connEnd(a, b, c) {
		console.log("CONN - End a,b,c: ", a, b, c);
	}

	//footholds

	connFindFootholds() {
		//Phaser.Geom.Intersects.GetRaysFromPointToPolygon
	}

	//#endregion
}

/*

	 * @param {CollisionCategory | CollisionCategory[]} connCat collision categories for the connection determination shaape
	 * @param {CollisionCategory | CollisionCategory[]} connWith collision categories for the connection determination shaape
	 * @param {function | undefined} jumpMeth Method called to get input for jumping, specifications: return a vec2D: Phaser.Math.Vector2, 1 parameter: vec2 2D vector that can be overridden Phaser.Math.Vector2. If it cant be supplied set connJumpInputMethod.
*/
/**
 * @typedef {{
 * range: (number),
 * jumpSpeed: (number),
 * connAirFric: (number),
 * connCat: (CollisionCategory | CollisionCategory[]),
 * connWith: (CollisionCategory | CollisionCategory[]),
 * jumpMeth: (function | undefined),
 * }} ConnectConfig Config for a connect object
 */
/**
 * @type {ConnectConfig}
 */
let obj = {};
