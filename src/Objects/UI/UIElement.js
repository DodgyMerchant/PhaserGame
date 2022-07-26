import UIObj from "./Abstract/UIObj";
/** UI element to be chained for UI construction, basically a div */
export default class UIElement extends UIObj {
	/**
	 * UI object made for chaining, basically a div
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number | UIElement | undefined} x The top position of the object. Undefined for the most left position. UIElement to orient this obj to the right to it. negative values will be handled moving from the opposite side of the parents space. This has the highest priority.
	 * @param {number | UIElement | undefined} y The top position of the object. Undefined for the most top position. UIElement to orient this obj to the bottom to it. negative values will be handled moving from the opposite side of the parents space. This has the highest priority.
	 * @param {number | UIObj | UIElement | undefined} w width of the UI object. w<=1 will be handled as a percentage of all possible space. an reference to sibling will use their x as x2. referencing the parent will take up all its space. undefiend causes the object to expand to the next obj or to all space.
	 * @param {number | UIObj | UIElement | undefined} h heigth of the UI object. h<=1 will be handled as a percentage of all possible space. an reference to sibling will use their x as x2. referencing the parent will take up all its space. undefiend causes the object to expand to the next obj or to all space.
	 * @param {UIConfig | undefined} UiConfig Config object for UI classes. alll settings are EXCLUDED in the total width/heigth of the element. meaning if you set the width you set the width. no shenanigans.
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
		w,
		h,
		UiConfig,
		cascadeEnable,
		cascadeDisable,
		children
	) {
		// prettier-ignore
		super(
			name,
			scene,
			depth,
			//check for special cases: undefined = most left position
			x == undefined
				? 
          //special case most left position
          0
				:
        //special case oreint to object
        //if reference ti UIElement obj
        (x instanceof UIElement
          //is reference use its position
				  ? x.UIE_getOutterX2(false) + 
          //adding non intitialized margin left

          //check for undefined
          UIElement.UIE_configGetMargin(UiConfig,2,0)
          //not a reference use as normal coordinate
				  : x),

			//check for special cases: undefined = most top position
			y == undefined
				? 
          //special case most left position
          0
        :
        //special case oreint to object
        //if reference ti UIElement obj
        (y instanceof UIElement
          //is reference use its position
				  ? y.UIE_getOutterY2(false) + 
          //adding non intitialized margin top

          //check for undefined
          UIElement.UIE_configGetMargin(UiConfig,3,0)
          //not a reference use as normal coordinate
				  : y),

			cascadeEnable,
			cascadeDisable,
			children
		);

		//width and height
		/*
    value == undefined    as large as possible on that spectrum (w/h).
    value of type object  use that objects ounds aas x2/y2
    value <= 1            handles widdth and height as a percentage value of possible space.
    value is other        haandles as normal value.
    */

		this.width = w == undefined || w <= 1 ? 0 : w;
		this.height = h == undefined || h <= 1 ? 0 : h;

		/**
		 * original set width,
		 * holds special type behavior to follow.
		 * value == undefined    as large as possible on that spectrum (w/h).
		 * value <= 1            handles widdth and height as a percentage value of possible space.
		 * value is other        haandles as normal value.
		 * @type {number | undefined}
		 */
		this.originalW = w;

		/**
		 * original set height,
		 * holds special type behavior to follow.
		 * value == undefined    as large as possible on that spectrum (w/h).
		 * value <= 1            handles widdth and height as a percentage value of possible space.
		 * value is other        haandles as normal value.
		 * @type {number | undefined}
		 */
		this.originalH = h;

		//#region margin

		/**
		 * if margin shouldd be applied if no parent exists
		 * @type {boolean}
		 */
		this.marginApplyNoParent = false;

		/**
		 * the outer specing to the parent and other objects in the same parent.
		 * outer top of the container.
		 * @type {number} */
		this.marginTop = 0;

		/**
		 * the outer specing to the parent and other objects in the same parent.
		 * outer top of the container.
		 * @type {number}
		 */
		this.marginBottom = 0;

