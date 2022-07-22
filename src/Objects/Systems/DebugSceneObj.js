import LevelEditor from "./LevelEditor";
import UIManager from "../UI/Abstract/UIManager";
import { UIConfig } from "../UI/UIElement";

/** debugging class */
export default class DebugSceneObj extends UIManager {
	/**
	 * created a debugging object
	 * @param {Phaser.Scene} scene scene this is created in
	 * @param {boolean | undefined} bool if active
	 * @param {boolean | undefined} levelEditor if level editor should be created?
	 */
	constructor(scene, bool, levelEditor) {
		super("DebugSceneObj", scene, 10000, 0, 0, scene.cameras.main, true, true);

		//#region config

		/**
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.debugGraphConf = {
			x: 0,
			y: 0,
			fillStyle: {
				alpha: 1,
				color: Phaser.Display.Color.GetColor(0, 0, 0),
			},
			lineStyle: {
				alpha: 0.9,
				color: Phaser.Display.Color.GetColor(0, 255, 0),
				width: 5,
			},
		};

		/**
		 * @type {Phaser.Types.GameObjects.Text.TextStyle}
		 */
		this.debugTextConf = {
			color: "#00ff00",
			font: "16px Courier",
		};

		//#endregion
		//#region setup

		/** debug group
		 * @type {Phaser.GameObjects.Group} group for debug
		 */
		this.debugGroup = this.scene.add.group({ runChildUpdate: true });
		this.debugGroup.add(this);

		this.toggle(bool);

		//#endregion
		//#region level editor

		/**
		 * the level editor if created
		 * @type {LevelEditor | undefined}
		 */
		this.levelEditor = undefined;
		/**
		 * if the level editor WAS active as this obj got disabled
		 * @type {boolean}
		 */
		this.levelEditorWasActive = false;

		if (levelEditor) this.createLevelEditor(true);

		//#endregion
		//#region debug input and actions

		//dont work???
		this.KeyRestart = this.scene.input.keyboard.addKey("R"); // Get key object
		this.KeyRestart.on(
			"down",
			function (event) {
				this.restart();
			},
			this
		);

		this.KeyToggle = this.scene.input.keyboard.addKey("J"); // Get key object
		this.KeyToggle.on(
			"down",
			function (event) {
				this.toggle();
			},
			this
		);

		this.KeyEditorToggle = this.scene.input.keyboard.addKey("L"); // Get key object
		this.KeyEditorToggle.on(
			"down",
			function (event) {
				if (this.levelEditor != undefined) {
					this.levelEditor.toggle();
				}
			},
			this
		);

		//#endregion

		//#region ui

		/** @type {UIConfig} */
		let uiconfig = {
			marginApplyNoParent: false,
			margin: 0,
			padding: 10,
		};

		this.DebugUILabel = this.UILabelCreate(
			this,
			"DebugNoticeLabel",
			this.depth,
			0,
			0,
			150,
			20,
			uiconfig,
			0.5,
			0.5,
			"Debug Enabled",
			this.debugGraphConf,
			this.debugTextConf,
			true,
			true
		);

		this.debugUI = this.UIPanelCreate(
			this,
			"DebugUI",
			this.depth,
			0,
			this.DebugUILabel,
			100,
			100,
			uiconfig,
			this.debugGraphConf,
			true,
			true
		);

		let tx1 = this.debugUI.UIE_getInnerX1(true) + 0;
		let ty1 = this.debugUI.UIE_getInnerY1(true) + 0;

		this.debugText = this.scene.add.text(tx1, ty1, "", this.debugTextConf);
		this.debugText.setOrigin(0, 0);
		this.debugUI.add(this.debugText);

		//#endregion
		//#region data

		//enable data, set data and buil text
		this.setDataEnabled();
		this.debugUpdate();
		this.debugBuildText();

		this.on(
			"setdata",
			function (gameObject, key, value) {
				// console.log("DEBUG - DATA set:", key, value);
				// console.log("DEBUG - Text Add:", key, value);
				this.debugTextKeyAdd(key, value);
			},
			this
		);
		this.on(
			"changedata",
			function (gameObject, key, value) {
				// console.log("DEBUG - DATA change:", key, value);
				// console.log("DEBUG - Text Build:");

				this.debugBuildText();
			},
			this
		);

		//#endregion data

		console.log("//////////// Debug Obj Created ////////////");
	}

