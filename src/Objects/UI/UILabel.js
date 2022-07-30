import UIPanel from "./UIPanel";
import UIElement, { UIConfig } from "./UIElement";

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
	 * @param {number | UIElement | undefined} x The top position of the object. Undefined for the most left position. UIElement to orient this obj to the right to it. This has the highest priority.
	 * @param {number | UIElement | undefined} y The top position of the object. Undefined for the most top position. UIElement to orient this obj to the bottom to it. This has the highest priority.
	 * @param {number | undefined} w width of the UI object. undefiend causes the object to take up all possivble space INSIDE a UI element parent, respecting their settings. w<=1 will be handled as a percentage of all possible space.
	 * @param {number | undefined} h heigth of the UI object. undefiend causes the object to take up all possivble space INSIDE a UI element parent, respecting their settings. h<=1 will be handled as a percentage of all possible space.
	 * @param {UIConfig} UiConfig Config object for UI classes
	 * @param {number} posH position of the text in the space, 0-1 | examples: 0 = left, 0.5 = center, 1 = right.
	 * @param {number} posV position of the text in the space, 0-1 | examples: 0 = top, 0.5 = center, 1 = bottom.
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
		UiConfig,
		posH,
		posV,
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
			UiConfig,
			graphConfig,
			cascadeEnable,
			cascadeDisable,
			children
		);

		/**
		 * center text horizontally
		 */
		this.UI_Label_posH = posH;
		/**
		 * center text vertically
		 */
		this.UI_Label_posV = posV;

		// text

		this.UI_Label_text = this.UITextCreate(
			0,
			0,
			text,
			textConfig,
			this.UI_Label_posH,
			this.UI_Label_posV,
			this.width,
			this.height
		);

		this.add(this.UI_Label_text);
	}

	refresh() {
		super.refresh();

		// if (this.parentContainer instanceof UIElement)
		this.UI_Label_recalculate();

		// console.log("refresh - UILabel: ", this.name);
	}

	/**
	 * sets the new text position and recalculates
	 * @param {number | undefined} h 0-1
	 * @param {number | undefined} v 0-1
	 */
	UI_Label_repositionText(h = this.UI_Label_posH, v = this.UI_Label_posV) {
		this.UI_Label_posH = h;
		this.UI_Label_posV = v;

		this.UI_Label_recalculate();
	}

	UI_Label_recalculate() {
		this.UI_Label_text.setPosition(
			(this.width - this.UI_Label_text.width) * this.UI_Label_posH,
			(this.height - this.UI_Label_text.height) * this.UI_Label_posV
		);
	}

	/**
	 * set the string of the UI label text, recalculaates
	 * @param {string | string[]} str
	 */
	UI_Label_setText(str) {
		this.UI_Label_text.setText(str);

		this.UI_Label_recalculate();
	}
}
