import UIObj from "./UIObj";

/**
 * UI button
 */
export default class UIButton extends UIObj {
	/**
	 * UI button, UIObj container + background + clickable zone
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0.
	 * @param {number} w width
	 * @param {number} h heigth
	 * @param {number} config heigth
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 */
	constructor(name, scene, x, y, cascadeEnable, cascadeDisable, children) {
		super(name, scene, x, y, cascadeEnable, cascadeDisable, children);

		let winGraph = this.UiGraphCreate(0, 0, config);

		let zone = new Phaser.GameObjects.Zone(this.scene, 0, 0, w, h).setOrigin(0);
		window.add(zone);
		window.UiMakeInteractive(zone);

		zone.on(
			"pointerdown",
			function (a, b, c, d) {
				console.log("POINTER ", a, b, c, d);
			},
			this
		);

		win.on("drag", function (pointer, dragX, dragY) {
			this.x = dragX;
			this.y = dragY;

			demo.refresh();
		});
	}
}
