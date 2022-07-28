import { Tilemaps } from "phaser";
import worldObjSprite from "./abstract/worldObjSprite";

/**
 * phy object with premade methods
 */
export default class PhyObj extends worldObjSprite {
	/**
	 * physics activated object
	 *
	 * @param {Phaser.Scene} scene the object is in
	 * @param {number} x position
	 * @param {number} y position
	 * @param {string | Phaser.Textures.Texture} texture texture to display as the object texture
	 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig | undefined} phyConfig config obj
	 */
	constructor(scene, x, y, texture, phyConfig) {
		super(scene.matter.world, x, y, texture, undefined, phyConfig);

		//#region collision

		// /**
		//  * byte corresponding to the collision Category of the object
		//  * the value on creation
		//  * @type {CollisionCategory} 32bit int number
		//  */
		// this.phyCollCatCreate = collCat;
		// /**
		//  * byte corresponding to collision Categoryies to be collided with
		//  * the value on creation
		//  * @type {CollisionCategory} 32bit int number
		//  */
		// this.phyCollWithCreate = collWith;
		// /**
		//  * byte corresponding to the collision Category of the object
		//  * @type {CollisionCategory} 32bit int number
		//  */
		// this.phyCollCat = collCat;
		// /**
		//  * byte corresponding to collision Categoryies to be collided with
		//  * @type {CollisionCategory} 32bit int number
		//  */
		// this.phyCollWith = collWith;

		//for some fucking reason setting this now does nothing
		// this.phySetCollCat(collCat);
		// this.phySetCollWith(collWith);

		//#endregion
	}

	preUpdate(time, delta) {
		super.preUpdate(time, delta);
	}

	update(time, delta) {
		super.update(time, delta);
		//my stuff
		// console.log("PHYOBJ - update");
	}

	fixedUpdate(time, delta, executesLeft, looseDelta) {
		super.fixedUpdate(time, delta);
		//stuff to perform based on fps -->
		// console.log("PHYOBJ - update fixed");
	}

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

	//#region cat

	phyCollGetCat() {
		// return this.phyCollCat;
		return this.body.collisionFilter.category;
	}

	/**
	 * sets the collision Category mask
	 * @param {number | number[]} collCat byte corresponding to the collision Category of the object
	 */
	phyCollSetCat(collCat) {
		this.setCollisionCategory(collCat);

		// this.phyCollCat = COLLCAT.crunch(collCat);
	}

	/**
	 * removes collision categorie(s) from this objects collision categories
	 * @param {number} collToRemove one or more collision categories to remove | 32bit number
	 */
	phyCollRemoveCat(collToRemove) {
		this.phyCollSetCat(COLLCAT.RemoveFrom(this.phyCollGetCat(), collToRemove));
	}

	/**
	 * adds the collision categorie(s) to this objects collision categories
	 * @param {number} collToAdd one or more collision categories to remove | 32bit number
	 */
	phyCollAddCat(collToAdd) {
		this.phyCollSetCat(COLLCAT.AddTo(this.phyCollGetCat(), collToAdd));
	}

	//#endregion
	//#region with

	phyCollGetWith() {
		// return this.phyCollWith;
		return this.body.collisionFilter.mask;
	}

	/**
	 * sets with what to collide
	 * @param {number | number[]} collWith byte or list of bytes corresponding to collision Categoryies to be collided with
	 */
	phyCollSetWith(collWith) {
		this.setCollidesWith(collWith);

		//if array crunch
		// this.phyCollWith = COLLCAT.crunch(collWith);
	}

	/**
	 * removes collision categorie(s) from this objects collision categories to collide with
	 * @param {number} collToRemove one or more collision categories to remove | 32bit number
	 */
	phyCollRemoveWith(collToRemove) {
		this.phyCollSetWith(
			COLLCAT.RemoveFrom(this.phyCollGetWith(), collToRemove)
		);
	}

