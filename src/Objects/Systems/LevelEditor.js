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

		/** text config
		 * @type {Phaser.Types.GameObjects.Text.TextStyle}
		 */
		const txtConf = {
			fontFamily: "Arial",
			color: "#fff",
		};

		/** graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		const graphConf = {
			x: 0,
			y: 0,
			fillStyle: {
				alpha: 0.3,
				color: new Phaser.Display.Color(255, 255, 255, 255),
			},
			lineStyle: {
				alpha: 0.3,
				color: new Phaser.Display.Color(255, 255, 255, 255),
				width: 5,
			},
		};

		//#region camera

		this.camConfig = {
			/** background color
			 * @type {number}
			 */
			backCol: "rgba(255, 0, 0, 0.5)",
		};

		/**
		 * the original main camera
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamMain = this.scene.cameras.main;

		/**
		 * camera for the editor
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamEditor = new Phaser.Cameras.Scene2D.Camera();
		this.CamEditor.setBackgroundColor(this.camConfig.backCol);

		//#endregion
		//#region UI

		//heading
		let txt = this.scene.add.text(x, y, "Level Editor - Active", txtConf);
		this.add(txt);

		this.Inspector = this.createWindow(100, 300, 70, 70, graphConf);

		//#endregion

		//activate or not
		if (bool != undefined) {
			this.toggle(bool);
		} else {
			this.toggle(true);
		}

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
		winGroup.add(winBack);

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

	/**
	 * aactivate or deactivate camera stuff
	 * @param {boolean} active activate or deactivate
	 */
	cameraActivate(active) {
		if (active) {
			//set cam pos
			this.CamEditor.setScroll(this.CamMain.scrollX, this.CamMain.scrollY);

			// this.scene.cameras.remove(this.CamMain, false);
			// this.CamMain.setVisible(false);
			this.CamMain.setPosition(0, this.CamMain.height);

			this.scene.cameras.addExisting(this.CamEditor, false);
			this.CamEditor.transparent = false;
			this.CamEditor.backgroundColor = this.camConfig.backCol;
		} else {
			this.scene.cameras.remove(this.CamEditor, false);
			// this.scene.cameras.addExisting(this.CamMain, false);
			// this.CamMain.setVisible(true);
			this.CamMain.setPosition(0, 0);
		}
	}
}
