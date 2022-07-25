/**
 * abstract class
 * an accumulator manages the a fixedUpdate function which is called based on the set fps.
 * sets up the accumulator inside any object AccumulatorSetup setup is performed on.
 * YOU HAVE TO call the fixedUpdateCall function, in wich the accumulator will call the FROM YOU DEFINED fixedUpdate depending on the fps.
 * See fixedUpdate and fixedUpdateCall methods inside the AccumulatorSetup method for more information.
 */
export default class ACCUMULATOR {
	/**
	 * sets up the accumulator.
	 * Uses the speed set in the Game Configs for FPS.
	 *
	 * @param {object} obj object to set up the accumulator in
	 * @param {Phaser.Scene} scene the scene this object uses
	 */
	static AccumulatorSetup(obj, scene) {
		/**
		 * collects the delta not used millisecond between frames.
		 * @type {number} number
		 */
		obj.accumulator = 0;
		/**
		 * @type {number} number
		 */
		obj.accumulatorTarget = 1000 / scene.game.loop.targetFps;
		/**
		 * if the accumulator is active.
		 * That means it is calling its fixedUpdate one/multiple times.
		 * @type {boolean} number
		 */
		obj.accumulatorActive = false;
		/**
		 * the number of times the accumulator will be active and the fixed update called.
		 * NOTICE left means what is left!! in call this means that is was reduced by one before this call.
		 *
		 * @type {number} number
		 */
		obj.accumulatorExecutesLeft = 0;

		//methods
		/**
		 * calls the fixedUpdate function using the setup accumulator
		 *
		 * @see ACCUMULATOR
		 * @param {number} time time passed since game start in milliseconds
		 * @param {number} delta time passed since last frame in milliseconds
		 */
		obj.fixedUpdateCall = function (time, delta) {
			while (this.accumulatorEval(delta)) {
				this.fixedUpdate(
					time,
					this.accumulatorTarget,
					this.accumulatorExecutesLeft
				);
			}
		};

		/**
		 * update called depending on fps set
		 * this is to overridden by objects that want to use it
		 * its is recommended to user call the function. F.e: super.fixedUpdate(time, delta);
		 *
		 * @see ACCUMULATOR
		 * @param {number} time time passed since game start in milliseconds
		 * @param {number} delta time passed since last frame in milliseconds
		 * @param {number} executesLeft the number of times the accumulator will be active and the fixed update called. NOTICE left means what is left!! in call this means that is was reduced by one before this call.
		 */
		obj.fixedUpdate;
		// obj.fixedUpdate = function (time, delta, executesLeft) {
		//   console.log("ACCUMULATOR - fixedUpdate not overwritten: ", );
		// };

		/**
		 * evaluated how often the accumulator should call the fixedUpdate function.
		 * used internally
		 * @param {number} delta
		 */
		obj.accumulatorEval = function (delta) {
			if (!this.accumulatorActive) {
				//add delta
				this.accumulator += delta;
				//set active
				this.accumulatorActive = true;

				// console.log("accumulator", this.accumulator);

				//calc loop number
				this.accumulatorExecutesLeft = Math.floor(
					this.accumulator / this.accumulatorTarget
				);

				//deduct used frame delta for loops that will happen
				this.accumulator -=
					this.accumulatorTarget * this.accumulatorExecutesLeft;
			}

			if (this.accumulatorExecutesLeft > 0) {
				this.accumulatorExecutesLeft--;
				//loop is running, decrease times to run
			} else {
				//accumulator switch off
				this.accumulatorActive = false;
			}

			return this.accumulatorActive;
		};
	}

	/**
	 *
	 * @param {Phaser.GameObjects.Group} group
	 */
	static AccumulatorGroupSetup(group) {
		if (group.createCallback == undefined) {
			group.createCallback = function (item) {
				console.log("GROUP - add - setup ACCUMULATOR in: ", item.name);
				ACCUMULATOR.AccumulatorSetup(item, item.scene);
			};
		} else {
			console.log(
				"ACCUMULATOR - GROUP SETUP: group '",
				group.name,
				"' has existing callback!!!"
			);
		}
	}
}
