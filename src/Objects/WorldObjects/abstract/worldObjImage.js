/**
 * parent class for world object based on images.
 * only used for general setup and grouping.
 * ACCUMULATOR activated, fixedUpdate can be defined and is used correctly
 */
export default class worldObjImage extends Phaser.Physics.Matter.Image {
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

	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {
		super.update(delta, time);

		//use accumulator
		this.fixedUpdateCall(delta, time);
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
	fixedUpdate(delta, time, executesLeft) {
		//END OF FIXED UPDATE CHAIN
		// super.fixedUpdate(delta, time);
	}
}
