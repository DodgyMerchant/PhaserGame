import Player from "../player/Player";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super("SceneMain");

		this.playerStart = {
			x: 50,
			y: 50,
		};
	}

	preload() {
		console.log("SceneMain preload");
	}
	create() {
		//#region debug

		this.input.keyboard.on("keydown-R", this.debug_resetPlayerPos, this);

		//#endregion

		console.log("SceneMain create");
		this.player = new Player(
			this.matter.world,
			this.playerStart.x,
			this.playerStart.y
		);

		// Phaser.GameObjects.UpdateList.
		// Phaser.GameObjects.DisplayList
		// this.add.existing(this.player);
	}
	update() {
		this.player.update();
	}

	//#region debug

	/**
	 * reset player position
	 */
	debug_resetPlayerPos() {
		this.player.setPosition(this.playerStart.x, this.playerStart.y);
		this.player.setVelocity(0);
	}

	//#endregion
}
