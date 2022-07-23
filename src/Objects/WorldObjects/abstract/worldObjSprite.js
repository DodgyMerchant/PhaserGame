/**
 * parent class for world object based on sprites.
 * only used for general setup and grouping.
 * ACCUMULATOR activated, fixedUpdate can be defined and is used correctly
 */
export default class worldObjSprite extends Phaser.Physics.Matter.Sprite {
	/**
	 * grouping parent
	 * @param {Phaser.Physics.Matter.World} world physics world
	 * @param {number} x
	 * @param {number} y
	 * @param {string | Phaser.Textures.Texture} textture
	 * @param {string | number | undefined} frame
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 */
	constructor(world, x, y, textture, frame, options) {
		super(world, x, y, textture, frame, options);
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}

	update(time, delta) {
		super.update(time, delta);

		//use accumulator
		this.fixedUpdateCall(time, delta);
	}

	/**
	 * update called depending on fps set
	 * this is to overridden by objects that want to use it
	 * its is recommended to user call the function. F.e: super.fixedUpdate(time, delta);
	 *
	 * @see ACCUMULATOR
	 * @param {number} time time passed since game start in milliseconds
	 * @param {number} delta time passed since last frame in milliseconds
	 * @param {number} executesLeft the number of times the accumulator will be active and the fixed update called. NOTICE left means what is left!! in call this means that is was reduced by one before this call.
	 */
	fixedUpdate(time, delta, executesLeft, looseDelta) {
		//END OF FIXED UPDATE CHAIN
		// super.fixedUpdate(time, delta);
	}
}
