import UILabel from "./UILabel";
import UIElement, { UIConfig } from "./Abstract/UIElement";

/**
 * UI button, UIObj container + background + clickable zone
 */
export default class UIButton extends UILabel {
	/**
	 * UI button, UIObj container + background + clickable zone
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number | UIElement | undefined} x The top position of the object. Gets offset by the margin. Undefined for the most left position. UIElement to orient this obj to the right to it. This has the highest priority.
	 * @param {number | UIElement | undefined} y The vertical position of this Game Object in the world. Undefined for the most top position. UIElement to orient this obj to the bottom to it. This has the highest priority.
	 * @param {UIConfig} UiConfig Config object for UI classes
	 * @param {number} posH position of the text in the space, 0-1 | examples: 0 = left, 0.5 = center, 1 = right.
	 * @param {number} posV position of the text in the space, 0-1 | examples: 0 = top, 0.5 = center, 1 = bottom.
	 * @param {string} text text displayed.
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphConfig config, x,y,w,h have priority over this. will alter the object.
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} textConfig config for text displayed. will alter the object.
	 * @param {Phaser.Types.Input.InputConfiguration | undefined} interConfig config for the interactive object
	 * @param {string | undefined} eventTrigger will emit event the interactable zone will listen to. f.e. "pointerdown".
	 * @param {string | undefined} eventEmitted event emitted by the zone in trigger event, on this Button Obj. NOT the zone.
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
		posH,
		posV,
		text,
		graphConfig,
		textConfig,
		interConfig,
		eventTrigger,
		eventEmitted,
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
			posH,
			posV,
			text,
			graphConfig,
			textConfig,
			cascadeEnable,
			cascadeDisable,
			children
		);

		// zone

		/**
		 * Clickable zone of the button
		 * @type {Phaser.GameObjects.Zone}
		 */
		this.UI_Button_zone = new Phaser.GameObjects.Zone(
			this.scene,
			0,
			0,
			this.width,
			this.height
		);
		this.UI_Button_zone.setOrigin(0);
		this.add(this.UI_Button_zone);

		/** @type {Phaser.Types.Input.InputConfiguration} */
		let config = {};

		if (interConfig != undefined) {
			this.UIMakeInteractive(
				this.UI_Button_zone,
				Phaser.Utils.Objects.Merge(interConfig, config)
			);
		} else {
			this.UIMakeInteractive(this.UI_Button_zone);
		}

		if (eventTrigger != undefined && eventEmitted != undefined) {
			this.UI_Button_zone.on(
				eventTrigger,
				function (pointer, relX, relY, stopPropagation) {
					// this.scene.input.stopPropagation();
					this.UI_Button_zone.parentContainer.emit(
						eventEmitted,
						pointer,
						relX,
						relY,
						stopPropagation
					);
				},
				this
			);
		}
	}

	refresh() {
		super.refresh();

		if (this.parentContainer instanceof UIElement) {
			console.log("resize button: ", this.width, this.height);
			this.UI_Button_zone.setSize(this.width, this.height, true);
		}

		// console.log("refresh - UIButton: ", this.name);
	}
}
