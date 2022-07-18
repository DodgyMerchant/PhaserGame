import { UIConfig } from "./UIElement";

/**
 * UI object
 */
export default class UIObj extends Phaser.GameObjects.Container {
	/**
	 * name of UI system events
	 */
	static EventNames = {
		UIAdded: "UISystemAddedToContainer",
	};

	/**
	 * UI object extendended from Container
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0.
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
		cascadeEnable,
		cascadeDisable,
		children
	) {
		super(scene, x, y, children);

		this.originalX = x;
		this.originalY = y;

		//#region setup
		this.setDepth(depth);
		this.setName(name);
		this.setVisible(true);
		this.setAlpha(1);

		/**
		 * If enabling the UI Parent will enable this AND its childen. def true.
		 * @type {boolean | undefined}
		 */
		this.CascadeEnable = cascadeEnable != undefined ? cascadeEnable : true;
		/**
		 * If disabling the UI Parent will disable this AND its childen. def true.
		 * @type {boolean | undefined}
		 */
		this.CascadeDisable = cascadeDisable != undefined ? cascadeDisable : true;

		//#endregion

		this.enable(true);

		this.on(UIObj.EventNames.UIAdded, this.refresh, this);
	}

	/**
	 * add me to a group to run this automatically
	 */
	update(time, delta) {
		super.update(time, delta);

		// console.log("UIO update: ", this.name);
	}

	/**
	 * enable this UIObj and all iots children
	 * @param {boolean} bool enable or nothing
	 */
	enable(bool) {
		this.setActive(bool);

		this.setVisible(bool);

		if (bool) {
			this.addToDisplayList();
			this.addToUpdateList();
		} else {
			this.removeFromDisplayList();
			this.removeFromUpdateList();
		}

		this.__UI_ProcessChildren(bool);
	}

	/**
	 *
	 * @param {Phaser.GameObjects.GameObject} obj
	 */
	add(obj) {
		super.add(obj);
		obj.emit(UIObj.EventNames.UIAdded);
	}

	/**
	 * update variables
	 */
	refresh() {
		this.list.forEach((child) => {
			if (child instanceof UIObj) {
				// console.log("refresh child: ", child.name);
				element.refresh();
			}
		});
	}

	//#region new UI

	/**
	 * creates, returns a graphics object, doesnt add it to anything except for the scene the caller is in
	 * @param {number | undefined} x x position, will overwrite the x value in the object set by the config, not the config itself
	 * @param {number | undefined} y y position, will overwrite the x value in the object set by the config, not the config itself
	 * @param {Phaser.Types.GameObjects.Graphics.Options | undefined} config config used
	 * @returns {Phaser.GameObjects.Graphics}
	 */
	UIGraphCreate(x, y, config) {
		let object = this.scene.add.graphics(config);

		if (x != undefined) object.setX(x);
		if (y != undefined) object.setY(y);

		return object;
	}

	/**
	 * creates a text object
	 * @param {number} x x posiiton
	 * @param {number} y y posiiton
	 * @param {string | string[]} text x posiiton
	 * @param {Phaser.Types.GameObjects.Text.TextStyle | undefined} style text config obj, wont edit this
	 * @param {number} posH position of the text in the space, 0-1 | examples: 0 = left, 0.5 = center, 1 = right.
	 * @param {number} posV position of the text in the space, 0-1 | examples: 0 = top, 0.5 = center, 1 = bottom.
	 * @param {number} width
	 * @param {number} height
	 * @returns {Phaser.GameObjects.Text} the text obj
	 */
	UITextCreate(x, y, text, style, posH, posV, width, height) {
		/**
		 * Button text displayed
		 * @type {Phaser.GameObjects.Text}
		 */
		let textObj = this.scene.add.text(y, x, text, style);

		//center text vertically
		if (posH > 0) {
			// textObj.setX((width - textObj.width) * posH);
			textObj.setX((width - textObj.width) * posH);
		}
		if (posV > 0) {
			textObj.setY((height - textObj.height) * posV);

			// let num = textObj.getWrappedText().length;
			// let textH =
			// 	num * textObj.getTextMetrics().ascent * textObj.scaleY +
			// 	(num - 1) * textObj.lineSpacing;
			// textObj.padding.top = (posH - textH) / 2;
		}

		textObj.updateText();
		return textObj;
	}

	//#endregion

	//#region interactive

	//user usable
	/**
	 * make a child object interactive, call this with the parent on the child.
	 * modified setInteractive().
	 * does some UI stuff so use this over setInteractive()
	 *
	 * Pass this Game Object to the Input Manager to enable it for Input.
	 *
	 * Input works by using hit areas, these are nearly always geometric shapes, such as rectangles or circles, that act as the hit area for the Game Object. However, you can provide your own hit area shape and callback, should you wish to handle some more advanced input detection.
	 *
	 * If no arguments are provided it will try and create a rectangle hit area based on the texture frame the Game Object is using. If this isn't a texture-bound object, such as a Graphics or BitmapText object, this will fail, and you'll need to provide a specific shape for it to use.
	 *
	 * You can also provide an Input Configuration Object as the only argument to this method.
	 * @param {Phaser.GameObjects.GameObject} obj object to do this on
	 * @param {any | Phaser.Geom.Rectangle} hitArea  — Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
	 * @param {Phaser.Types.Input.HitAreaCallback | undefined} callback — The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
	 * @param {boolean | undefined} dropZone — Should this Game Object be treated as a drop zone target? Default false.
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UIMakeInteractive(obj, hitArea, callback, dropZone) {
		obj.setInteractive(hitArea, callback, dropZone);

		return obj;
	}
	/**
	 * activate or deactivate interactive state in a child object that was already made interactive with UIMakeInteractive(), call this with the parent on the child.
	 * does some UI stuff so use this over setInteractive() or disableInteractive()
	 *
	 * @param {Phaser.GameObjects.GameObject} object object to do this on
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UISetInteractive(object, bool) {
		if (bool) return object.setInteractive();
		else return object.disableInteractive();
	}
	/**
	 * removes the interactive component of the child object, call this with the parent on the child.
	 * does some UI stuff so use this over removeInteractive()
	 *
	 * @param {Phaser.GameObjects.GameObject} object object to do this on
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UIRemoveInteractiveInteractive(object) {
		object.removeInteractive();

		return object;
	}

	//#region

	/**
	 * enable children cascade
	 * @param {boolean | undefined} bool enable or not
	 */
	__UI_ProcessChildren(bool) {}

	//#endregion

	//#endregion
	//#region config

	/**
	 * clone and overwrite a config
	 * @param {object} confToClone clones aadn returns this
	 * @param {object} confOverwritgt1 any number of configs
	 * @returns {object} new cloned config
	 */
	UIConfigMergeOverwrite(confToClone, confOverwritgt1, more) {
		let clone = Phaser.Utils.Objects.DeepCopy(confToClone);

		// console.log("clone ini: ", clone);

		for (let index = 1; index < arguments.length; index++) {
			Phaser.Utils.Objects.Extend(clone, arguments[index]);
			// console.log("clone: ", index, arguments[index]);
		}

		// console.log("clone fin: ", clone);

		return clone;
	}

	//#endregion
}
