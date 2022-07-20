import worldObjImage from "../abstract/worldObjImage";

export default class wallObjInter extends worldObjImage {
	/**
	 *
	 * @param {string} name a name
	 * @param {Phaser.Physics.Matter.World} world physics world
	 * @param {number} x
	 * @param {number} y
	 * @param {string | Phaser.Textures.Texture} textture
	 * @param {string | number | undefined} frame
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 * @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, world, x, y, textture, frame, options, interactiveConfig) {
		super(world, x, y, textture, frame, options);

		this.name = name;

		//altering polygon to make interaction accurate
		let zeroArr = options.vertices.slice();
		this.scene.matter.vertices.translate(
			zeroArr,
			this.getTopLeft().negate(),
			1
		);

		interactiveConfig.hitArea.setTo(zeroArr);

		// console.log("log - vertObj.getTopLeft(): ", vertObj.getTopLeft());

		//make interactive
		this.setInteractive(interactiveConfig);

		// this.setActive(true);
		// this.setVisible(true);

		// this.scene.add.existing(this);

		// this.scene.input.setDraggable();

		this.saveStatic = this.isStatic;

		//#region move obj with mouse

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
		this.on(
			"drag",
			/**
			 * @param {Phaser.Input.Pointer} pointer
			 * @param {number} dragX
			 * @param {number} dragY */
			function (pointer, dragX, dragY) {
				// this.setPosition(dragX, dragY);
				this.setPosition(dragX, dragY);

				// this.scene.matter.body.translate(this.body, new Phaser.Math.Vector2(dragX, dragY));

				// console.log("drag: ", this.body.position);
			},
			this
		);
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

		// console.log("new wall", this);

		//#endregion
	}

	/**
	 *
	 * manually update the objects physics
	 */
	refresh() {
		this.setAwake();
	}

	/**
	 * convert this to a non interactable static physics object
	 */
	convert() {
		this.scene.mapObjVertCreate(this.body.vertices, false);
		this.destroy(false);
	}
}
