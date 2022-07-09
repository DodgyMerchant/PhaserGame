import LevelEditor from "./LevelEditor";

/** debugging class */
export default class DebugSceneObj {
	/** READ ONLY, if debug is active. set with debug() method
	 * @type {boolean} bool
	 */
	static active = false;

	/**
	 * created a debugging object
	 * @param {Phaser.Scene} scene scene this is created in
	 */
	constructor(scene) {
		/** scene created in
		 * @type {Phaser.Scene} scene
		 */
		this.scene = scene;

		this.debugToggle(true);

		//#region

		this.scene.input.keyboard.on("keydown-R", this.restart, this);

		var keyObj = this.scene.input.keyboard.addKey("J"); // Get key object
		keyObj.on(
			"down",
			function (event) {
				this.debugToggle();
			},
			this
		);

		//#endregion

		this.levelEditor == new LevelEditor(scene);

		console.log("//////////// Debug Obj Created ////////////");
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined

	 */
	debugToggle(bool) {
		if (bool == undefined) {
			DebugSceneObj.active = !DebugSceneObj.active;
		} else {
			DebugSceneObj.active = bool;
		}

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
}
