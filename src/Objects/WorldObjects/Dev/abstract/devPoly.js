export default class devPoly extends Phaser.GameObjects.Polygon {
	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {any} points
	 * @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, scene, x, y, points, interactiveConfig) {
		super(scene, x, y, points, 0xff0000, 0);

		this.setActive(true);
		this.setVisible(true);

		scene.add.existing(this);

		//altering polygon to make interaction accurate
		// let zeroArr = points.slice();
		// scene.matter.vertices.translate(zeroArr, this.getTopLeft().negate(), 1);

		this.setInteractive(interactiveConfig);

		this.name = name;

		//#region interaction

		//start
		this.on(
			"dragstart",
			/** @param {Phaser.Input.Pointer} pointer */
			function (pointer) {
				//#region moving
				//set to dynamic
				// this.setStatic(false);
				//#endregion

				console.log("drag start: ", this.name, this.body.label);
			},
			this
		);
		//drag
		this.on(
			"drag",
			/**
			 * @param {Phaser.Input.Pointer} pointer
			 * @param {number} dragX
			 * @param {number} dragY */
			function (pointer, dragX, dragY) {
				// this.setPosition(dragX, dragY);

				if (!this.scene.debug.levelEditor.pointOnUI(pointer.x, pointer.y)) {
					this.setPosition(dragX, dragY);
				}
				// this.scene.matter.body.translate(this.body, new Phaser.Math.Vector2(dragX, dragY));

				// console.log("drag: ", this.body.position);
			},
			this
		);
		//end
		this.on(
			"dragend",
			/** @param {Phaser.Input.Pointer} pointer */
			function (pointer) {
				//moving

				//set to saaved static
				// this.setStatic(this.saveStatic);

				this.refresh();
				// console.log("dragend: ", this.body.position);
				console.log("drag end: ", this.name, this.body.label);
			},
			this
		);

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
