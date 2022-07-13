import UIPanel from "./UIPanel";

/**
 * UI Label, UIObj container + background + text
 */
export default class UILabel extends UIPanel {
	/**
	 * UI Label, UIObj container + background + text
	 *
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} w width. This has the highest priority.
	 * @param {number} h heigth. This has the highest priority.
	 * @param {boolean} centerH if the text should be horizontally centered.
	 * @param {boolean} centerV if the text should be Vertivally centered.
	 * @param {string} text text displayed.
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphConfig config, x,y,w,h have priority over this. will alter the object.
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} textConfig config for text displayed. will alter the object. args: pointer, relX, relY, stopPropagation
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
		centerH,
		centerV,
		text,
		graphConfig,
		textConfig,
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
			w,
			h,
			graphConfig,
			cascadeEnable,
			cascadeDisable,
			children
		);

		// text

		this.UI_Label_text = this.UITextCreate(
			0,
			0,
			text,
			textConfig,
			centerH ? w : undefined,
			centerV ? h : undefined
		);
		this.add(this.UI_Label_text);
	}
}
