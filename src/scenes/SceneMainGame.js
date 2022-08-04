import Player, { PlayerConfig } from "../Objects/WorldObjects/player/Player";
import { STATES } from "../Objects/WorldObjects/MovementObj";
import { COLLCAT } from "../Objects/WorldObjects/PhyObj";
import DebugSceneObj from "../Objects/Systems/DebugSceneObj";
import CollisionInstance from "../Objects/WorldObjects/Dev/CollisionInstance";
import ACCUMULATOR from "../Objects/Systems/Accumulator";
import GameScenes from "./abstract/GameScenes";
import devPoly from "../Objects/WorldObjects/Dev/abstract/devPoly";
import devPhyPoly from "../Objects/WorldObjects/Dev/abstract/devPhyPoly";
import ImageInteractive from "../Objects/WorldObjects/Dev/imageInteractive";

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
			x: 0,
			y: 0,
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
	}

	preload() {
		super.preload();

		//#region zones
		this.zoneList = this.cache.json.get("zones");

		// this.zoneCheckPointConnected(this.playerConfig.x, this.playerConfig.y, 1);

		//temp
		this.zoneLoadedList = [];
		this.zoneLoad([this.cache.json.get("Zone_Tutorial")], false);

    	this.load.audio('audio_ambienceMusic', './src/assets/sound/Atmosphere.mp3');

		//#endregion
	}

	create() {
		super.create();

		//#region accumulator

		ACCUMULATOR.AccumulatorSetup(this, this);

		//#endregion
		//#region creating zones

		console.log("SceneMainGame - temp map loading");

		let data = this.game.cache.json.get("Zone_Tutorial");
		// console.log("CREATELEVEL - data: ", data);
		this.CreateMapFromData(data.mapData);

		//#endregion creating zones
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

		this.music = this.sound.add('audio_ambienceMusic');
    	var musicConfig = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
    	}
		this.music.play(musicConfig);

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
	//#region create map

	/**
	 *
	 * @param {boolean} interactive if the obj should be interactive
	 * @param {Phaser.Math.Vector2[]} vecArr
	 * @returns {MatterJS.BodyType | CollisionInstance}
	 */
	mapObjCreate_Collision(interactive, vecArr) {
		let center = this.matter.vertices.centre(vecArr);
		let vertObj;

		if (interactive) {
			//set vertecies

			//create copy of config and add vertecies
			// this.mapCollisionConfig.vertices = vecArr;

			/** @type {Phaser.Types.Physics.Matter.MatterBodyConfig} */
			let collconf = Phaser.Utils.Objects.DeepCopy(this.mapCollisionConfig);

			let poly = new Phaser.Geom.Polygon(vecArr);
			let boundBox = Phaser.Geom.Polygon.GetAABB(poly, undefined);
			let boundTopLeft = new Phaser.Math.Vector2(boundBox.x, boundBox.y);

			let zeroTopLeftArr = Phaser.Utils.Objects.DeepCopy(vecArr);
			this.matter.vertices.translate(zeroTopLeftArr, boundTopLeft, -1);

			// let zeroCenterArr = Phaser.Utils.Objects.DeepCopy(vecArr);
			// this.matter.vertices.translate(zeroCenterArr, center, -1);

			collconf.vertices = vecArr;
			vertObj = new CollisionInstance(
				"collisionInstance",
				this,
				center.x,
				center.y,
				zeroTopLeftArr,
				collconf
			);

			this.debug.levelEditor.objectSetup(
				vertObj,
				new Phaser.Geom.Polygon(zeroTopLeftArr),
				Phaser.Geom.Polygon.Contains
			);

			// vertObj = new devPoly(
			// 	"collisionInstance",
			// 	this,
			// 	center.x,
			// 	center.y,
			// 	zeroTopLeftArr,
			// 	interactiveConfig
			// );

			// collconf.vertices = vecArr;
			// vertObj = new devPhyPoly(
			// 	"collisionInstance",
			// 	this,
			// 	center.x,
			// 	center.y,
			// 	zeroTopLeftArr,
			// 	collconf,
			// 	interactiveConfig
			// );

			//add as savable

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

	/**
	 * create a new image object. Optianally supply load data as the x argument to use the whole data.
	 * @param {boolean} interactive number or data object
	 * @param {number | obj} x number or data object
	 * @param {number} y
	 * @param {string | Phaser.Textures.Texture} texture
	 * @param {string | number | undefined} frame
	 * @returns {Phaser.GameObjects.Image | ImageInteractive}
	 */
	mapObjCreate_Image(interactive, x, y, texture, frame) {
		let name;
		let imageObj;
		let obj;

		if (typeof x === "object") {
			obj = x;

			x = obj.x;
			y = obj.y;
			texture = obj.texture;
			frame = obj.frame;
			name = obj.name;
		} else {
			name = "image_" + (typeof texture === "string" ? texture : texture.key);
		}

		if (interactive) {
			imageObj = new ImageInteractive(name, this, x, y, texture, frame);

			this.debug.levelEditor.objectSetup(imageObj);
		} else {
			imageObj = new Phaser.GameObjects.Image(this, x, y, texture, frame);
			imageObj.setName(name);
		}

		if (obj != undefined) Phaser.Utils.Objects.Extend(imageObj, obj);

		imageObj.setTexture(imageObj.texture);

		this.add.existing(imageObj);

		return imageObj;
	}

	//#endregion
	//#region loading

	/**
	 *
	 * @param {object} key
	 */
	CreateMapFromData(mapdata) {
		// console.log("mapdata.collisionInstances", mapdata.collisionInstances);
		let list;

		//collision
		list = Phaser.Utils.Objects.GetFastValue(
			mapdata,
			ZONEDATA.type_collisionInstance
		);
		list.forEach((element) => {
			this.mapObjCreate_Collision(this.debug_leveleditor, element.vert);
		});

		//images
		list = Phaser.Utils.Objects.GetFastValue(mapdata, ZONEDATA.type_worldImage);
		list.forEach((element) => {
			this.mapObjCreate_Image(this.debug_leveleditor, element);
		});
	}

	//zones
	/**
	 * checks of position falls into a zone
	 * @param {number} x position in world space
	 * @param {number} y position in world space
	 * @returns {obj[]} zone objects from zone list, should just be one zone, but can go wrong
	 */
	zoneCheckPoint(x, y) {
		let result = [];
		let leng = this.zoneList.length;
		let zoneEntry;
		for (let index = 0; index < leng; index++) {
			//get zone entry from list
			zoneEntry = this.zoneList[index];

			if (Phaser.Geom.Polygon.Contains(zoneEntry.poly, x, y)) {
				result.push(zoneEntry);
			}
		}
		return result;
	}

	/**
	 * checks of position falls into a zone
	 * @param {number} x position in world space
	 * @param {number} y position in world space
	 * @param {number} range number of zone connections to include
	 * @returns {obj[]} list with cache strings referring to the zones
	 */
	zoneCheckPointConnected(x, y, range) {
		let list = this.zoneCheckPoint(x, y);
		let result = list.slice(); //shallow copy

		//go through list of found zones in this spot
		this.zoneGrabConnection(list, range, result);

		return result;
	}

	/**
	 *
	 * @param {obj | obj[]} zones
	 * @param {number} range how maany zones deep the connections should be returned, 0 just this zones connections, 1 all connections of connected zones ...
	 * @param {obj[]} fillList
	 * @returns {object[]}
	 */
	zoneGrabConnection(zones, range, fillList) {
		if (fillList == undefined) fillList = [];
		/** @type {Array} */

		var leng;

		console.log(
			"log - this.cache.json.get(zone.connection[0]): ",
			this.cache.json.get(zone.connection[0])
		);

		//do next step?
		if (range > 0) {
			leng = list.length;
			for (let index = 0; index < leng; index++) {
				this.zoneGrabConnection(list[index], range - 1);
			}
		}
	}

	/**
	 *
	 * @param {obj[]} zoneList
	 * @param {boolean} manual manual start of the loader
	 */
	zoneLoad(zoneList, manual = false) {
		let newCount = 0;

		let newZone;
		for (var i = 0, len = zoneList.length; i < len; i++) {
			newZone = zoneList[i];

			//check for new
			if (this.zoneLoadedList.indexOf(newZone) == -1) {
				newCount++;

				console.log("LOAD ZONE - newZone: ", newZone);

				let file;
				for (let index = 0; index < newZone.files.length; index++) {
					file = newZone.files[index];

					//load respective recource
					// prettier-ignore
					Phaser.Utils.Objects.GetFastValue(this.load, file.type).call(this.load, file);
				}

				//add to list
				this.zoneLoadedList.push(newZone);
			}
		}

		if (manual && newCount > 0) {
			this.load.start();
		}
	}

	//#endregion
}

export class ZONEDATA {
	static DataDefault = {
		index: 0,
		files: [],
		mapData: {
			collisionInstances: [],
			worldImages: [],
		},
	};

	// static DataDefault = {
	// 	collisionInstances: [],
	// 	worldImages: [],
	// };

	static type_collisionInstance = "collisionInstances";
	/**
	 * obj to data
	 * @param {Phaser.GameObjects.Polygon | CollisionInstance} obj
	 * @returns {object}
	 */
	static data_collisionInstance(obj) {
		let data = {
			type: this.type_collisionInstance,
			obj: {
				vert: [],
			},
		};

		let vecArr = obj.body.vertices;
		if (vecArr != undefined) {
			vecArr.forEach((vec) => {
				data.obj.vert.push({
					x: vec.x,
					y: vec.y,
				});
			});
		}

		return data;
	}
	/**
	 * data to obj
	 * @param {Phaser.Scene} scene
	 * @param {object} obj
	 * @returns {MatterJS.BodyType | CollisionInstance}
	 */
	static from_collisionInstance(scene, obj) {
		return scene.mapObjCreate_Collision(scene.debug_issetup, obj.vert);
	}

	static type_worldImage = "worldImages";
	/**
	 * obj to data
	 * @param {Phaser.GameObjects.Image} imageObj
	 * @returns {object}
	 */
	static data_worldImage(imageObj) {
		let data = {
			type: this.type_worldImage,
			obj: {
				name: imageObj.name,

				x: imageObj.x,
				y: imageObj.y,

				scaleX: imageObj.scaleX,
				scaleY: imageObj.scaleY,

				depth: imageObj.depth,
				alpha: imageObj.alpha,

				rotation: imageObj.rotation,

				originX: imageObj.originX,
				originY: imageObj.originY,

				scrollFactorX: imageObj.scrollFactorX,
				scrollFactorY: imageObj.scrollFactorY,

				visible: imageObj.visible,

				texture: imageObj.texture.key,

				// blendMode: imageObj.blendMode,
				// tint: imageObj.tintTopLeft,
				// frame: imageObj.frame,
			},
		};

		return data;
	}
}
