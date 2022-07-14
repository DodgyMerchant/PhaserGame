import Player from "../Objects/WorldObjects/player/Player";
import { STATES } from "../Objects/WorldObjects/MovementObj";
import PhyObj, { COLLCAT } from "../Objects/WorldObjects/PhyObj";
import DebugSceneObj from "../Objects/Systems/DebugSceneObj";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super({
			key: "SceneMain",
			visible: true,
			active: true,
		});

		//#region setup
		/**
		 * information on the player
		 * @type {object} config object
		 */
		this.playerConfig = {
			x: 50,
			y: 50,
			state: STATES.FREE,
			/** sprite key:  */
			textureBody_Key: "playerImageBody",
			/** determines the players collision caategory */
			collCat: COLLCAT.PLAYER,
			collWith: [COLLCAT.MAP, COLLCAT.PLAYER, COLLCAT.GAMEOBJ],
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

		//#endregion
	}

	preload() {
		//#region  debug

		//load abung of stuff
		// for (let index = 0; index < 500; index++) {
		// 	this.load.pack("tutData" + index, "src/assets/assets.json", "tutorial");
		// }

		//#endregion

		this.load.pack("tutData", "src/assets/assets.json", "tutorial");

		//create loading bar
		this.loadBarCreate();
	}

	create() {
		//#region debug setup
		//disaable debug drawing

		//#region debug
		// this.input.keyboard.once("keydown-J", this.debug_setup, this);
		this.debug_setup(true, true);

		// console.log("loaded: ");
		// this.cache.json.getKeys().forEach((element) => {
		// 	console.log("--", this.cache.json.get(element));
		// });

		//#endregion

		//#region game objects

		this.aliveGroup = this.add.group({ runChildUpdate: true });
		this.player = this.gameObjectCreatePlayer(this.playerConfig);

		this.player.setCollisionCategory(this.playerConfig.collCat);
		this.player.setCollidesWith(this.playerConfig.collWith);

		//creating physics shape from vertecies from string

		//AYOOEST

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

		console.log("SceneMain create");
	}

	update() {}

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
		return this.gameObjectCreateCustom(
			config,
			Player,
			config.collCat,
			config.collWith,
			true
		);
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
	gameObjectCreateCustom(config, GameObj, collCat, collWith, autoUpdate) {
		let obj = this.add.existing(new GameObj(this, config));

		if (collCat != undefined && collWith != undefined) {
			if (obj instanceof PhyObj) {
				obj.phyCollSetCat(collCat);
				obj.phyCollSetWith(collWith);
			} else {
				obj.setCollisionCategory(collCat);
				obj.setCollidesWith(collWith);
			}
		}

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
		/**
		 * block config
		 * @type {Phaser.Types.Physics.Matter.MatterBodyConfig}
		 */
		let bodyConfig = {
			vertices: vecArr,
			ignorePointer: false,
			label: "MapCollisionBlock",
			isStatic: true,
			collisionFilter: {
				category: COLLCAT.MAP,
				mask: COLLCAT.compile([COLLCAT.PLAYER, COLLCAT.MAP, COLLCAT.GAMEOBJ]),
			},
		};

		/**
		 * @type {Phaser.Types.Input.InputConfiguration}
		 */
		let interactiveConfig = {
			hitArea: new Phaser.Geom.Polygon(vecArr),
			hitAreaCallback: Phaser.Geom.Polygon.Contains,
			pixelPerfect: false,
			draggable: false,
			useHandCursor: true,
		};

		let center = this.matter.vertices.centre(vecArr);

		let vertObj = this.matter.add.image(
			center.x,
			center.y,
			undefined,
			undefined,
			bodyConfig
		);

		if (interactive) {
			let zeroArr = vecArr.slice();

			this.matter.vertices.translate(zeroArr, vertObj.getTopLeft().negate(), 1);

			console.log("log - vertObj.getTopLeft(): ", vertObj.getTopLeft());

			interactiveConfig.hitArea.setTo(zeroArr);

			//make interactive
			vertObj.setInteractive(interactiveConfig);

			this.input.enableDebug(
				vertObj,
				Phaser.Display.Color.GetColor(255, 0, 255)
			);
		}

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

	//#endregion
}

/**
 * enum-like for collision bit masks
 * maximum of 32-bit integer
 */
