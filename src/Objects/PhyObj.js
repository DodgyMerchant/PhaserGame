export default class PhyObj extends Phaser.Physics.Matter.Sprite {
	constructor(scene, x, y, image) {
		super(scene.matter.world, x, y, image);

		this.setActive(true);
		this.setVisible(true);

		this.scene.add.existing(this);
	}

	preUpdate(delta, time) {
		super.preUpdate(delta, time);
	}

	update(delta, time) {}

	//#region phys

	/**
	 * sets the player movement
	 * wakes the physics body up
	 * @param {number} x movement on the x axis
	 * @param {number} y movement on the y axis
	 */
	phyMoveSet(x, y) {
		this.setVelocity(x, y);
		this.setAwake();
	}

	/**
	 * adds to the player movement
	 * wakes the physics body up
	 * @param {Phaser.Math.Vector2} vec2 vector 2D with movement x y
	 */
	phyMoveAdd(vec2) {
		this.applyForce(vec2);
	}

	/**
	 * if the player is moving
	 * @returns {boolean} if player is moving
	 */
	phyIsMoving() {
		return this.body.velocity.x != 0 || this.body.velocity.y != 0;
	}

	//#endregion
}
