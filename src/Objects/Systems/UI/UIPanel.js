import UIObj from "./UIObj";

/**
 * UI Panel, UIObj container + background
 */
export default class UIPanel extends UIObj {
	/**
	 * UI Panel, UIObj container + background
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} w width. This has the highest priority.
	 * @param {number} h heigth. This has the highest priority.
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphConfig config, x,y,w,h have priority over this. will alter the object.
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 */
	constructor(
		name,
		scene,
		depth,
		x,
		y,
		w,
		h,
		graphConfig,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		super(name, scene, depth, x, y, cascadeEnable, cascadeDisable, children);

		// graphics
		/**
		 * The button Graphics object thatll display stuff
		 * f.e. the background
		 * @type {Phaser.GameObjects.Graphics}
		 */
		this.UI_Graphics = this.UIGraphCreate(0, 0, graphConfig);
		this.add(this.UI_Graphics);
		this.UI_Graphics.fillRect(0, 0, w, h);
	}
}
