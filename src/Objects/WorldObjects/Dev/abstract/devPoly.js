export default class devPoly extends Phaser.GameObjects.Polygon {
	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {any} points
	 */
	constructor(name, scene, x, y, points) {
		super(scene, x, y, points, 0xff0000, 0);

		this.setActive(true);
		this.setVisible(true);

		scene.add.existing(this);

		//altering polygon to make interaction accurate
		// let zeroArr = points.slice();
		// scene.matter.vertices.translate(zeroArr, this.getTopLeft().negate(), 1);

    this.setName(name);


		//#region interaction

		//#endregion
	}

	/**
	 *
	 * manually update the objects physics
	 */
	refresh() {}

	/**
	 * convert this to a non interactable static physics object
	 */
	convert() {}
}
