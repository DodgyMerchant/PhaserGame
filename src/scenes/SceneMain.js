import { GameObjects } from "phaser";
import Player from "../player/Player";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super("SceneMain");
	}

	preload() {
		console.log("preload");
	}
	create() {
		console.log("createeeeee");
		this.player = new Player(this.matter.world, 50, 50);

		// Phaser.GameObjects.UpdateList.
		// Phaser.GameObjects.DisplayList
		// this.add.existing(this.player);
	}
	update() {}
}
