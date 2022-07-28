import Phaser from "phaser";
import SceneMainGame from "./scenes/SceneMainGame.js";
import SceneMainMenu from "./scenes/SceneMainMenu.js";

var view_size = 700;
var zoom = 1;
var fps = 60;
var second = 1000;
var time_step = second / fps;
let fps_lock = true; //kann umgestellt werden, hat keinen einfluss auf fixedUpdates

//phy debug

//solange die delta die die phy engined benutzt nicht gesetzt werden,
//muss das engione update manuell performt werden
let phy_autoUpdate = false;

/** @type {Phaser.Types.Scenes.SettingsConfig} */
let testConf2 = {
  
};

/**
 * the games config
 * @type {Phaser.Types.Core.GameConfig}
 */
const config = {
	type: Phaser.AUTO,
	parent: "div-game",
	width: view_size,
	height: view_size,
	backgroundColor: "0xffffff",
	scene: [SceneMainMenu], //SceneMainGame
	pixelArt: false,
	disableContextMenu: true,

	scale: {
		zoom: zoom,
	},

	input: {
		gamepad: true,
	},

	fps: {
		target: fps,
		smoothStep: true,
		// forceSetTimeOut: false,
		forceSetTimeOut: fps_lock,
		deltaHistory: time_step,
	},

	physics: {
		default: "matter",

		matter: {
			//maybe other way?
			autoUpdate: phy_autoUpdate,

			runner: {
				isFixed: false,
				delta: time_step,
			},

			enableSleeping: true,
			gravity: { y: 0, x: 0 },

			debug: {
				showAxes: false,
				showAngleIndicator: true,
				angleColor: 0xe81153,

				showBroadphase: false,
				broadphaseColor: 0xffb400,

				showBounds: false,
				boundsColor: 0xffffff,

				showVelocity: true,
				velocityColor: 0x00aeef,

				showCollisions: true,
				collisionColor: 0xf5950c,

				showSeparation: true,
				separationColor: 0xffa500,

				showBody: true,
				showStaticBody: true,
				showInternalEdges: true,

				renderFill: true,
				renderLine: true,

				fillColor: 0x106909,
				fillOpacity: 0.2,
				lineColor: 0x28de19,
				lineOpacity: 1,
				lineThickness: 1,

				staticFillColor: 0x0d177b,
				staticLineColor: 0x1327e4,

				showSleeping: true,
				staticBodySleepOpacity: 1,
				sleepFillColor: 0x464646,
				sleepLineColor: 0x999a99,

				showSensors: true,
				sensorFillColor: 0x0d177b,
				sensorLineColor: 0x1327e4,

				showPositions: true,
				positionSize: 4,
				positionColor: 0xe042da,

				showJoint: true,
				jointColor: 0xe0e042,
				jointLineOpacity: 1,
				jointLineThickness: 2,

				pinSize: 4,
				pinColor: 0x42e0e0,

				springColor: 0xe042e0,

				anchorColor: 0xefefef,
				anchorSize: 4,

				showConvexHulls: true,
				hullColor: 0xd703d0,
			},
		},
	},
};

new Phaser.Game(config);
