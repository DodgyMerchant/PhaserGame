import devPoly from "./devPoly";

export default class devPhyPoly extends devPoly {
	/**
	 *
	 * @param {*} scene
	 * @param {*} x
	 * @param {*} y
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} options
	 *  @param {Phaser.Types.Input.InputConfiguration} interactiveConfig
	 */
	constructor(name, scene, x, y, points) {
		super(name, scene, x, y, points);

    Phaser.Geom.Polygon.


		this.scene.matter.add.gameObject(this, undefined, true);



		// console.log("new wall", this);

		//#endregion

    
	}

  /**
	 *
	 * manually update the objects physics
	 */
	myRefresh() {
    super.myRefresh()
		this.setAwake();
	}

	/**
	 * convert this to a non interactable static physics object
	 */
	convert() {
		this.scene.mapObjCreate_Collision(this.body.vertices, false);
		this.destroy(false);
	}
}
