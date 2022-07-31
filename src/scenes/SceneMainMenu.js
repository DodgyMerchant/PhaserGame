import SceneMainGame from "./SceneMainGame";

export default class SceneMainMenu extends Phaser.Scene {
	constructor() {
		super({
			key: "SceneMainMenu",
			pack: {},
		});

		//#region config

		/**
		 * camera optionen
		 * @type {object} config object
		 */
		this.camConfig = {
			/** background color
			 * @type {number}
			 */
			backCol: "0x11041a", //"0x11041a" blackpurple
		};

		//#endregion

		/** @type {GameScenes} */
		this.gameSceneConstructor = SceneMainGame;
		/** @type {GameScenes} */
		this.gameScene;
		this.gameSceneKey = "GameScene";
	}

	preload() {
		this.load.pack("menuAssets", "src/assets/MainMenuAssets.json");

		this.load.json("zoneData", "src/assets/zoneData.json");
	}

	create() {
		//#region process map data, zones

		this.processZoneData("zoneData");

		//#endregion

		console.log("MENU assest: ", this.cache.json.get("menuAssets"));
		//#region camera
		this.cameras.main.setBackgroundColor(this.camConfig.backCol);

		//#endregion camera

		console.log("//////////// Main Menu Created ////////////");

		//temp
		this.gameStart();
	}

	update(time, delta) {
		console.log("scene main menu update");
	}

	/**
	 *
	 * @param {string[]} zones
	 */
	gameStart(zones) {
		if (this.gameScene == undefined) {
			this.load.pack;

			this.gameScene = new this.gameSceneConstructor(zones);
			this.scene.add(this.gameSceneKey, this.gameScene, false);
		}

		// this.scene.switch(this.gameScene);
		// this.scene.switch(this.gameSceneConstructor);
		// this.scene.switch(this.gameSceneKey);

		this.scene.switch(this.gameScene);

		// this.scene.stop();
	}

	//#region

	/**
	 *
	 * @param {string} key key to acces data in json cache
	 */
	processZoneData(key) {
		//get data
		let data = this.cache.json.get(key);
		//get list of all zones
		let zones = data.zones;

		//add the zones list to cache
		this.cache.json.add("zones", zones);

		//go through list of all zones, get the key from thev enry and enter the raw zone into the json chache
		for (let index = 0; index < zones.length; index++) {
			let zoneEntry = zones[index];
			let zoneKey = zoneEntry.key;
			let zoneData = Phaser.Utils.Objects.GetFastValue(
				data,
				zoneKey,
				undefined
			);

			//create polygon from zone vertecy data
			zoneEntry.poly = new Phaser.Geom.Polygon(zoneEntry.vert);
			//create refeerence to the zone list
			zoneData.index = index;

			this.cache.json.add(zoneKey, zoneData);
		}

		//remove file from cache
		this.cache.json.remove(key);
	}

	//#endregion
}
