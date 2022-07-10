/**
 * UI object
 */
export default class UIObj extends Phaser.GameObjects.Container {
	/**
	 * UI object extendended from Container
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number | undefined} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number | undefined} y The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 */
	constructor(scene, x, y, children) {
		super(scene, x, y, children);
		//#region setup

		//#endregion
		this.addToDisplayList();
		this.addToUpdateList();
		this.setActive(true);
		this.setVisible(true);
		this.setAlpha(1);
	}

	/**
	 * actiually a new UIObj, basically the same as a container
	 * @param {number | undefined} x
	 * @param {number | undefined} y
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children
	 * @returns {UIObj} new UI group
	 */
	UiGroupCreate(x, y, children) {
		let obj = new UIObj(this.scene, x, y, children);
		this.add(obj);
		return obj;
	}

	/**
	 * creates, returns
	 * @param {number | undefined} x
	 * @param {number | undefined} y
	 * @param {Phaser.Types.GameObjects.Graphics.Options | undefined} config
	 * @returns {Phaser.GameObjects.Graphics}
	 */
	UiGraphCreate(x, y, config) {
		let obj = this.scene.add.graphics(config);
		obj.setX(x).setY(y);

		return obj;
	}
}
