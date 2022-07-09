import Player from "../Objects/WorldObjects/player/Player";
import { STATES } from "../Objects/WorldObjects/MovementObj";
import PhyObj, { COLLCAT } from "../Objects/WorldObjects/PhyObj";
import DebugSceneObj from "../Objects/Systems/DebugSceneObj";

export default class SceneMain extends Phaser.Scene {
	constructor() {
		super("SceneMain");

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

		/** debug object if created
		 * @type {DebugSceneObj} debugging object
		 */
		this.debug;

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
		this.load.pack("tutData", "src/assets/assets.json", "tutorial");

		//create loading bar
		this.loadBarCreate();
	}

	create() {
		//#region debug setup
		//disaable debug drawing
		this.matter.world.drawDebug = false;

		//#region debug
		// this.input.keyboard.once("keydown-J", this.debug_setup, this);
		this.debug_setup();

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

		let vert = "0 0,100 0,100 100,0 100";

		let vecArr = new Array();

		vert = vert.split(",");
		vert = vert.forEach((string) => {
			let arr = string.split(" ");
			vecArr.push(
				new Phaser.Math.Vector2(
					Number.parseFloat(arr[0]),
					Number.parseFloat(arr[1])
				)
			);
		});

		/**
		 * block config
		 * @type {Phaser.Types.Physics.Matter.MatterBodyConfig}
		 */
		let blockConf = {
			label: "block",
			vertices: vecArr,
			isStatic: true,
			collisionFilter: {
				category: COLLCAT.MAP,
				mask: COLLCAT.compile([COLLCAT.PLAYER, COLLCAT.MAP, COLLCAT.GAMEOBJ]),
			},
		};

		this.block1 = this.matter.add.image(
			100,
			200,
			"worldWallSmall",
			undefined,
			blockConf
		);

		this.block2 = this.matter.add.image(
			220,
			200,
			"worldWallSmall",
			undefined,
			blockConf
		);

		this.block3 = this.matter.add.image(
			370,
			200,
			"worldWallSmall",
			undefined,
			blockConf
		);

		//AYOOEST

		//#endregion

		console.log("SceneMain create");
	}

	update() {}

	//#region debug

	debug_setup() {
		this.debug = new DebugSceneObj(this);
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
			config.collWith
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
	 * @returns {Phaser.GameObjects.GameObject} GameObj instance
	 */
	gameObjectCreateCustom(config, GameObj, collCat, collWith) {
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

		this.gameObjectAddUpdate(obj);

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
	//#region loading

	loadBarCreate() {
		this.load_bar = this.add.graphics({
			fillStyle: {
				alpha: 1,
				color: 0xffffff,
			},
		});

		this.load.on("progress", (percent) => {
			//draw loaading bar
			this.load_bar.fillRect(
				0,
				this.game.renderer.height / 2,
				this.game.renderer.width * percent,
				50
			);

			console.log("loading%: ", percent);
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
