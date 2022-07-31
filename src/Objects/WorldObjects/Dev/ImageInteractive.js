export default class ImageInteractive extends Phaser.GameObjects.Image {
	/**
	 *
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {string | Phaser.Textures.Texture} texture
	 * @param {string | number | undefined} frame
	 */
	constructor(name, scene, x, y, texture, frame) {
		super(scene, x, y, texture, frame);

		this.setName(name);

    this.display
	}
}
