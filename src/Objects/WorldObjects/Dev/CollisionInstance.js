import devPhyPoly from "./abstract/devPhyPoly";

/**
 * DO NOT REFERENCE THIS TYPE OF OBJECT OUTSIDE OF A DEV ENVIROMENT.
 *
 * A collision instance, used for invisible collision wolls
 * these instances are development only and will be replaced by more lightweight instances.
 */
export default class CollisionInstance extends devPhyPoly {
	/**
	 * A collision instance, used for invisible collision wolls
	 * these instances are development only and will be replaced by more lightweight instances.
	 *
	 * DO NOT REFERENCE THIS TYPE OF OBJECT OUTSIDE OF A DEV ENVIROMENT
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 * @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, scene, x, y, points, phyoptions, interactiveConfig) {
		super(name, scene, x, y, points, phyoptions, interactiveConfig);

		
	}

	convert() {
		super.convert();
	}
}
