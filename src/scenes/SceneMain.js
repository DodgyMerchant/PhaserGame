import Player, { PlayerConfig } from "../Objects/WorldObjects/player/Player";
import { STATES } from "../Objects/WorldObjects/MovementObj";
import PhyObj, { COLLCAT } from "../Objects/WorldObjects/PhyObj";
import DebugSceneObj from "../Objects/Systems/DebugSceneObj";
import wallObjInter from "../Objects/WorldObjects/Walls/wallObjInter";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super({
			key: "SceneMain",
			visible: true,
			active: true,
		});

		// thisstep;

		//#region setup
		/**
		 * information on the player
		 * @type {PlayerConfig} config object
		 */
		this.playerConfig = {
			name: "PlayerObject",
			x: 50,
			y: 50,
			state: STATES.FREE,
			/** sprite key:  */
			textureBody_Key: "playerImageBody",
			/** determines the players collision caategory */

			connCat: COLLCAT.CONNECTER,
			connWith: COLLCAT.CONNECTABLE,
			phyConfig: {
				label: "PlayerObjectBody",
				collisionFilter: {
					category: COLLCAT.crunch([COLLCAT.PLAYER]),
					mask: COLLCAT.crunch([COLLCAT.MAP, COLLCAT.PLAYER, COLLCAT.GAMEOBJ]),
				},
			},
		};

		/**
		 * block config
		 * @type {Phaser.Types.Physics.Matter.MatterBodyConfig}
		 */
		this.mapCollisionConfig = {
			ignorePointer: false,
			label: "MapCollisionInstance",
			isStatic: true,
			collisionFilter: {
				category: COLLCAT.crunch([COLLCAT.MAP, COLLCAT.CONNECTABLE]),
				mask: COLLCAT.crunch([
					COLLCAT.PLAYER,
					COLLCAT.MAP,
					COLLCAT.GAMEOBJ,
					COLLCAT.CONNECTER,
				]),
			},
		};

		/**
		 * camera optionen
		 * @type {object} config object
		 */
		this.camConfig = {
			/** background color
			 * @type {number}
			 */
			backCol: "0x11041a", //"0x11041a" blackpurple

			//#region movement
			/** A value between 0 and 1. This value specifies the amount of linear interpolation to use when horizontally tracking the target. The closer the value to 1, the faster the camera will track. Default 1.
			 * @type {number}
			 */
			lerpX: 0.1,
			/** A value between 0 and 1. This value specifies the amount of linear interpolation to use when vertically tracking the target. The closer the value to 1, the faster the camera will track. Default 1.
			 * @type {number}
			 */
			lerpX: 0.1,
			/** The horizontal offset from the camera follow target.x position. Default 0.
			 * @type {number}
			 */
			offsetX: 0,
			/** The vertical offset from the camera follow target.y position. Default 0.
			 * @type {number}
			 */
			offsety: 0,

			//#endregion
		};

		/** debug object if created
		 * @type {DebugSceneObj} debugging object
		 */
		this.debug;

		//#endregion
		//#region game objects

		/**
		 * group for all object to be updated
		 * @type {Phaser.GameObjects.Group}
		 */
		this.aliveGroup;

		/**
		 * player object
		 * @type {Player}
		 */
		this.player;

		//#endregion
		//#region loading

		/** loading bar object
		 * @type {Phaser.GameObjects.Graphics} graphics object
		 */
		this.load_bar;

		/**
		 * @type {Phaser.Types.Loader.FileTypes.JSONFileConfig}
		 */
		this.fileConf = {
			key: "tutorialData",
			url: "src/assets/assets.json",
			dataKey: "tutorial",
		};

		/**
		 * @type {Phaser.Types.Loader.FileTypes.JSONFileConfig[]}
		 */
		this.loadList = [this.fileConf];

		//#endregion
		//#region saving

		/**
		 * list of all object to be saved
		 * @type {object[]}
		 */
		this.saveableList = new Array();

		//#endregion
	}

	preload() {
		//#region  debug

		//load abung of stuff
		// for (let index = 0; index < 500; index++) {
		// 	this.load.pack("tutorialData" + index, "src/assets/assets.json", "tutorial");
		// }

		//#endregion

		this.load.pack(this.loadList);

		// this.load.json(this.loadList);

		// for (let index = 0; index < this.loadList.length; index++) {
		// 	const loadConfig = this.loadList[index];

		// 	console.log("LOAD - ", loadConfig);
		// 	this.load.addFile(this.game.cache.json.get(loadConfig.key).files);
		// }

		// this.load.json("level", "src/assets/level.json");

		//create loading bar
		this.loadBarCreate();
	}

	create() {
		//#region accumulator

		this.AccumulatorSetup(this);

		//#endregion

		//#region debug
		// this.input.keyboard.once("keydown-J", this.debug_setup, this);
		this.debug_setup(true, true);

		// console.log("loaded: ");
		// this.cache.json.getKeys().forEach((element) => {
		// 	console.log("--", this.cache.json.get(element));
		// });

		//#endregion

		//#region create level
		let datakey = this.fileConf.dataKey;
		let data = this.game.cache.json.get(this.fileConf.key);

		console.log("CREATELEVEL - data: ", data);

		this.CreateLevel(data.tutorial.mapData);

		//#endregion

		//#region game objects

		this.aliveGroup = this.add.group({
			runChildUpdate: true,
		});

		this.player = this.gameObjectCreatePlayer(this.playerConfig);

		//#endregion

		//#region camera
		/**
		 * main cam
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.mainCam = this.cameras.main;

		this.mainCam.setBackgroundColor(this.camConfig.backCol);

		this.mainCam.startFollow(
			this.player,
			false,
			this.camConfig.lerpX,
			this.camConfig.lerpY,
			this.camConfig.lerpX,
			this.camConfig.lerpY
		);

		//#endregion

		// this.matter.step

		console.log("SceneMain create");
	}

	update(time, delta) {
		console.log("SCENE UPDATE: NOT timed");

		while (this.AccumulatorEval(delta)) {
			console.log("SCENE UPDATE: timed!!!!!!!!!!!");


		}
	}

	//#region accumulator

	/**
	 * sets up the accumulator.
	 * for in the speed set in the Game Configs for FPS
	 * @param {Phaser.Scene} scene
	 */
	AccumulatorSetup(scene) {
		this.accumulator = 0;
		this.accumulatorTarget = 1000 / scene.game.loop.targetFps;
		this.accumulatorActive = false;
	}

	/**
	 * put this in the evaluation of a while loop to update the loop in the speed set in the Game Configs for FPS
	 * @param {number} delta
	 */
	AccumulatorEval(delta) {
		if (!this.accumulatorActive) {
			this.accumulator += delta;
			this.accumulatorActive = true;
		}

		if (this.accumulator >= this.accumulatorTarget) {
			//loop is running, decrease time
			this.accumulator -= this.accumulatorTarget;
		} else {
			//accumulator switch off
			this.accumulatorActive = false;
		}

		return this.accumulatorActive;
	}

	//#endregion
	//#region debug

	/**
	 * create debug obj
	 * @param {boolean} bool if active
	 * @param {boolean} levelEditor if level editor should be created?
	 */
	debug_setup(bool, levelEditor) {
		this.debug = new DebugSceneObj(this, bool, levelEditor);

		console.log("debug setup done");
	}

	//#endregion
	//#region create game objects

	/**
	 * creates the player obj
	 * adds it to update group
	 * @param {config} config
	 * @returns {Player} player object instance
	 */
	gameObjectCreatePlayer(config) {
		let player = this.gameObjectCreateCustom(config, Player, true);

		return player;
	}

	/**
	 * creates a custom object
	 * passes it first this scene,
	 * second the given config object if needed
	 * adds it to update group
	 * @param {object | undefined} config
	 * @param {Phaser.GameObjects.GameObject} GameObj
	 * @param {number | undefined} collCat the collision Category of the object
	 * @param {number | undefined} collWith the collision Category to collide with of the object
	 * @param {boolean | undefined} autoUpdate the collision Category to collide with of the object
	 * @returns {Phaser.GameObjects.GameObject} GameObj instance
	 */
	gameObjectCreateCustom(config, GameObj, autoUpdate) {
		let obj = this.add.existing(new GameObj(this, config));

		if (autoUpdate == true) this.gameObjectAddUpdate(obj);

		return obj;
	}

	/**
	 * updates the object update function automatically
	 * workes through a group
	 * @param {Phaser.GameObjects.GameObject} obj object to be updated
	 */
	gameObjectAddUpdate(obj) {
		this.aliveGroup.add(obj);
	}

	//#endregion
	//#region create map obj

	/**
	 *
	 * @param {Phaser.Math.Vector2[]} vecArr
	 * @param {boolean} interactive if the obj should be interactive
	 * @returns {MatterJS.BodyType}
	 */
	mapObjVertCreate(vecArr, interactive) {
		let center = this.matter.vertices.centre(vecArr);
		let vertObj;

		if (interactive) {
			//set vertecies

			//create copy of config and add vertecies
			// this.mapCollisionConfig.vertices = vecArr;

			/** @type {Phaser.Types.Physics.Matter.MatterBodyConfig} */
			let collconf = Phaser.Utils.Objects.DeepCopy(this.mapCollisionConfig);

			collconf.vertices = vecArr;

			/**
			 * interactive config
			 * @type {Phaser.Types.Input.InputConfiguration}
			 */
			let interactiveConfig = {
				hitArea: new Phaser.Geom.Polygon(vecArr),
				hitAreaCallback: Phaser.Geom.Polygon.Contains,
				pixelPerfect: false,
				draggable: false,
				useHandCursor: true,
			};

			vertObj = new wallObjInter(
				"wall",
				this.matter.world,
				center.x,
				center.y,
				undefined,
				undefined,
				collconf,
				// this.mapCollisionConfig,
				interactiveConfig
			);

			//add as savable
			this.enableSaving(vertObj);

			// vertObj = this.matter.add.image(
			// 	center.x,
			// 	center.y,
			// 	"worldWallSmall",
			// 	undefined,
			// 	this.mapCollisionConfig
			// );
		} else {
			// vertObj = this.matter.add.fromVertices(
			// 	center.x,
			// 	center.y,
			// 	vecArr,
			// 	this.mapCollisionConfig
			// );

			vertObj = this.matter.add.fromVertices(
				center.x,
				center.y,
				vecArr,
				this.mapCollisionConfig
			);
		}

		// console.log("log - vertObj: ", vertObj);
		return vertObj;
	}

	//#endregion
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

	/**
	 *
	 * @param {object} key
	 */
	CreateLevel(mapdata) {
		console.log("mapdata.collisionInstances", mapdata.collisionInstances);

		mapdata.collisionInstances.forEach((element) => {
			this.mapObjVertCreate(element.vert, true);
		});
	}

	/**
	 *
	 * @param {object} obj
	 */
	enableSaving(obj) {
		console.log("SAVE - enableSaving of: ", obj.name);

		this.saveableList.push(obj);
		obj.on("destroy", this.savebleRemove, this);
	}

	savebleRemove(obj) {
		let index = this.saveableList.indexOf(obj);
		if (index > -1) {
			this.saveableList.splice(index, 1);
		}
	}

	//#endregion
}
