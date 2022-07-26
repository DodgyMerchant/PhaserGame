export default class devPoly extends Phaser.GameObjects.Polygon {
	/**
	 *
	 * @param {*} scene
	 * @param {*} x
	 * @param {*} y
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 *  @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, scene, x, y, points) {
		super(scene, x, y, points, 0xff0000, 10000);

		this.setActive(true);
		this.setVisible(true);

		this.scene.add.existing(this);

		this.sc;

		this.setInteractive({});

		this.name = name;

		// console.log("new wall", this);

		//#endregion
	}

	/**
	 *
	 * manually update the objects physics
	 */
	myRefresh() {}

	/**
	 * convert this to a non interactable static physics object
	 */
	convert() {}
}
