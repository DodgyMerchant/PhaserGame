import UIButton from "./UIButton";
import UILabel from "./UILabel";
import UIObj from "./UIObj";
import UIPanel from "./UIPanel";

/** mager for ui stuff */
export default class UIManager extends UIObj {
	/**
	 * UI object extendended from Container
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.Cameras.Scene2D.Camera | undefined} fixToCam camera to move and scale with. the update of this parent must be run to move with the camera.
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
		fixToCam,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		super(name, scene, depth, x, y, cascadeEnable, cascadeDisable, children);

		//#region camera

		/**
		 * camera to move with
		 * the update of this parent must be run to move with the camera
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.fixToCam;
		if (fixToCam != undefined) this.setFixCam(fixToCam);

		// this.setScrollFactor(1, 1, true);

		//#endregion
	}

	/**
	 * add me to a group to run this automatically
	 */
	update(time, delta) {
		super.update(time, delta);

		//moving camera
		this.cameraFixUpdate();
	}

	//#region camera

	/**
	 * move object with given or custom camera
	 * @param {Phaser.Cameras.Scene2D.Camera | undefined} cam camera to move with or the assigned camera
	 */
	cameraFixUpdate() {
		if (this.fixToCam != undefined) {
			//display width and heigth
			if (this.displayWidth != this.fixToCam.displayWidth)
				this.displayWidth = this.fixToCam.displayWidth;
			if (this.displayHeight != this.fixToCam.displayHeight)
				this.displayHeight = this.fixToCam.displayHeight;

			this.setPosition(
				this.fixToCam.scrollX -
					(this.fixToCam.displayWidth -
						this.fixToCam.displayWidth * this.fixToCam.zoomX) /
						2,
				this.fixToCam.scrollY -
					(this.fixToCam.displayHeight -
						this.fixToCam.displayHeight * this.fixToCam.zoomY) /
						2
			);
		}
	}

	/**
	 * camera to move and scale with.
	 * the update of this parent must be run to move with the camera
	 * @param {Phaser.Cameras.Scene2D.Camera} cam camera to move with
	 */
	setFixCam(cam) {
		this.fixToCam = cam;

		let cw = cam.displayWidth / cam.zoomX;
		let ch = cam.displayHeight / cam.zoomY;

		super.width = cw;
		super.height = ch;
		this.setScale(cam.zoomX, cam.zoomY);
		this.setDisplaySize(cam.displayWidth, cam.displayHeight);
	}

	//#endregion
	//#region new UIobj

	/**
	 * actiually a new UIObj, basically the same as a container
	 * @param {UIObj} parent a name
	 * @param {string} name a name
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x
	 * @param {number} y
	 * @param {boolean | undefined} cascadeEnable — The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable — The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children
	 * @returns {UIObj} new UI container
	 */
	UIContainerCreate(
		parent,
		name,
		depth,
		x,
		y,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		let obj = new UIObj(
			name,
			parent.scene,
			depth,
			x,
			y,
			cascadeEnable,
			cascadeDisable,
			children
		);
		parent.add(obj);

		return obj;
	}

	/**
	 * creates a UI Panel, UIObj container + background
	 * @param {UIObj} parent a name
	 * @param {String} name a name
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number} x The horizontal position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} y The vertical position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number} w width. This has the highest priority.
	 * @param {number} h heigth. This has the highest priority.
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphConfig config, x,y,w,h have priority over this. will alter the object.
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 * @returns {UIPanel}
	 */
	UIPanelCreate(
		parent,
		name,
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
		let obj = new UIPanel(
			name,
			parent.scene,
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

		parent.add(obj);
		return obj;
	}

	/**
	 * UI Label, UIObj container + background + text
	 *
	 * @param {UIObj} parent a name
	 * @param {String} name a name
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
	UILabelCreate(
		parent,
		name,
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
		let obj = new UILabel(
			name,
			parent.scene,
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

		parent.add(obj);

		return obj;
	}

	/**
	 * creates a UI button, UIObj container + background + clickable zone
	 * @param {UIObj} parent a name
	 * @param {String} name a name
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
	 * @param {Phaser.Types.Input.InputConfiguration | undefined} interConfig config for the interactive object
	 * @param {string | undefined} eventTrigger will emit event the interactable zone will listen to. f.e. "pointerdown".
	 * @param {string | undefined} eventEmitted event emitted by the zone in trigger event, on this Button Obj. NOT the zone.
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 * @returns {UIButton}
	 */
	UIButtonCreate(
		parent,
		name,
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
		interConfig,
		eventTrigger,
		eventEmitted,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		let obj = new UIButton(
			name,
			parent.scene,
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
			interConfig,
			eventTrigger,
			eventEmitted,
			cascadeEnable,
			cascadeDisable,
			children
		);

		parent.add(obj);

		return obj;
	}

	//#endregion
}
