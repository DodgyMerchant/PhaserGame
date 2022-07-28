import devPoly from "./devPoly";

export default class devPhyPoly extends devPoly {
	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 * @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, scene, x, y, points, phyoptions, interactiveConfig) {
		super(name, scene, x, y, points, interactiveConfig);

		scene.matter.add.gameObject(this, phyoptions, true);

		// console.log("new wall", this);

		//#endregion
	}

	/**
	 *
	 * manually update the objects physics
	 */
	refresh() {
		super.refresh();
		this.setAwake();
	}

	/**
	 * convert this to a non interactable static physics object
	 */
	convert() {
		this.scene.mapObjCreate_Collision(false, this.body.vertices);
		this.destroy(false);
	}
}