	update(time, delta) {
		super.update(time, delta);

		this.debugUpdate();
	}

	debugUpdate() {
		let obj = {
			fps: this.scene.game.loop.actualFps.toFixed(7),
			test: "add stuff for debug",
		};

		// Phaser.Utils.Objects.Pick(this.data.getAll ,obj);
		// console.log("this.data.getAll", this.data.getAll());
		// console.log("this.data.values", this.data.values);
		if (JSON.stringify(obj) !== JSON.stringify(this.data.getAll())) {
			// console.log("debug update text");
			this.data.set(obj);
		}
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined

	 */
	toggle(bool) {
		if (bool == undefined) {
			bool = !this.active;
		} else {
			if (this.active == bool) {
				console.log(
					"TOGGLE - Object ",
					this.name,
					" already in this state: ",
					this.active,
					"!"
				);
				return;
			}
		}

		// this.PointerConstraint.

		this.enable(bool);

		//#region level editor

		// if (this.levelEditor != undefined) {
		// 	//turning on debug
		// 	if (DebugSceneObj.active) {
		// 		//if level editor was on as we disaabled debug
		// 		if (this.levelEditorWasActive) this.levelEditor.toggle(true);
		// 	} else {
		// 		//turning off the debug obj

		// 		//if level editor is on, keep in mind and open auto on enable
		// 		if (this.levelEditor.active) {
		// 			this.levelEditorWasActive = true;
		// 			this.levelEditor.toggle(false);
		// 		}
		// 	}
		// }

		//#endregion

		this.scene.matter.world.drawDebug = this.active;

		if (this.active) {
		} else {
			this.scene.matter.world.debugGraphic.clear();
		}
	}

	/**
	 * reset player position
	 */
	restart() {
		if (this.debug_active) {
			console.log("restart");
			this.scene.scene.restart();
		}
	}

	/**
	 * @param {bool | undefined} bool if active. default true
	 * @return {LevelEditor}
	 */
	createLevelEditor(bool) {
		this.levelEditor = new LevelEditor(
			"LevelEditor",
			this.scene,
			this.debugGroup,
			0,
			0,
			this.scene.cameras.main.displayWidth / this.scene.cameras.main.zoom,
			this.scene.cameras.main.displayHeight / this.scene.cameras.main.zoom,
			bool
		);
		this.debugGroup.add(this.levelEditor);
	}

	debugBuildText() {
		//reste text
		this.debugText.text = "";

		this.data.each(
			/**
			 * @param {object} origin originator of the call
			 * @param {string} key
			 * @param {any} value
			 * @param {object} context context chosen for call */
			function (origin, key, value, context) {
				// console.log(" - Build:", key, value);

				this.debugTextKeyAdd(key, value);
			},
			this
		);

		let w, h;
		if (this.debugText.width > this.debugUI.UIE_getInnerWidth()) {
			w =
				this.debugText.width +
				this.debugUI.paddingLeft +
				this.debugUI.paddingRight;
		}
		if (this.debugText.height > this.debugUI.UIE_getInnerHeight()) {
			h =
				this.debugText.height +
				this.debugUI.paddingTop +
				this.debugUI.paddingBottom;
		}
		if (w != undefined || h != undefined) {
			this.debugUI.UIE_setSize(w, h);
		}
	}
	debugTextKeyAdd(key, val) {
		this.debugTextAdd(key + ": " + val);
	}
	debugTextAdd(str) {
		this.debugText.text += str + "\n";
	}
}