		/**
		 * the outer specing to the parent and other objects in the same parent.
		 * outer top of the container.
		 * @type {number} */
		this.marginLeft = 0;

		/**
		 * the outer specing to the parent and other objects in the same parent.
		 * outer top of the container.
		 * @type {number} */
		this.marginRight = 0;

		if (UiConfig != undefined) {
			this.marginApplyNoParent = UiConfig.marginApplyNoParent;

			if (UiConfig.margin != undefined)
				if (typeof UiConfig.margin === "object") {
					if (UiConfig.margin.Top != undefined)
						this.marginTop = UiConfig.margin.Top;

					if (UiConfig.margin.Bottom != undefined)
						this.marginBottom = UiConfig.margin.Bottom;

					if (UiConfig.margin.Left != undefined)
						this.marginLeft = UiConfig.margin.Left;

					if (UiConfig.margin.Right != undefined)
						this.marginRight = UiConfig.margin.Right;
				} else {
					this.marginTop = UiConfig.margin;
					this.marginBottom = UiConfig.margin;
					this.marginLeft = UiConfig.margin;
					this.marginRight = UiConfig.margin;
				}
		}

		//#endregion
		//#region padding
		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingTop = 0;

		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingBottom = 0;

		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingLeft = 0;

		/** the inner specing to the content
		 * inner top of the container
		 * @type {number} */
		this.paddingRight = 0;

