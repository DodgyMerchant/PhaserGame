import UIObj from "./UI/UIObj";

/**
 * level editor
 */
export default class LevelEditor extends UIObj {
	/**
	 * create a level editor
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {Phaser.GameObjects.Group} debugGroup The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number | undefined} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number | undefined} y The vertical position of this Game Object in the world. Default 0.
	 * @param {bool | undefined} bool if active. default true
	 */
	constructor(name, scene, debugGroup, x, y, bool) {
		super(name, scene, x, y, undefined);

		//#region this obj setup
		/**
		 * @type {Phaser.GameObjects.Group} group im in
		 */
		this.group = debugGroup;

		//#endregion
		//#region conf
		/**
		 * text config
		 * @type {Phaser.Types.GameObjects.Text.TextStyle}
		 */
		this.txtConf = {
			fontFamily: "Arial",
			color: "#ffffff",
		};

		/**
		 * graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.graphConf = {
			x: 0,
			y: 0,
			fillStyle: {
				alpha: 0.3,
				color: "#000000",
			},
			lineStyle: {
				alpha: 0.3,
				color: "#000000",
				width: 5,
			},
		};

		/**
		 * cam config
		 */
		this.camConfig = {
			/** background color
			 * @type {number}
			 */
			backCol: "#828282",
			moveEventName: "LevelEditorCamMainMove",
			speed: 5,

			//zoom
			zoomBase: this.scene.cameras.main.zoom,
			zoomSpeed: 0.01,
			maxZoom: 10,
			minZoom: 0.1,
			zoomWheelComp: 8,
		};

		//#endregion
		//#region input

		/**
		 * input
		 */
		this.inputKeys = this.scene.input.keyboard.addKeys(
			{
				//#region cam
				//cam movement
				/** @type {Phaser.Input.Keyboard.Key} */
				up: Phaser.Input.Keyboard.KeyCodes.UP,
				/** @type {Phaser.Input.Keyboard.Key} */
				down: Phaser.Input.Keyboard.KeyCodes.DOWN,
				/** @type {Phaser.Input.Keyboard.Key} */
				left: Phaser.Input.Keyboard.KeyCodes.LEFT,
				/** @type {Phaser.Input.Keyboard.Key} */
				right: Phaser.Input.Keyboard.KeyCodes.RIGHT,

				//cam zoom
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomIn: Phaser.Input.Keyboard.KeyCodes.MINUS,
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomOut: Phaser.Input.Keyboard.KeyCodes.PLUS,
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomReset: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,

				//#endregion
			},
			true,
			true
		);

		//mouse
		this.pointer = this.scene.input.activePointer;
		// this.scene.input.on()

		//#endregion
		//#region camera

		//#region setup

		/**
		 * if the level editor obj will move with its camera
		 * @type {boolean}
		 */
		this.moveCamWidth = true;
		/**
		 * the original main camera
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamMain = this.scene.cameras.main;

		this.CamMain.on(
			"followupdate",
			/**
			 * @param {Phaser.Cameras.Scene2D.Camera} cam
			 * @param {Player} obj
			 */
			function (cam, obj) {
				cam.emit(this.camConfig.moveEventName, cam);
			},
			this
		);

		/**
		 * camera for the editor
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamEditor;

		this.CamMainGraph = this.scene.add.graphics({
			x: 0,
			y: 0,
			lineStyle: {
				alpha: 0.5,
				color: "0x00ff00",
				width: 7,
			},
		});
		// this.add(this.CamMainGraph); dont add or ittl move with

		/** cam controls
		 * @type {Phaser.Cameras.Controls.FixedKeyControl}
		 */
		this.camControls;

		//#endregion
		//#region main cam outline
		this.CamMainGraph.strokeRectShape(this.CamMain.worldView);
		this.bringToTop(this.CamMainGraph);

		this.CamMain.on(
			this.camConfig.moveEventName,
			/**
			 * @param {Phaser.Cameras.Scene2D.Camera} cam
			 */
			function (cam) {
				this.CamMainGraph.setX(this.CamMain.scrollX);
				this.CamMainGraph.setY(this.CamMain.scrollY);
			},

			this
		);
		//#endregion
		//#region movement

		this.camControls = new Phaser.Cameras.Controls.FixedKeyControl({
			camera: this.CamEditor,
			up: this.inputKeys.up,
			down: this.inputKeys.down,
			left: this.inputKeys.left,
			right: this.inputKeys.right,
			speed: this.camConfig.speed,
			//zoom
			zoomIn: this.inputKeys.zoomIn,
			zoomOut: this.inputKeys.zoomOut,
			zoomSpeed: this.camConfig.zoomSpeed,
			maxZoom: this.camConfig.maxZoom,
			minZoom: this.camConfig.minZoom,
		});

