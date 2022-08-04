import MovementObj, { State } from "../WorldObjects/MovementObj";
import { CollisionCategory } from "./PhyObj";

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
		this.connSetConnected(false);

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
				onCollideActiveCallback: this.connActive,
				// sleepThreshold: this.body.sleepThreshold,
				sleepThreshold: 0,
				label: "Connection Circle",
			}
		);
		this.connCircle.gameObject = this;

		// waking up the circle
		// this.setSleepEndEvent(true);
		// this.scene.matter.world.on(
		// 	"sleepend",
		// 	function (event, obj) {
		// 		console.log("SLEEPND: ", event, obj);

		// 		if (this.body === obj) {
		// 			console.log("THIS IS ME!!!");
		// 		}
		// 	},
		// 	this
		// );

		this.connList = [];
		this.connLine = new Phaser.Geom.Line();

		this.connGraphTest = this.scene.add.graphics({
			fillStyle: {
				color: 0x00ffff,
				alpha: 1,
			},
			lineStyle: {
				color: 0x00ffff,
				width: 1,
				alpha: 1,
			},
		});

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

	//#endregion
	//#region connections

	/**
	 * updates connected properties and runs checks
	 */
	connUpdate() {
		this.connCircleMaintenance();

		this.connGraphTest.clear();

		if (this.connGetConnected()) {
			this.connFindFootholds();

			let obj, check, poly;
			for (let i = 0; i < this.connList.length; i++) {
				obj = this.connList[i];
				poly = obj.custom_poly;
				// console.log("obj: ", obj);

				this.connLine.setTo(this.x, this.y, obj.position.x, obj.position.y);
				check = Phaser.Geom.Intersects.GetLineToPolygon(this.connLine, poly);
				Phaser.Geom.Polygon;

				if (check != null) {
					// console.log("ayyyy", check);

					this.connGraphTest.strokeCircle(check.x, check.y, 5);
				}
			}
		}
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
		if (bool != this.connIsConnected) {
			this.connIsConnected = bool;
			// console.log("CONN - connection set for: ", this.name, " to: ", bool);

			switch (bool) {
				case true:
					this.setFrictionAir(this.move_ConnAirFric);

					break;
				case false:
					this.setFrictionAir(0);
					break;
			}
		}
	}
	/**
	 * returns if the object is connected to a wall
	 * @returns {boolean} if the object is connected
	 */
	connGetConnected() {
		return this.connIsConnected;
	}

	/**
	 *
	 * @param {object} pair
	 */
	connActive(pair) {
		let contactList = pair.activeContacts;

		// console.log("log - pair: ", pair);

		let target = pair.bodyA; //map obj
		let source = pair.bodyB; //connect circle
		let obj = source.parent.gameObject;

		// obj.connGraphTest.clear();

		// let vertex;
		// let leng = contactList.length;
		// for (let i = 0; i < leng; i++) {
		// 	vertex = contactList[i].vertex;

		// 	obj.connGraphTest.strokeCircle(vertex.x, vertex.y, 20);
		// }
	}

	/**
	 *
	 * @param {object} pair
	 */
	connStart(pair) {
		console.log("CONN - Start: ", pair);

		let target = pair.bodyA; //map obj
		let source = pair.bodyB; //connect circle

		source.gameObject.connAdd(target);
	}

	/**
	 *
	 * @param {object} pair
	 */
	connEnd(pair) {
		// console.log("CONN - End: ", pair);
		let target = pair.bodyA; //map obj
		let source = pair.bodyB; //connect circle

		source.gameObject.connRemove(target);
	}

	/**
	 * adds a connection to the list
	 * @param {object} obj
	 */
	connAdd(obj) {
		this.connList.push(obj);
		// console.log("list: ", this.connList);
		this.connCheckConnected();
	}

	/**
	 * removes a connection from the list
	 * @param {object} obj
	 */
	connRemove(obj) {
		let index = this.connList.indexOf(obj);
		if (index != -1) {
			this.connList.splice(index, 1);
			// console.log("list: ", this.connList);
		}

		this.connCheckConnected();
	}

	/**
	 * check if this object is connected
	 * and set
	 */
	connCheckConnected() {
		this.connSetConnected(this.connList.length > 0);
	}

	//footholds

	connFindFootholds() {
		// let list = Phaser.Geom.Intersects.GetRaysFromPointToPolygon(
		// 	this.x,
		// 	this.y,
		// 	this.scene.mapPolyList
		// );
		// console.log("POLY RAYS LIST: ", list);
		// Phaser.Geom.Circle.
	}

	//#endregion
	//overrides

	moveCanMoveGet() {
		return this.move_CanMove && this.connGetConnected();
	}
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
 * connCat: (CollisionCategory),
 * connWith: (CollisionCategory),
 * jumpMeth: (function | undefined),
 * }} ConnectConfig Config for a connect object
 */
