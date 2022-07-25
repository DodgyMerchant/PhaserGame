import Player, { PlayerConfig } from "../Objects/WorldObjects/player/Player";
import { STATES } from "../Objects/WorldObjects/MovementObj";
import { COLLCAT } from "../Objects/WorldObjects/PhyObj";
import DebugSceneObj from "../Objects/Systems/DebugSceneObj";
import wallObjInter from "../Objects/WorldObjects/Walls/wallObjInter";
import ACCUMULATOR from "../Objects/Systems/Accumulator";
import GameScenes from "./abstract/GameScenes";

export default class SceneMainGame extends GameScenes {
	/**
	 *
	 * @param {string[]} zones zones to load
	 */
	constructor() {
		super(true, true, true); //debug

		//debug

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

			//values are clamped
			rotSpdMin: 0.2333333333, //0.2333333333 //0.13 | 0.1 * fpsmult
			rotSpdMax: 0.08, //0.07 //0.1166666667 >  > 0.07 | 0.03 * fpsmult
			rotSpdMinRange: 1, //1
			rotSpdMaxRange: 4,

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

		/**
		 * list of all zones
		 * @type {object[]} list of objects
		 */
		this.zoneList;
		/**
		 * list of all loaded zones
		 * @type {string[]} list of cache keys
		 */
		this.zoneLoadedList = [];

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
		super.preload();
	}

	create() {
		super.create();

		//#region accumulator

		ACCUMULATOR.AccumulatorSetup(this, this);

		//#endregion
		//#region level

		this.zoneList = this.cache.json.get("zones");

		//#region get zones to load

		//#endregion

		//#region creating zones

		console.log("SceneMainGame - temp map loading");

		let data = this.game.cache.json.get("Zone_Tutorial");
		console.log("CREATELEVEL - data: ", data);
		this.CreateMapFromData(data.mapData);

		//#endregion

		//#endregion
		//#region aliveGroup

		this.aliveGroup = this.add.group({
			name: "AliveGroup",
			runChildUpdate: true,
		});

		ACCUMULATOR.AccumulatorGroupSetup(this.aliveGroup);

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

		console.log("//////////// SceneMainGame Created Done ////////////");
	}

	update(time, delta) {
		super.update();
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
		/** debug object if created
		 * @type {DebugSceneObj} debugging object
		 */
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

	/**
	 *
	 * @param {object} key
	 */
	CreateMapFromData(mapdata) {
		console.log("mapdata.collisionInstances", mapdata.collisionInstances);

		mapdata.collisionInstances.forEach((element) => {
			this.mapObjVertCreate(element.vert, this.debug_issetup);
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

	/**
	 * checks of position falls into a zone
	 * @param {number} x position in world space
	 * @param {number} y position in world space
	 * @returns {string[]} list with cache strings referring to the zones
	 */
	zoneCheckPos(x, y) {
		let result = [];
		let leng = this.zoneList.length;
		let zoneEntry;
		for (let index = 0; index < leng; index++) {
			//get zone entry from list
			zoneEntry = this.zoneList[index];

			if (Phaser.Geom.Polygon.Contains(zoneEntry.poly, x, y)) {
				result.push(zoneEntry.key);
			}
		}
	}

	//#endregion
}
