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

		/*
    this.setFriction(0.1);
		this.setFrictionStatic(0.1);
		this.setDensity(1);

		super.move_ConnAirFric = 0.039 * fpsmult;
		super.move_Speed = 0.5 * fpsmult;
		super.connSpdJump = 5;
		super.move_RotSpeed = 0;

		super.connRange = 100;
    */

		let jump_speed = 5;

		/*
    4 | 0.1 > 5.1 - 5.3
    
    */

		let speed = 4; // 1.166666667
		let connected_air_Fric = 0.1; //  // 0.1 | 1.5 // 0.01671428571 | 9.2 //

		/**
		 * information on the player
		 * @type {PlayerConfig} config object
		 */
		this.playerConfig = {
			name: "PlayerObject",
			x: 50,
			y: 50,
			/** sprite key:  */
			textureBody_Key: "playerImageBody",

			//debug values if 1
			rotSpdMin: 1, //0.2333333333 //0.13 | 0.1 * fpsmult
			rotSpdMax: 1, //0.07 //0.1166666667 >  > 0.07 | 0.03 * fpsmult
			rotSpdMinRange: 1, //1
			rotSpdMaxRange: 2.5,

			connConf: {
				range: 100,
				jumpSpeed: jump_speed,
				connAirFric: connected_air_Fric,
				connCat: COLLCAT.CONNECTER,
				connWith: COLLCAT.CONNECTABLE,
				jumpMeth: undefined,
			},
			moveConf: {
				speed: speed,
				rotSpeed: 0, //system in player sets it
				state: STATES.FREE,
				moveMeth: undefined,
				rotMeth: undefined,
			},
			phyConfig: {
				label: "PlayerObjectBody",
				vertices: new Phaser.Geom.Circle(0, 0, 20).getPoints(
					15,
					undefined,
					undefined
				),
				friction: 0.1, //0.04285714286
				frictionAir: 1, //DO NOT SET, OVERWRITTEN BY connConf.connAirFric
				frictionStatic: 0.04285714286, //0.04285714286
				density: 2.7 * 0.7, //density of aluminium * approx how much of it is actually mass

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
		 * auto initializes the cummulator in all its children
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

		ACCUMULATOR.AccumulatorSetup(this, this);

		//#endregion
		//#region debug enabling

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
		//#region aliveGroup

		this.aliveGroup = this.add.group({
			name: "AliveGroup",
			runChildUpdate: true,
			createCallback: function (item) {
				console.log("SCENE - MAIN - alivegroup item create: ", item.name);

				ACCUMULATOR.AccumulatorSetup(item, item.scene);
			},
		});

		//#endregion
		//#region game objects

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

		console.log("//////////// SceneMain Created Done ////////////");
	}

	update(time, delta) {
		// console.log("SCENE - MAIN - update");

		this.fixedUpdateCall(time, delta);
	}

	fixedUpdate(time, delta, executesLeft, looseDelta) {
		// console.log("SCENE - MAIN - fixed update");

		if (this.matter.world.enabled)
			if (!this.matter.world.autoUpdate) {
				// console.log("SCENE - MAIN - maual phy step");
				this.matter.step(delta);
			}
	}

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

		console.log(
			"PLAYER CREATED: ",
			"friction",
			player.body.friction,
			"frictionAir",
			player.body.frictionAir,
			"frictionStatic",
			player.body.frictionStatic
		);

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

/**
 * abstract class
 * an accumulator manages the a fixedUpdate function which is called based on the set fps.
 * sets up the accumulator inside any object AccumulatorSetup setup is performed on.
 * YOU HAVE TO call the fixedUpdateCall function, in wich the accumulator will call the FROM YOU DEFINED fixedUpdate depending on the fps.
 * See fixedUpdate and fixedUpdateCall methods inside the AccumulatorSetup method for more information.
 */
export class ACCUMULATOR {
	/**
	 * sets up the accumulator.
	 * Uses the speed set in the Game Configs for FPS.
	 *
	 * @param {object} obj object to set up the accumulator in
	 * @param {Phaser.Scene} scene the scene this object uses
	 */
	static AccumulatorSetup(obj, scene) {
		/**
		 * collects the delta not used millisecond between frames.
		 * @type {number} number
		 */
		obj.accumulator = 0;
		/**
		 * @type {number} number
		 */
		obj.accumulatorTarget = 1000 / scene.game.loop.targetFps;
		/**
		 * if the accumulator is active.
		 * That means it is calling its fixedUpdate one/multiple times.
		 * @type {boolean} number
		 */
		obj.accumulatorActive = false;
		/**
		 * the number of times the accumulator will be active and the fixed update called.
		 * NOTICE left means what is left!! in call this means that is was reduced by one before this call.
		 *
		 * @type {number} number
		 */
		obj.accumulatorExecutesLeft = 0;

		//methods
		/**
		 * calls the fixedUpdate function using the setup accumulator
		 *
		 * @see ACCUMULATOR
		 * @param {number} time time passed since game start in milliseconds
		 * @param {number} delta time passed since last frame in milliseconds
		 */
		obj.fixedUpdateCall = function (time, delta) {
			while (this.accumulatorEval(delta)) {
				this.fixedUpdate(
					time,
					this.accumulatorTarget,
					this.accumulatorExecutesLeft
				);
			}
		};

		/**
		 * update called depending on fps set
		 * this is to overridden by objects that want to use it
		 * its is recommended to user call the function. F.e: super.fixedUpdate(time, delta);
		 *
		 * @see ACCUMULATOR
		 * @param {number} time time passed since game start in milliseconds
		 * @param {number} delta time passed since last frame in milliseconds
		 * @param {number} executesLeft the number of times the accumulator will be active and the fixed update called. NOTICE left means what is left!! in call this means that is was reduced by one before this call.
		 */
		obj.fixedUpdate;
		// obj.fixedUpdate = function (time, delta, executesLeft) {
		//   console.log("ACCUMULATOR - fixedUpdate not overwritten: ", );
		// };

		/**
		 * evaluated how often the accumulator should call the fixedUpdate function.
		 * used internally
		 * @param {number} delta
		 */
		obj.accumulatorEval = function (delta) {
			if (!this.accumulatorActive) {
				//add delta
				this.accumulator += delta;
				//set active
				this.accumulatorActive = true;

				// console.log("accumulator", this.accumulator);

				//calc loop number
				this.accumulatorExecutesLeft = Math.floor(
					this.accumulator / this.accumulatorTarget
				);

				//deduct used frame delta for loops that will happen
				this.accumulator -=
					this.accumulatorTarget * this.accumulatorExecutesLeft;
			}

			if (this.accumulatorExecutesLeft > 0) {
				this.accumulatorExecutesLeft--;
				//loop is running, decrease times to run
			} else {
				//accumulator switch off
				this.accumulatorActive = false;
			}

			return this.accumulatorActive;
		};
	}
}
