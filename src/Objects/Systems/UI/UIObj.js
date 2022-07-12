/**
 * UI object
 */
export default class UIObj extends Phaser.GameObjects.Container {
	/**
	 * UI object extendended from Container
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 */
	constructor(name, scene, x, y, cascadeEnable, cascadeDisable, children) {
		super(scene, x, y, children);

		//#region setup
		this.setName(name);
		this.setVisible(true);
		this.setAlpha(1);

		/**
		 * If enabling the UI Parent will enable this AND its childen. default true.
		 * @type {boolean | undefined}
		 */
		this.CascadeEnable = cascadeEnable != undefined ? cascadeEnable : true;
		/**
		 * If disabling the UI Parent will disable this AND its childen. default true.
		 * @type {boolean | undefined}
		 */
		this.CascadeDisable = cascadeDisable != undefined ? cascadeDisable : true;

		//#endregion

		this.enable(true);
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

		if (bool) {
			this.addToDisplayList();
			this.addToUpdateList();
		} else {
			this.removeFromDisplayList();
			this.removeFromUpdateList();
		}

		this.__UI_ProcessChildren(bool);
	}

	//UI

	/**
	 * actiually a new UIObj, basically the same as a container
	 * @param {string} name a name
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean | undefined} cascadeEnable — The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable — The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children
	 * @returns {UIObj} new UI container
	 */
	UiContainerCreate(name, x, y, cascadeEnable, cascadeDisable, children) {
		let object = new UIObj(
			name,
			this.scene,
			x,
			y,
			cascadeEnable,
			cascadeDisable,
			children
		);
		return object;
	}

	/**
	 * creates, returns
	 * @param {number | undefined} x
	 * @param {number | undefined} y
	 * @param {Phaser.Types.GameObjects.Graphics.Options | undefined} config
	 * @returns {Phaser.GameObjects.Graphics}
	 */
	UiGraphCreate(x, y, config) {
		let object = this.scene.add.graphics(config);
		object.setX(x).setY(y);

		return object;
	}

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
	 * @param {Phaser.GameObjects.GameObject} object object to do this on
	 * @param {any | Phaser.Geom.Rectangle} hitArea  — Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
	 * @param {Phaser.Types.Input.HitAreaCallback | undefined} callback — The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
	 * @param {boolean | undefined} dropZone — Should this Game Object be treated as a drop zone target? Default false.
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UiMakeInteractive(object, hitArea, callback, dropZone) {
		object.setInteractive(hitArea, callback, dropZone);

		return object;
	}
	/**
	 * activate or deactivate interactive state in object that was already maade interactive with UiMakeInteractive()
	 * does some UI stuff so use this over setInteractive() or disableInteractive()
	 *
	 * @param {Phaser.GameObjects.GameObject} object object to do this on
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UiSetInteractive(object, bool) {
		if (bool) return object.setInteractive();
		else return object.disableInteractive();
	}
	/**
	 * removes the interaactive component of the object
	 * does some UI stuff so use this over removeInteractive()
	 *
	 * @param {Phaser.GameObjects.GameObject} object object to do this on
	 * @returns {Phaser.GameObjects.GameObject} game object
	 */
	UiRemoveInteractiveInteractive(object) {
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
}
