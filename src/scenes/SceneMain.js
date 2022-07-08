import Player from "../Objects/player/Player";
import { STATES } from "../Objects/MovementObj";
import PhyObj, { COLLCAT } from "../Objects/PhyObj";

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
	}

	preload() {
		this.load.pack("tutData", "src/assets/assets.json", "tutorial");

		console.log("SceneMain preload done");
	}

	create() {
		//#region debug
		this.input.keyboard.on("keydown-R", this.debug_reset, this);

		console.log("loaded: ");
		this.cache.json.getKeys().forEach((element) => {
			console.log("--", this.cache.json.get(element));
		});
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

		console.log("vecArr: ", vecArr);
		this.block1 = this.matter.add.image(100, 200, undefined, undefined, {
			vertices: vecArr,
			isStatic: true,
			collisionFilter: {
				category: COLLCAT.MAP,
				mask: COLLCAT.compile([COLLCAT.PLAYER, COLLCAT.MAP, COLLCAT.GAMEOBJ]),
			},
		});

		console.log("log - this.block1.body.vertices: ", this.block1.body.vertices);

		this.block2 = this.matter.add.image(250, 200);
		this.block2.setRectangle(100, 100);
		this.block2.setStatic(true);
		this.block2.setCollisionCategory(COLLCAT.MAP);
		this.block2.setCollidesWith([COLLCAT.ALL]);

		this.block3 = this.matter.add.image(400, 200);
		this.block3.setRectangle(100, 100);
		this.block3.setStatic(true);
		this.block3.setCollisionCategory(COLLCAT.MAP);
		this.block3.setCollidesWith([COLLCAT.PLAYER]);

		//#endregion

		console.log("SceneMain create");
	}

	update() {}

	//#region debug

	/**
	 * reset player position
	 */
	debug_reset() {
		this.scene.restart();
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
}

/**
 * enum-like for collision bit masks
 * maximum of 32-bit integer
 */
