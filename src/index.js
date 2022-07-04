import Phaser from "phaser";
import SceneMain from "./scenes/SceneMain.js";

var view_size = 500;

const config = {
	type: Phaser.AUTO,
	parent: "div-game",
	width: view_size,
	height: view_size,
	backgroundColor: "#333333",
	scene: [SceneMain],
	scale: 2,
	physics: {
		default: "matter",
		matter: {
			enableSleeping: true,
			gravity: { y: 0 },
			debug: true,
			// debug: {
			// 	showBody: true,
			// 	showStaticBody: true,
			// },
      
		},
	},
};



new Phaser.Game(config);