	/**
	 * adds the collision categorie(s) to this objects collision categories to collide with
	 * @param {number} collToAdd one or more collision categories to remove | 32bit number
	 */
	phyCollAddWith(collToAdd) {
		this.phyCollSetWith(COLLCAT.AddTo(this.phyCollGetWith(), collToAdd));
	}

	//#endregion

	//#endregion
}

/**
 * collision bit masks.
 * maximum of 32-bit integer.
 * @typedef {number} CollisionCategory
 */

/**
 * enum-like for collision bit masks
 * maximum of 32-bit integer
 * object holding collision categories
 * and methods for them
 *
 * @type {object}
 */
export class COLLCAT {
	/* 
  the collision categories are 32bit integer values
  each category should have a "1" in a unique position for a simple collision system.

  changing these values as soon as the first level daata gest saved will be messy

  if you understand how the bitwise mask works you can get fancy by including other categories bits in categories copying their collision configurations essentially
  but this could go out of controll eaasily
  */

	//#region internal

	//#region other
	/**
	 * collision category array
	 * holds all categories
	 */
	static CATARR = new Array();

	static catAdd(number) {
		COLLCAT.CATARR.push(number);
		return number;
	}

	//#endregion

	// prettier-ignore
	/**
	 * map
	 * @type {CollisionCategory}
	 * */
	static MAP =          COLLCAT.catAdd(0b000001);
	// prettier-ignore
	/**
	 * player
	 * @type {CollisionCategory}
	 * */
	static PLAYER =       COLLCAT.catAdd(0b000010);
	// prettier-ignore
	/**
	 * gameobj
	 * @type {CollisionCategory}
	 * */
	static GAMEOBJ =      COLLCAT.catAdd(0b000100);
	// prettier-ignore
	/**
	 * connector for footholds
	 * @type {CollisionCategory}
	 * */
	static CONNECTER =    COLLCAT.catAdd(0b001000);
	// prettier-ignore
	/**
	 * connectable, a foothold
	 * @type {CollisionCategory}
	 * */
	static CONNECTABLE =  COLLCAT.catAdd(0b010000);
	// prettier-ignore
	/**
	 * nothing collides
	 * @type {CollisionCategory}
	 * */
	static NOTHING =      COLLCAT.catAdd(0b00000000000000000000000000000000);
	// prettier-ignore
	/**
	 * all collides
	 * @type {CollisionCategory}
	 * */
	static ALL =          COLLCAT.catAdd(0b11111111111111111111111111111111);

	/**
	 * compiles array with collision 32bit categories into one 32bit number
	 * mostly used if an array with categories isnt usable
	 * @param {CollisionCategory | CollisionCategory[]} collArr byte or list of bytes corresponding to collision Categoryies to be collided with
	 * @returns {CollisionCategory} 32bit number
	 */
	static crunch(collArr) {
		/** 32bit int */
		let coll = 0b00000000000000000000000000000000;

		if (!Array.isArray(collArr)) {
			return collArr;
		} else if (collArr.length == 1) {
			return collArr[0];
		} else {
			//go through all the coll maks bytes and perform pitwise OR on all of them
			collArr.forEach((element) => {
				coll |= element;
			});
			return coll;
		}
	}

	/**
	 * removes collision categorie(s) from given collision categorie(s) to edit
	 * @param {CollisionCategory} collToEdit collision category to edit | 32bit number
	 * @param {CollisionCategory} collToRemove one or more collision categories to remove | 32bit number
	 * @returns {CollisionCategory} the edited collision categorie | 32bit number
	 */
	static RemoveFrom(collToEdit, collToRemove) {
		return collToEdit ^ collToRemove;
	}

	/**
	 * adds collision categorie(s) to given collision categorie(s) to edit
	 * @param {CollisionCategory} collToEdit collision category to edit | 32bit number
	 * @param {CollisionCategory} collToAdd one or more collision categories to add | 32bit number
	 * @returns {CollisionCategory} the edited collision categorie | 32bit number
	 */
	static AddTo(collToEdit, collToAdd) {
		return collToEdit | collToAdd;
	}
}
