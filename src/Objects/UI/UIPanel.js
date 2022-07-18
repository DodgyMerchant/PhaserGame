import UIElement from "./Abstract/UIElement";
import { UIConfig } from "./Abstract/UIElement";

/**
 * UI Panel, UIObj container + background
 */
export default class UIPanel extends UIElement {
	/**
	 * UI Panel, UIObj container + background
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number | UIElement | undefined} x The top position of the object. Gets offset by the margin. Undefined for the most left position. UIElement to orient this obj to the right to it. This has the highest priority.
	 * @param {number | UIElement | undefined} y The vertical position of this Game Object in the world. Undefined for the most top position. UIElement to orient this obj to the bottom to it. This has the highest priority.
	 * @param {UIConfig} UiConfig Config object for UI classes
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
		UiConfig,
		graphConfig,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		super(
			name,
			scene,
			depth,
			x,
			y,
			UiConfig,
			cascadeEnable,
			cascadeDisable,
			children
		);

		// graphics
		/**
		 * The button Graphics object thatll display stuff
		 * f.e. the background
		 * @type {Phaser.GameObjects.Graphics}
		 */
		this.UI_Graphics = this.UIGraphCreate(0, 0, graphConfig).save();
		this.add(this.UI_Graphics);
		this.UIPanel_Draw();
	}

	refresh() {
		super.refresh();

		if (this.parentContainer instanceof UIElement) {
			this.UI_Graphics.restore().save();
			this.UIPanel_Draw();
		}

		// console.log("refresh - UIPanel: ", this.name);
	}

	UIPanel_Draw() {
		this.UI_Graphics.fillRect(0, 0, this.width, this.height);

		// console.log(
		// 	"draw panel: ",
		// 	this.name,
		// 	this.x,
		// 	this.y,
		// 	this.width,
		// 	this.height
		// );
	}
}
