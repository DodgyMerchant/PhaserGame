import LevelEditor from "./LevelEditor";
import UIManager from "../UI/Abstract/UIManager";

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
			font: "Courier",
			fontSize: 5,
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

		this.UILabelCreate(
			this,
			"DebugNoticeLabel",
			this.depth,
			0,
			0,
			{
				width: 150,
				height: 20,
			},
			0.5,
			0.5,
			"Debug Enabled",
			this.debugGraphConf,
			this.debugTextConf,
			true,
			true
		);

		//#endregion

		console.log("//////////// Debug Obj Created ////////////");
	}

	update(time, delta) {
		super.update(time, delta);
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined

	 */
	toggle(bool) {
		if (bool == undefined) {
			this.enable(!this.active);
		} else {
			this.enable(bool);
		}

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
}
