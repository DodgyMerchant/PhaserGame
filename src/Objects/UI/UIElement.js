import UIObj from "./Abstract/UIObj";
/** UI element to be chained for UI construction, basically a div */
export default class UIElement extends UIObj {
	/**
	 * UI object made for chaining, basically a div
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} depth deptch of the object. Hight number = ontop of other objects
	 * @param {number | UIElement | undefined} x The top position of the object. Undefined for the most left position. UIElement to orient this obj to the right to it. This has the highest priority.
	 * @param {number | UIElement | undefined} y The top position of the object. Undefined for the most top position. UIElement to orient this obj to the bottom to it. This has the highest priority.
	 * @param {number | undefined} w width of the UI object. undefiend causes the object to take up all possivble space INSIDE a UI element parent, respecting their settings. w<=1 will be handled as a percentage of all possible space.
	 * @param {number | undefined} h heigth of the UI object. undefiend causes the object to take up all possivble space INSIDE a UI element parent, respecting their settings. h<=1 will be handled as a percentage of all possible space.
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
				  ? x.UIE_getFurthestX() + 
          //adding non intitialized margin left

          //check for undefined
          (UiConfig!=undefined
            //is noot undefined
            //check for object
            ? ( typeof UiConfig.margin === "object"
              //is object
              //check for property defined
              ? (UiConfig.margin.Left != undefined
                //is defined return property
                ? UiConfig.margin.Left
                //is not defined, return 0
                : 0
                )
              //isnt an object, assume its a number, return it
              : UiConfig.margin
              )
            //is undefined
            : 0
          )
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
				  ? y.UIE_getFurthestY() + 
          //adding non intitialized margin top

          //check for undefined
          (UiConfig!=undefined
            //is noot undefined
            //check for object
            ? ( typeof UiConfig.margin === "object"
              //is object
              //check for property defined
              ? (UiConfig.margin.Top != undefined
                //is defined return property
                ? UiConfig.margin.Top
                //is not defined, return 0
                : 0
                )
              //isnt an object, assume its a number, return it
              : UiConfig.margin
              )
            //is undefined
            : 0
          )
          //not a reference use as normal coordinate
				  : y),

			cascadeEnable,
			cascadeDisable,
			children
		);

		//width and height
		/*
    value == undefined    as large as possible on that spectrum (w/h).
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

		// console.log("refresh - UIElement: ", this.name);

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
		x = this.UIE_getPositionRestrictedX(this.targetX, true);
		y = this.UIE_getPositionRestrictedY(this.targetY, true);

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

			// prettier-ignore
			let totalH = this.parentContainer.UIE_getInnerHeight();

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

		this.setSize(w, h);
	}

	/**
	 *
	 * @param {number} numX
	 * @param {boolean} relative
	 * @returns {number}
	 */
	UIE_getPositionRestrictedX(numX, relative) {
		if (this.parentContainer instanceof UIElement) {
			return Phaser.Math.Clamp(
				numX,
				(relative
					? this.parentContainer.UIE_getReliveInnerX1()
					: this.parentContainer.UIE_getInnerX1()) + this.marginLeft,
				(relative
					? this.parentContainer.UIE_getReliveInnerX2()
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
	UIE_getPositionRestrictedY(numY, relative) {
		if (this.parentContainer instanceof UIElement) {
			return Phaser.Math.Clamp(
				numY,
				(relative
					? this.parentContainer.UIE_getReliveInnerY1()
					: this.parentContainer.UIE_getInnerY1()) + this.marginTop,
				(relative
					? this.parentContainer.UIE_getReliveInnerY2()
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
	 * furthest x position.
	 * x + width + marginRight.
	 */
	UIE_getFurthestX() {
		return this.x + this.UIE_getWidth() + this.marginRight;
	}
	/**
	 * furthest y position.
	 * y + height + marginBottom.
	 */
	UIE_getFurthestY() {
		return this.y + this.UIE_getHeight() + this.marginBottom;
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
	 */
	UIE_getInnerX1() {
		return this.x + this.UIE_getReliveInnerX1();
	}
	/**
	 * gets the elements inner y1
	 */
	UIE_getInnerY1() {
		return this.y + this.UIE_getReliveInnerY1();
	}
	/**
	 * gets the elements inner x2
	 */
	UIE_getInnerX2() {
		return this.x + this.UIE_getReliveInnerX2();
	}
	/**
	 * gets the elements inner y2
	 */
	UIE_getInnerY2() {
		return this.y + this.UIE_getReliveInnerY2();
	}
	/**
	 * gets the elements inner x1 relative to its position
	 */
	UIE_getReliveInnerX1() {
		return this.paddingLeft;
	}
	/**
	 * gets the elements inner y1 relative to its position
	 */
	UIE_getReliveInnerY1() {
		return this.paddingTop;
	}
	/**
	 * gets the elements inner x2 relative to its position
	 */
	UIE_getReliveInnerX2() {
		return this.UIE_getWidth() - this.paddingRight;
	}
	/**
	 * gets the elements inner y2 relative to its position
	 */
	UIE_getReliveInnerY2() {
		return this.UIE_getHeight() - this.paddingBottom;
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