		if (UiConfig != undefined && UiConfig.padding != undefined)
			if (typeof UiConfig.padding === "object") {
				if (UiConfig.padding.Top != undefined)
					this.paddingTop = UiConfig.padding.Top;

				if (UiConfig.padding.Bottom != undefined)
					this.paddingBottom = UiConfig.padding.Bottom;

				if (UiConfig.padding.Left != undefined)
					this.paddingLeft = UiConfig.padding.Left;

				if (UiConfig.padding.Right != undefined)
					this.paddingRight = UiConfig.padding.Right;
			} else {
				this.paddingTop = UiConfig.padding;
				this.paddingBottom = UiConfig.padding;
				this.paddingLeft = UiConfig.padding;
				this.paddingRight = UiConfig.padding;
			}
		//#endregion
	}

	refresh() {
		this.UIE_reposition();
		this.UIE_resize();

		// console.log(
		// 	"me: ",
		// 	this.name,
		// 	this.x,
		// 	this.y,
		// 	this.width,
		// 	this.height,
		// 	" | parent container: ",
		// 	this.parentContainer.name,
		// 	this.parentContainer.width,
		// 	this.parentContainer.height
		// );

		console.log("refresh - UIElement: ", this.name);

		//refresh my children
		super.refresh();
	}

	/**
	 * repositions this UIElement according to its targetX, targetY
	 * uses the x,y positions
	 * if you need to update both position aand size call this second
	 */
	UIE_reposition() {
		let x, y;

		//worls with and without parents, applies noparent margin aapplication

		if (
			typeof this.targetX === "number" &&
			this.targetX < 0 &&
			this.parentContainer instanceof UIElement
		) {
			x = this.UIE_getPositionRestrictedX(
				this.parentContainer.UIE_getInnerWidth() + this.targetX,
				true
			);
		} else {
			x = this.UIE_getPositionRestrictedX(this.targetX, true);
		}

		if (
			typeof this.targetY === "number" &&
			this.targetY < 0 &&
			this.parentContainer instanceof UIElement
		) {
			y = this.UIE_getPositionRestrictedY(
				this.parentContainer.UIE_getInnerHeight() + this.targetY,
				true
			);
		} else {
			y = this.UIE_getPositionRestrictedY(this.targetY, true);
		}

		// x = this.UIE_getPositionRestrictedX(this.targetX, true);
		// y = this.UIE_getPositionRestrictedY(this.targetY, true);

		this.setPosition(x, y);
	}

	/**
	 * resizes thus UIElement
	 * uses the x,y positions
	 * if you need to update both position aand size call this second
	 */
	UIE_resize() {
		//set as normal
		let w = this.originalW;
		let h = this.originalH;

		if (this.parentContainer instanceof UIElement) {
			//#region width

			// prettier-ignore
			let totalW = this.parentContainer.UIE_getInnerWidth();

			// console.log("me: ", this.name, " totalW: ", totalW);

			//if width is special propertie apply it
			if (
				typeof this.originalW === "object" &&
				this.originalW instanceof UIElement
			) {
				//my parent given as width
				if (this.originalW == this.parentContainer) {
					w = totalW;
				} else {
					w = this.originalW.UIE_getOutterX1(false) - this.x;
				}
			}

			if (this.originalW == undefined || this.originalW <= 1) {
				w =
					totalW * (this.originalW <= 1 ? this.originalW : 1) -
					(this.marginLeft + this.marginRight);
			}

			w = Math.min(
				w,
				totalW - (this.x - this.parentContainer.paddingLeft - this.marginLeft)
			);

			//#endregion
			//#region height

			let totalH = this.parentContainer.UIE_getInnerHeight();

			//if width is special propertie apply it
			if (
				typeof this.originalH === "object" &&
				this.originalH instanceof UIElement
			) {
				//my parent given as width
				if (this.originalH == this.parentContainer) {
					h = totalH;
				} else {
					h = this.originalH.UIE_getOutterY1(false) - this.y;
				}
			}

			//if width is special propertie apply it
			if (this.originalH == undefined || this.originalH <= 1) {
				h =
					totalH * (this.originalH <= 1 ? this.originalH : 1) -
					(this.marginTop + this.marginBottom);
			}

			h = Math.min(
				h,
				totalH - (this.y - this.parentContainer.paddingTop - this.marginTop)
			);

			//#endregion
		}

		// console.log("UIE - resize to: ", w, h);
		this.setSize(w, h);
		// console.log(
		// 	"UIE - post resize to: ",
		// 	this.width,
		// 	this.height,
		// 	this.displayWidth,
		// 	this.displayHeight
		// );
	}

	/**
	 * refreshes by default after the change
	 * @param {number | undefined} w
	 * @param {number | undefined} h
	 * @param {bool | undefined} h
	 */
	UIE_setSize(w = this.originalW, h = this.originalH, refresh = true) {
		// if (w != undefined)
		this.originalW = w;
		// if (h != undefined)
		this.originalH = h;

		// console.log("UIE - ", w, h, this.originalW, this.originalH);

		if (refresh) this.refresh();
	}

	/**
	 *
	 * @param {number} numX default 0
	 * @param {boolean} relative default false
	 * @returns {number}
	 */
	UIE_getPositionRestrictedX(numX = 0, relative = false) {
		if (this.parentContainer instanceof UIElement) {
			return Phaser.Math.Clamp(
				numX,
				(relative
					? this.parentContainer.UIE_getInnerX1(true)
					: this.parentContainer.UIE_getInnerX1()) + this.marginLeft,
				(relative
					? this.parentContainer.UIE_getInnerX2(true)
					: this.parentContainer.UIE_getInnerX2()) + this.marginRight
			);
		} else if (this.marginApplyNoParent) {
			return numX + this.marginLeft;
		} else return numX;
	}

	/**
	 *
	 * @param {number} numY
	 * @param {boolean} relative
	 * @returns {number}
	 */
	UIE_getPositionRestrictedY(numY = 0, relative = false) {
		if (this.parentContainer instanceof UIElement) {
			return Phaser.Math.Clamp(
				numY,
				(relative
					? this.parentContainer.UIE_getInnerY1(true)
					: this.parentContainer.UIE_getInnerY1()) + this.marginTop,
				(relative
					? this.parentContainer.UIE_getInnerY2(true)
					: this.parentContainer.UIE_getInnerY2()) + this.marginBottom
			);
		} else if (this.marginApplyNoParent) {
			return numY + this.marginTop;
		} else return numY;
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
		return this.UIE_getWidth() + this.marginRight + this.marginLeft;
	}
	/**
	 * gets the total elements height
	 * height + margin
	 */
	UIE_getTotalHeight() {
		return this.UIE_getHeight() + this.marginTop + this.marginBottom;
	}
	/**
	 * gets the elements inner width
	 * width - padding
	 */
	UIE_getInnerWidth() {
		return this.UIE_getWidth() - (this.paddingLeft + this.paddingRight);
	}
	/**
	 * gets the elements inner height
	 * height - padding
	 */
	UIE_getInnerHeight() {
		return this.UIE_getHeight() - (this.paddingTop + this.paddingBottom);
	}

	/**
	 * gets the elements inner x1
	 * @param relative value should be relative to object
	 */
	UIE_getInnerX1(relative = false) {
		return (relative ? 0 : this.x) + this.paddingLeft;
	}
	/**
	 * gets the elements inner y1
	 * @param relative value should be relative to object
	 */
	UIE_getInnerY1(relative = false) {
		return (relative ? 0 : this.y) + this.paddingTop;
	}
	/**
	 * gets the elements inner x2
	 * @param relative value should be relative to object
	 */
	UIE_getInnerX2(relative = false) {
		return (relative ? 0 : this.x) + this.UIE_getWidth() - this.paddingRight;
	}
	/**
	 * gets the elements inner y2
	 * @param relative value should be relative to object
	 */
	UIE_getInnerY2(relative = false) {
		return (relative ? 0 : this.y) + this.UIE_getHeight() - this.paddingBottom;
	}
	/**
	 * gets the elements outter x1
	 * @param relative value should be relative to object
	 */
	UIE_getOutterX1(relative = false) {
		return (relative ? 0 : this.x) - this.marginLeft;
	}
	/**
	 * gets the elements outter y1
	 * @param relative value should be relative to object
	 */
	UIE_getOutterY1(relative = false) {
		return (relative ? 0 : this.y) - this.marginTop;
	}
	/**
	 * gets the elements outter x2
	 * @param relative value should be relative to object
	 */
	UIE_getOutterX2(relative = false) {
		return (relative ? 0 : this.x) + this.UIE_getWidth() + this.marginRight;
	}
	/**
	 * gets the elements outter y2
	 * @param relative value should be relative to object
	 */
	UIE_getOutterY2(relative = false) {
		return (relative ? 0 : this.y) + this.UIE_getHeight() + this.marginBottom;
	}

	//static
	/**
	 * safe way to get the data
	 * @param {UIConfig} config
	 * @param {number} direction direction as a number, clockwise sarting right. 0 = Right, 1= Bottom, 2= Left, 3= Top
	 * @param {any | undefined} fallback return this if nothing is found
	 */
	static UIE_configGetMargin(config, direction, fallback) {
		if (config != undefined) {
			if (typeof config.margin === "object")
				switch (direction) {
					case 0:
						return config.margin.Right;
					case 1:
						return config.margin.Bottom;
					case 2:
						return config.margin.Left;
					case 3:
						return config.margin.Top;
				}
			else if (typeof config.margin === "number") return config.margin;
		}

		return fallback;
	}
	/**
	 * safe way to get the data
	 * @param {UIConfig} config
	 * @param {number} direction direction as a number, clockwise sarting right. 0 = Right, 1= Bottom, 2= Left, 3= Top
	 * @param {any | undefined} fallback return this if nothing is found
	 */
	static UIE_configGetPadding(config, direction, fallback) {
		if (config != undefined) {
			if (typeof config.padding === "object")
				switch (direction) {
					case 0:
						return config.padding.Right;
					case 1:
						return config.padding.Bottom;
					case 2:
						return config.padding.Left;
					case 3:
						return config.padding.Top;
				}
			else if (typeof config.padding === "number") return config.padding;
		}

		return fallback;
	}
}

/**
 * @typedef {{
 * Top: (number | undefined),
 * Bottom: (number | undefined),
 * Left: (number | undefined),
 * Right: (number | undefined),
 * }} BoundConfig Config object for UI classes
 */
/**
 * @typedef {{
 * marginApplyNoParent: (boolean | undefined),
 * margin: (BoundConfig | number),
 * padding: (BoundConfig | number),
 * }} UIConfig Config object for UI classes
 */
