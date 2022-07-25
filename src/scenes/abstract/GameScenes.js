export default class GameScenes extends Phaser.Scene {
	constructor() {
		super();

		//#region loading

		/** loading bar object
		 * @type {Phaser.GameObjects.Graphics} graphics object
		 */
		this.load_bar;

		//#endregion
	}

	preload() {
		//create loading bar
		this.loadBarCreate();

		this.load.pack("alwaysAssets", "src/assets/alwaysAssets.json");
	}

	create() {}

	update(time, delta) {}

	//#region loading

	loadBarCreate() {
		let h = 25;

		let loadBarConfig = {
			x1: 0,
			y1: this.game.renderer.height - h,
			w: this.game.renderer.width,
			h: h,
			color: 0x00ffff,
			alpha: 1,
		};

		this.load_bar = this.add.graphics({
			fillStyle: {
				alpha: loadBarConfig.alpha,
				color: loadBarConfig.color,
			},
		});

		this.load.on("progress", (p) => {
			//draw loaading bar
			this.load_bar.fillRect(
				loadBarConfig.x1,
				loadBarConfig.y1,
				loadBarConfig.w * p,
				loadBarConfig.h
			);

			console.log("loading%: ", p);
		});
		this.load.on("complete", (percent) => {
			//draw loaading bar
			// this.scene.start()
			this.load_bar.destroy(true);
		});
	}

	//#endregion
}
