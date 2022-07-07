import Player from "../Objects/player/Player";
import { STATES } from "../Objects/MovementObj";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super("SceneMain");

		//information on the player
		this.playerConfig = {
			x: 50,
			y: 50,
			state: STATES.FREE,
			/** sprite key:  */
			imageBody_Key: "playerImageBody",
		};
	}

	preload() {
		this.load.pack("tutorial", "src/assets/assets.json");

		console.log("SceneMain preload done");
	}

	create() {
		//#region debug
		this.input.keyboard.on("keydown-R", this.debug_resetPlayerPos, this);

		//#endregion

		this.player = this.add.existing(
			(this.player = new Player(
				this,
				this.playerConfig.x,
				this.playerConfig.y,
				this.playerConfig.imageBody_Key,
				this.playerConfig.state
			))
		);

		console.log("SceneMain create");
	}
	update() {
		this.player.update();
	}

	//#region debug

	/**
	 * reset player position
	 */
	debug_resetPlayerPos() {
		this.player.setPosition(this.playerConfig.x, this.playerConfig.y);
		this.player.setVelocity(0);
	}

	//#endregion
}
