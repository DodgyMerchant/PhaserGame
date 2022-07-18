import UIObj from "./UIObj";
/** UI element to be chained for UI construction */
export default class UIElement extends UIObj {
	/**
	 * UI object made for chaining
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number | undefined} x The horizontal position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {number | undefined} y The vertical position of this Game Object in the world. Default 0. This has the highest priority.
	 * @param {UIConfig | undefined} UiConfig Config object for UI classes
	 * @param {boolean | undefined} cascadeEnable The vertical position of this Game Object in the world. Default 0.
	 * @param {boolean | undefined} cascadeDisable The vertical position of this Game Object in the world. Default 0.
	 * @param {Phaser.GameObjects.GameObject[] | undefined} children An optional array of Game Objects to add to this Container.
	 */
	constructor(
		name,
		scene,
		depth,
		x,
		y,
		UiConfig,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		super(
			name,
			scene,
			depth,
			x == undefined
				? (
						UiConfig.margin == undefined
							? true
							: UiConfig.margin.marginLeft == undefined
				  )
					? 0
					: UiConfig.margin.marginLeft
				: x instanceof UIElement
				? x.UIE_getFurthestX()
				: x,
			y == undefined
				? (
						UiConfig.margin == undefined
							? true
							: UiConfig.margin.marginTop == undefined
				  )
					? 0
					: UiConfig.margin.marginTop
				: y instanceof UIElement
				? y.UIE_getFurthestY()
				: y,
			cascadeEnable,
			cascadeDisable,
			children
		);

		this.width =
			UiConfig.width == undefined || UiConfig.width <= 1 
        ? 0 
        : UiConfig.width;
		this.height =
			UiConfig.height == undefined || UiConfig.height <= 1
				? 0
				: UiConfig.height;

		/**
		 * original set width
		 * @type {number | undefined} undefiend if obj should try to be ad large as possible
		 */
		this.originalW = UiConfig.width;
		/**
		 * original set height
		 * @type {number | undefined} undefiend if obj should try to be ad large as possible
		 */
		this.originalH = UiConfig.height;

		//#region margin

		/** the outer specing to the parent
		 * outer top of the container
		 * @type {number} */
		this.marginTop =
			UiConfig.margin != undefined && UiConfig.margin.marginTop != undefined
				? UiConfig.margin.marginTop
				: 0;
		/** the outer specing to the parent
		 * outer top of the container
		 * @type {number}
		 */
		this.marginBottom =
			UiConfig.margin != undefined && UiConfig.margin.marginBottom != undefined
				? UiConfig.margin.marginBottom
				: 0;
		/** the outer specing to the parent
		 * outer top of the container
		 * @type {number} */
		this.marginLeft =
			UiConfig.margin != undefined && UiConfig.margin.marginLeft != undefined
				? UiConfig.margin.marginLeft
				: 0;
		/** the outer specing to the parent
		 * outer top of the container
		 * @type {number} */
		this.marginRight =
			UiConfig.margin != undefined && UiConfig.margin.marginRight != undefined
				? UiConfig.margin.marginRight
				: 0;

		//#endregion
		//#region padding
		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingTop =
			UiConfig.padding != undefined && UiConfig.padding.paddingTop != undefined
				? UiConfig.padding.paddingTop
				: 0;
		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingBottom =
			UiConfig.padding != undefined &&
			UiConfig.padding.paddingBottom != undefined
				? UiConfig.padding.paddingBottom
				: 0;
		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingLeft =
			UiConfig.padding != undefined && UiConfig.padding.paddingLeft != undefined
				? UiConfig.padding.paddingLeft
				: 0;
		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingRight =
			UiConfig.padding != undefined &&
			UiConfig.padding.paddingRight != undefined
				? UiConfig.padding.paddingRight
				: 0;

		//#endregion
	}

	refresh() {
		//#region adapting position aand width to parent

		//parent is instance of UIElement, has margin and padding properties
		let parent = this.parentContainer instanceof UIElement;

		let parentPaddingLeft = 0;
		let parentPaddingTop = 0;

		let wantedWidth = this.originalW;
		let wantedHeight = this.originalH;

		//#region posiontion
		if (parent) {
			parentPaddingLeft = this.parentContainer.paddingLeft;
			parentPaddingTop = this.parentContainer.paddingTop;
		}

		this.setPosition(
			this.originalX + this.marginLeft + parentPaddingLeft,
			this.originalY + this.marginTop + parentPaddingTop
		);
		//#endregion

		//#region width height
		if (parent) {
			//undefinedd gets the maximum possible size
			if (this.originalW == undefined) {
				wantedWidth = this.parentContainer.width;
			}
			if (this.originalH == undefined) {
				wantedHeight = this.parentContainer.height;
			}

			//get what I want but restricted to posibble space
			wantedWidth = Math.min(
				this.parentContainer.UIE_getInnerWidth() -
					(this.x - this.parentContainer.paddingLeft),
				wantedWidth
			);
			wantedHeight = Math.min(
				this.parentContainer.UIE_getInnerHeight() -
					(this.y - this.parentContainer.paddingTop),
				wantedHeight
			);

			// console.log(
			// 	"me: ",
			// 	this.name,
			// 	wantedWidth,
			// 	wantedHeight,
			// 	this.originalW,
			// 	this.originalH,
			// 	" | parent container: ",
			// 	this.parentContainer.name,
			// 	this.parentContainer.width,
			// 	this.parentContainer.height,
			// 	this.parentContainer.UIE_getInnerWidth(),
			// 	this.parentContainer.UIE_getInnerHeight()
			// );
		}

		this.width = wantedWidth - this.marginRight;
		this.height = wantedHeight - this.marginTop;

		//#endregion
		console.log("refresh - UIElement: ", this.name);

		//#endregion

		//refresh my children
		super.refresh();
	}

	UIE_getWidth() {
		return this.width;
	}
	UIE_getHeight() {
		return this.height;
	}

	/**
	 * gets the total elements width
	 * width + margin
	 */
	UIE_getTotalWidth() {
		return this.width + this.marginRight + this.marginLeft;
	}
	/**
	 * gets the total elements height
	 * height + margin
	 */
	UIE_getTotalHeight() {
		return this.height + this.marginTop + this.marginBottom;
	}
	/**
	 * furthest x position.
	 * x + width + marginRight.
	 */
	UIE_getFurthestX() {
		return this.x + this.width + this.marginRight;
	}
	/**
	 * furthest y position.
	 * y + height + marginBottom.
	 */
	UIE_getFurthestY() {
		return this.y + this.height + this.marginBottom;
	}

	/**
	 * gets the elements inner width
	 * width - padding
	 */
	UIE_getInnerWidth() {
		return this.width - (this.paddingLeft + this.paddingRight);
	}
	/**
	 * gets the elements inner height
	 * height - padding
	 */
	UIE_getInnerHeight() {
		return this.height - (this.paddingTop + this.paddingBottom);
	}
}

/**
 * @typedef {{
 * width: (number | undefined),
 * height: (number | undefined),
 * margin: {
 * marginTop: (number | undefined),
 * marginBottom: (number | undefined),
 * marginLeft: (number | undefined),
 * marginRight: (number | undefined),
 * },
 * padding:{
 * paddingTop: (number | undefined),
 * paddingBottom: (number | undefined),
 * paddingLeft: (number | undefined),
 * paddingRight: (number | undefined),
 * },
 * }} UIConfig Config object for UI classes
 *
 *
 */
