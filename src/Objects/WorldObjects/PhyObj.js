/**
 * phy object with premade methods
 */
export default class PhyObj extends Phaser.Physics.Matter.Sprite {
	/**
	 * physics activated object
	 *
	 * @param {Phaser.Scene} scene the object is in
	 * @param {number} x position
	 * @param {number} y position
	 * @param {string | Phaser.Textures.Texture} texture texture to display as the object texture
	 * @param {number} collCat byte corresponding to the collision Category of the object
	 * @param {number | number[]} collWith byte or list of bytes corresponding to collision Categoryies to be collided with
	 */
	constructor(scene, x, y, texture, collCat, collWith) {
		super(scene.matter.world, x, y, texture);

		this.setActive(true);
		this.setVisible(true);

		this.scene.add.existing(this);

		//#region collision
		/**
		 * byte corresponding to the collision Category of the object
		 * the value on creation
		 * @type {number} 32bit int number
		 */
		this.phyCollCatCreate = collCat;
		/**
		 * byte corresponding to collision Categoryies to be collided with
		 * the value on creation
		 * @type {number} 32bit int number
		 */
		this.phyCollWithCreate = collWith;
		/**
		 * byte corresponding to the collision Category of the object
		 * @type {number} 32bit int number
		 */
		this.phyCollCat = collCat;
		/**
		 * byte corresponding to collision Categoryies to be collided with
		 * @type {number} 32bit int number
		 */
		this.phyCollWith = collWith;

		//for some fucking reason setting this now does nothing
		// this.phySetCollCat(collCat);
		// this.phySetCollWith(collWith);

		//#endregion
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
	//#region collision

	/**
	 * sets the collision Category mask
	 * @param {number} collCat byte corresponding to the collision Category of the object
	 */
	phyCollSetCat(collCat) {
		this.setCollisionCategory(collCat);

		this.phyCollCat = collCat;
	}

	/**
	 * removes collision categorie(s) from this objects collision categories
	 * @param {number} collToRemove one or more collision categories to remove | 32bit number
	 */
	phyCollRemoveCat(collToRemove) {
		this.phyCollSetCat(COLLCAT.RemoveFrom(this.phyCollCat, collToRemove));
	}

	/**
	 * adds the collision categorie(s) to this objects collision categories
	 * @param {number} collToAdd one or more collision categories to remove | 32bit number
	 */
	phyCollAddCat(collToAdd) {
		this.phyCollSetCat(COLLCAT.AddTo(this.phyCollCat, collToAdd));
	}

	/**
	 * sets with what to collide
	 * @param {number | number[]} collWith byte or list of bytes corresponding to collision Categoryies to be collided with
	 */
	phyCollSetWith(collWith) {
		this.setCollidesWith(collWith);

		//if array compile
		this.phyCollWith = COLLCAT.compile(collWith);
	}

	/**
	 * removes collision categorie(s) from this objects collision categories to collide with
	 * @param {number} collToRemove one or more collision categories to remove | 32bit number
	 */
	phyCollRemoveWith(collToRemove) {
		this.phyCollSetWith(COLLCAT.RemoveFrom(this.phyCollWith, collToRemove));
	}

	/**
	 * adds the collision categorie(s) to this objects collision categories to collide with
	 * @param {number} collToAdd one or more collision categories to remove | 32bit number
	 */
	phyCollAddWith(collToAdd) {
		this.phyCollSetWith(COLLCAT.AddTo(this.phyCollWith, collToAdd));
	}

	//#endregion
}


/**
 * enum-like for collision bit masks
 * maximum of 32-bit integer
 * object holding collision categories
 * and methods for them
 */
export class COLLCAT {
	/* 
  the collision categories are 32bit integer values
  each category should have a "1" in a unique position for a simple collision system.

  changing these values as soon as the first level daata gest saved will be messy

  if you understand how the bitwise mask works you can get fancy by including other categories bits in categories copying their collision configurations essentially
  but this could go out of controll eaasily
  */

	static MAP = 0b000001;
	static PLAYER = 0b000010;
	static GAMEOBJ = 0b000100;
	static NOTHING = 0b00000000000000000000000000000000;
	static ALL = 0b11111111111111111111111111111111;

	/**
	 * compiles array with collision 32bit categories into one 32bit number
	 * mostly used if an array with categories isnt usable
	 * @param {number | number[]} collArr byte or list of bytes corresponding to collision Categoryies to be collided with
	 * @returns {number} 32bit number
	 */
	static compile(collArr) {
		/** 32bit int */
		let coll = 0b00000000000000000000000000000000;

		if (Array.isArray(collArr)) {
			//go through all the coll maks bytes and perform pitwise OR on all of them
			collArr.forEach((element) => {
				coll |= element;
			});
			return coll;
		} else {
			return collArr;
		}
	}

	/**
	 * removes collision categorie(s) from given collision categorie(s) to edit
	 * @param {number} collToEdit collision category to edit | 32bit number
	 * @param {number} collToRemove one or more collision categories to remove | 32bit number
	 * @returns {number} the edited collision categorie | 32bit number
	 */
	static RemoveFrom(collToEdit, collToRemove) {
		return collToEdit ^ collToRemove;
	}

	/**
	 * adds collision categorie(s) to given collision categorie(s) to edit
	 * @param {number} collToEdit collision category to edit | 32bit number
	 * @param {number} collToAdd one or more collision categories to add | 32bit number
	 * @returns {number} the edited collision categorie | 32bit number
	 */
	static AddTo(collToEdit, collToAdd) {
		return collToEdit | collToAdd;
	}
}
