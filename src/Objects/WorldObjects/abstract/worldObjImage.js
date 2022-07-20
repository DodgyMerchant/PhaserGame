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
}
