import LevelEditor from "./LevelEditor";

/** debugging class */
export default class DebugSceneObj {
	/** READ ONLY, if debug is active. set with toggle() method
	 * @type {boolean} bool
	 */
	static active = false;

	/**
	 * created a debugging object
	 * @param {Phaser.Scene} scene scene this is created in
	 * @param {boolean | undefined} bool if active
	 */
	constructor(scene, bool) {
		/** scene created in
		 * @type {Phaser.Scene} scene
		 */
		this.scene = scene;

		this.toggle(bool);

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

		this.createLevelEditor(true);

		//#region

		this.scene.input.keyboard.on("keydown-R", this.restart, this);

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
				this.levelEditor.toggle();
			},
			this
		);

		//#endregion

		console.log("//////////// Debug Obj Created ////////////");
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined

	 */
	toggle(bool) {
		if (bool == undefined) {
			DebugSceneObj.active = !DebugSceneObj.active;
		} else {
			DebugSceneObj.active = bool;
		}

		//#region level editor

		if (this.levelEditor != undefined) {
			//turning on debug
			if (DebugSceneObj.active) {
				//if level editor was on as we disaabled debug
				if (this.levelEditorWasActive) this.levelEditor.toggle(true);
			} else {
				//turning off the debug obj

				//if level editor is on, keep in mind and open auto on enable
				if (LevelEditor.active) {
					this.levelEditorWasActive = true;
					this.levelEditor.toggle(false);
				}
			}
		}
		//#endregion

		this.scene.matter.world.drawDebug = DebugSceneObj.active;

		if (DebugSceneObj.active) {
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
		this.levelEditor = new LevelEditor(this.scene, 0, 0, bool);
	}
}
