import UILabel from "./UILabel";
import UIElement, { UIConfig } from "./UIElement";

/**
 * UI button, UIObj container + background + clickable zone
 */
export default class UIButton extends UILabel {
	/**
	 * UI button, UIObj container + background + clickable zone
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
		w,
		h,
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

		if (interConfig != undefined) {
			//config given

			//no interactive area given
			if (interConfig.hitArea == undefined) {
				interConfig.hitArea = new Phaser.Geom.Rectangle(
					0, //this.x,
					0, //this.y,
					this.width,
					this.height
				);

				// console.log(
				// 	"button create no area set, created: ",
				// 	interConfig.hitArea
				// );
			}

			//no interactive area callback function given
			if (interConfig.hitAreaCallback == undefined) {
				let cb;

				//get callback method
				switch (interConfig.hitArea.type) {
					case Phaser.Geom.RECTANGLE:
						cb = Phaser.Geom.Rectangle.Contains;
						break;
					case Phaser.Geom.POLYGON:
						cb = Phaser.Geom.Polygon.Contains;
						break;
					case Phaser.Geom.CIRCLE:
						cb = Phaser.Geom.Circle.Contains;
						break;
					case Phaser.Geom.ELLIPSE:
						cb = Phaser.Geom.Ellipse.Contains;
						break;

					default:
						console.log(
							"UI BUtton create type auto determination could not find a suiting callback function!!! Please provide : hitArea or/and hitAreaCallback in creation!"
						);
						break;
				}

				interConfig.hitAreaCallback = cb;

				// console.log(
				// 	"button create no area callback set, set: ",
				// 	interConfig.hitAreaCallback
				// );
			}

			this.UIMakeInteractive(this.UI_Button_zone, interConfig);
		} else {
			this.UIMakeInteractive(this.UI_Button_zone);
		}

		// emitting event
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
			this.UI_Button_zone.setSize(this.width, this.height);
			this.UI_Button_zone.input.hitArea.width = this.width;
			this.UI_Button_zone.input.hitArea.height = this.height;

			// console.log(
			// 	"resize button: ",
			// 	this.width,
			// 	this.height,
			// 	this.UI_Button_zone.input.hitArea
			// );
		}

		// console.log("refresh - UIButton: ", this.name);
	}
}
