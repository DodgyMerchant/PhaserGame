import UILabel from "./UILabel";

/**
 * UI button, UIObj container + background + clickable zone
 */
export default class UIButton extends UILabel {
	/**
	 * UI button, UIObj container + background + clickable zone
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
		w,
		h,
		centerH,
		centerV,
		text,
		graphConfig,
		textConfig,
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
		);

		// zone

		/**
		 * Clickable zone of the button
		 * @type {Phaser.GameObjects.Zone}
		 */
		this.UI_Button_zone = new Phaser.GameObjects.Zone(this.scene, 0, 0, w, h);
		this.UI_Button_zone.setOrigin(0);
		this.add(this.UI_Button_zone);
		this.UIMakeInteractive(this.UI_Button_zone);

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
}
