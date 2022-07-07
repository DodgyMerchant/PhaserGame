import Player from "../Objects/player/Player";
import { STATES } from "../Objects/MovementObj";
import PhyObj from "../Objects/PhyObj";

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
			collCat: COLLBITMASKS.PLAYER,
			collWith: [COLLBITMASKS.MAP, COLLBITMASKS.PLAYER, COLLBITMASKS.GAMEOBJ],
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
		this.load.pack("tutorial", "src/assets/assets.json");

		console.log("SceneMain preload done");
	}

	create() {
		//#region debug
		this.input.keyboard.on("keydown-R", this.debug_resetPlayerPos, this);

		//#endregion

		//#region game objects
		this.aliveGroup = this.add.group({ runChildUpdate: true });
		this.player = this.gameObjectCreatePlayer(this.playerConfig);

		this.player.setCollisionCategory(this.playerConfig.collCat);
		this.player.setCollidesWith(this.playerConfig.collWith);

		this.block1 = this.matter.add.image(100, 200);
		this.block1.setRectangle(100, 100);
		this.block1.setStatic(true);
		this.block1.setCollisionCategory(COLLBITMASKS.MAP);
		this.block1.setCollidesWith([COLLBITMASKS.PLAYER]);

		this.block2 = this.matter.add.image(250, 200);
		this.block2.setRectangle(100, 100);
		this.block2.setStatic(true);
		this.block2.setCollisionCategory(COLLBITMASKS.PLAYER);
		this.block2.setCollidesWith([COLLBITMASKS.PLAYER]);

		this.block3 = this.matter.add.image(400, 200);
		this.block3.setRectangle(100, 100);
		this.block3.setStatic(true);
		this.block3.setCollisionCategory(COLLBITMASKS.GAMEOBJ);
		this.block3.setCollidesWith([COLLBITMASKS.PLAYER]);

		//#endregion

		console.log("SceneMain create");
	}

	update() {}

	//#region debug

	/**
	 * reset player position
	 */
	debug_resetPlayerPos() {
		this.player.setPosition(this.playerConfig.x, this.playerConfig.y);
		this.player.setVelocity(0);
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

		if (
			obj instanceof PhyObj &&
			collCat != undefined &&
			collWith != undefined
		) {
			obj.phyCollSetCat(collCat);
			obj.phyCollSetWith(collWith);
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
export class COLLBITMASKS {
	static MAP = 0b000001;
	static PLAYER = 0b000010;
	static GAMEOBJ = 0b000100;
	static NOTHING = 0b00000000000000000000000000000000;
	static ALL = 0b11111111111111111111111111111111;
}
