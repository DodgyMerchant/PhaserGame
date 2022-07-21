import Phaser from "phaser";
import SceneMain from "./scenes/SceneMain.js";

var view_size = 700;

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
	scene: [SceneMain],
	scale: {
		zoom: 1,
	},
	input: {
		gamepad: true,
	},

  
	fps: {
		min: 10,
		target: 60,

		forceSetTimeOut: false,
	},
	physics: {
		default: "matter",

		matter: {
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