		this.inputKeys.zoomReset.on(
			"down",
			function () {
				this.CamEditor.zoomTo(this.camConfig.zoomBase, 100);
			},
			this
		);

		this.scene.input.on(
			"wheel",
			function (pointer, obj, x, y, z) {
				this.CamEditor.zoom = Phaser.Math.Clamp(
					this.CamEditor.zoom -
						Math.sign(y) *
							this.camConfig.zoomSpeed *
							this.camConfig.zoomWheelComp,
					this.camConfig.minZoom,
					this.camConfig.maxZoom
				);
			},
			this
		);

		//#endregion

		//#endregion
		//#region UI

		//heading
		let txt = this.scene.add.text(x, y, "Level Editor - Active", this.txtConf);
		this.add(txt);

		this.Inspector = this.createWindow(
			"Inspector",
			this.graphConf,
			100,
			300,
			70,
			70,
			true,
			true
		);

		// Phaser.Scene.
		//#endregion

		//#region setup the rest
		//activate or not
		if (bool != undefined) {
			this.toggle(bool);
		} else {
			this.toggle(true);
		}

		//#endregion

		console.log("//////////// level editor created ////////////");
	}

	update(time, delta) {
		//parent update
		super.update();

		this.camera_update();
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined
	 */
	toggle(bool) {
		if (bool == undefined) bool = !this.active;

		this.enable(bool);

		this.cameraActivate(this.active);

		console.log("active: ", this.active);
	}

	//#region UI

	/**
	 * creates a container aand in it a graaphiscs obj thats displaying a rectangle background
	 * @param {string} name a name
	 * @param {Phaser.Types.GameObjects.Graphics.Options} config graphic config for displaying
	 * @param {number} x x
	 * @param {number} y y
	 * @param {number} w width
	 * @param {number} h height
	 * @param {boolean | undefined} cascadeEnable — The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable — The vertical position of this Game Object in the world. Default 0.
	 * @return {object}
	 */
	createWindow(name, config, x, y, w, h, cascadeEnable, cascadeDisable) {
		let window = this.UiContainerCreate(
			name,
			x,
			y,
			cascadeEnable,
			cascadeDisable
		);

		this.add(window);

		//background
		let winGraph = this.UiGraphCreate(0, 0, config);
		window.add(winGraph);
		let winBack = winGraph.fillRect(0, 0, w, h);

		return {
			/**
			 * window
			 * @type {UIObj}
			 */
			window: window,
			/**
			 * graphics
			 * @type {Phaser.GameObjects.Graphics}
			 */
			graphic: winGraph,
			/**
			 * background
			 * @type {Phaser.GameObjects.Graphics}
			 */
			background: winBack,
		};
	}

	//#endregion
	//#region camera

	camera_update() {
		//applying camera controls
		this.camControls.update();

		//moving
		this.cameraMoveWith();
	}

	cameraMoveWith() {
		if (this.moveCamWidth) {
			this.setPosition(this.CamEditor.scrollX, this.CamEditor.scrollY);
		}
	}

	cameraMoveBy(x, y) {
		this.CamEditor.setScroll(
			this.CamEditor.scrollX + x,
			this.CamEditor.scrollY + y
		);
	}

	/**
	 * activate or deactivate camera stuff
	 * @param {boolean} active activate or deactivate
	 */
	cameraActivate(active) {
		if (active) {
			this.setActive(true);

			//set cam pos

			this.CamEditor = this.cameraEditorCreateFrom(this.CamMain);

			this.scene.cameras.addExisting(this.CamEditor, false);
			//activate cam controls
			this.camControls.active = true;
			this.camControls.camera = this.CamEditor;
			//enable main cam outline
			this.CamMainGraph.setVisible(true);

			////main cam
			this.CamMain.setPosition(0, this.CamMain.height);
		} else {
			this.setActive(false);

			this.scene.cameras.remove(this.CamEditor, true);
			//deactivate cam controls
			this.camControls.active = false;
			this.camControls.camera = undefined;

			//disable main cam outline
			this.CamMainGraph.setVisible(false);

			//main caam
			this.CamMain.setPosition(0, 0);
		}
	}

	/**
	 * create a camera
	 * @param {Phaser.Cameras.Scene2D.Camera} camToCopy to copy
	 * @returns {Phaser.Cameras.Scene2D.Camera} new camera
	 */
	cameraEditorCreateFrom(camToCopy) {
		let camNew = new Phaser.Cameras.Scene2D.Camera(
			camToCopy.x,
			camToCopy.y,
			camToCopy.displayWidth / camToCopy.zoom,
			camToCopy.displayHeight / camToCopy.zoom
		);

		camNew.zoom = camToCopy.zoom;

		camNew.setScroll(camToCopy.scrollX, camToCopy.scrollY);

		camNew.setBackgroundColor(this.camConfig.backCol);

		//end
		return camNew;
	}

	//#endregion
}
