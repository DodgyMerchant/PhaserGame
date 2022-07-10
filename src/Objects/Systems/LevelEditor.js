import { Events } from "phaser";
import UIObj from "./UIObj";

/**
 * level editor
 */
export default class LevelEditor extends UIObj {
	/** READ ONLY, if level editor is active. set with toggle() method
	 * @type {boolean} bool
	 */
	static active = false;

	/**
	 * create a level editor
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number | undefined} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number | undefined} y The vertical position of this Game Object in the world. Default 0.
	 * @param {bool | undefined} bool if aactive. default true
	 */
	constructor(scene, x, y, bool) {
		super(scene, x, y, undefined);

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
			/** move speed */
			spd: 5,
			/** move speed */
			zoomStrg: 0.1,
			/** move speed */
			zoomMin: 0.1,
		};

		//#endregion
		//#region input

		// /**
		//  * input
		//  */
		// this.inputKeys = this.scene.input.keyboard.addKeys(
		// 	{
		// 		//cam
		// 		/** @type {Phaser.Input.Keyboard.Key} */
		// 		up: Phaser.Input.Keyboard.KeyCodes.UP,
		// 		/** @type {Phaser.Input.Keyboard.Key} */
		// 		down: Phaser.Input.Keyboard.KeyCodes.DOWN,
		// 		/** @type {Phaser.Input.Keyboard.Key} */
		// 		left: Phaser.Input.Keyboard.KeyCodes.LEFT,
		// 		/** @type {Phaser.Input.Keyboard.Key} */
		// 		right: Phaser.Input.Keyboard.KeyCodes.RIGHT,

		// 		//
		// 	},
		// 	true,
		// 	true
		// );

		//#endregion
		//#region camera

		//#region setup
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
		this.add(this.CamMainGraph);

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

		//#region dragging

		//#endregion
		//#region zoom

		this.scene.input.on(
			"wheel",
			function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
				//start zoom
				this.CamEditor.zoomTo(
					Phaser.Math.MinSub(
						this.CamEditor.zoom,
						Math.sign(deltaY) * this.camConfig.zoomStrg,
						this.camConfig.zoomMin
					),
					0,
					undefined,
					true,
					undefined,
					undefined
				);
				console.log("wheel: ", pointer, gameObjects, deltaX, deltaY, deltaZ);
			},
			this
		);

		this.scene.input.on(
			Phaser.Input.MOUSE_DOWN,
			function (pointer, gameObjects, a, b, c, d) {
				console.log("MOUSE_DOWN: ", pointer, gameObjects, a, b, c, d);
			},
			this
		);

		//#endregion

		//#region kamera arrow key movement

		//kinda useless
		// this.inputKeys.up.on(
		// 	Phaser.Input.Keyboard.Events.DOWN,
		// 	function (key, keybEv) {
		// 		this.cameraMoveBy(0, -this.camConfig.spd);
		// 	},
		// 	this
		// );
		// this.inputKeys.down.on(
		// 	Phaser.Input.Keyboard.Events.DOWN,
		// 	function (key, keybEv) {
		// 		this.cameraMoveBy(0, this.camConfig.spd);
		// 	},
		// 	this
		// );
		// this.inputKeys.left.on(
		// 	Phaser.Input.Keyboard.Events.DOWN,
		// 	function (key, keybEv) {
		// 		this.cameraMoveBy(-this.camConfig.spd, 0);
		// 	},
		// 	this
		// );
		// this.inputKeys.right.on(
		// 	Phaser.Input.Keyboard.Events.DOWN,
		// 	function (key, keybEv) {
		// 		this.cameraMoveBy(this.camConfig.spd, 0);
		// 	},
		// 	this
		// );

		//#endregion

		//#endregion

		//#endregion
		//#region UI

		//heading
		let txt = this.scene.add.text(x, y, "Level Editor - Active", this.txtConf);
		this.add(txt);

		this.Inspector = this.createWindow(100, 300, 70, 70, this.graphConf);

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

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined
	 */
	toggle(bool) {
		if (bool == undefined) {
			LevelEditor.active = !LevelEditor.active;
		} else {
			LevelEditor.active = bool;
		}

		if (LevelEditor.active) {
			this.addToDisplayList();
			this.addToUpdateList();
		} else {
			this.removeFromDisplayList();
			this.removeFromUpdateList();
		}

		this.cameraActivate(LevelEditor.active);
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {Phaser.Types.GameObjects.Graphics.Options} config
	 * @return {UIObj}
	 */
	createWindow(x, y, w, h, config) {
		let winGroup = this.UiGroupCreate(x, y);
		this.add(winGroup);

		//background
		let winGraph = this.UiGraphCreate(0, 0, config);
		winGroup.add(winGraph);
		let winBack = winGraph.fillRect(0, 0, w, h);

		winGroup.setInteractive(
			new Phaser.Geom.Rectangle(0, 0, w, h),
			Phaser.Geom.Rectangle.Contains
		);

		winGroup.on(
			"pointerdown",
			function (a, b, c, d) {
				console.log("POINTER", a, b, c, d);
			},
			this
		);

		return {
			/**
			 * group
			 * @type {UIObj}
			 */
			group: winGroup,
			/**
			 * group
			 * @type {Phaser.GameObjects.Graphics}
			 */
			graphic: winGraph,
			/**
			 * group
			 * @type {Phaser.GameObjects.Graphics}
			 */
			background: winBack,
		};
	}

	//#region camera

	cameraMoveBy(x, y) {
		this.CamEditor.setScroll(
			this.CamEditor.scrollX + x,
			this.CamEditor.scrollY + y
		);
	}

	/**
	 * aactivate or deactivate camera stuff
	 * @param {boolean} active activate or deactivate
	 */
	cameraActivate(active) {
		if (active) {
			//set cam pos

			// this.scene.cameras.remove(this.CamMain, false);
			// this.CamMain.setVisible(false);

			this.CamEditor = this.cameraEditorCreateFrom(this.CamMain);
			this.scene.cameras.addExisting(this.CamEditor, false);

			//main cam
			this.CamMain.setPosition(0, this.CamMain.height);
		} else {
			this.scene.cameras.remove(this.CamEditor, true);

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

		camNew.on(Phaser.Cameras.Scene2D.Events.ZOOM_COMPLETE, function (cam) {
			console.log("editor cam zoom: ", cam.zoom);
		});

		//end
		return camNew;
	}

	//#endregion
}
