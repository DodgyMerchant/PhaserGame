import wallObjInter from "../WorldObjects/Walls/wallObjInter";
import UIManager from "./UI/UIManager";

/**
 * level editor
 */
export default class LevelEditor extends UIManager {
	/**
	 * create a level editor
	 * @param {String} name a name
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {Phaser.GameObjects.Group} debugGroup The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number | undefined} x The horizontal position of this Game Object in the world. Default 0.
	 * @param {number | undefined} y The vertical position of this Game Object in the world. Default 0.
	 * @param {bool | undefined} bool if active. default true
	 */
	constructor(name, scene, debugGroup, x, y, bool) {
		super(name, scene, 1000, x, y, undefined, true, true, undefined);

		//#region this obj setup
		/**
		 * @type {Phaser.GameObjects.Group} group im in
		 */
		this.group = debugGroup;

		this.scene.input.mouse.disableContextMenu();

		//#endregion
		//#region config obj

		//#region text config
		/**
		 * text config
		 * @type {Phaser.Types.GameObjects.Text.TextStyle}
		 */
		this.textConf = {
			fontFamily: "Arial",
			color: "#ffffff",
			align: "left",
		};

		/**
		 * text config
		 * @type {Phaser.Types.GameObjects.Text.TextStyle}
		 */
		this.textButtonConf = {};
		//clone the basic text config and overwrite it with button specific changes
		this.textButtonConf = this.UIConfigMergeOverwrite(
			this.textConf,
			this.textButtonConf
		);

		//#endregion
		//#region graphics config

		/**
		 * graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.UIgraphConf = {
			x: 0,
			y: 0,
			fillStyle: {
				alpha: 0.3,
				color: "#000000",
			},
			lineStyle: {
				alpha: 0.3,
				color: "#000000",
				width: 5,
			},
		};

		/**
		 * cam config
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.worldGraphConf = {
			x: 0,
			y: 0,
			lineStyle: {
				alpha: 1,
				color: "0xffff00",
				width: 3,
			},
		};

		//#endregion
		//other config

		/**
		 * config obj for interactive objects
		 * @type {Phaser.Types.Input.InputConfiguration}
		 */
		this.interConf = {
			pixelPerfect: false,
			useHandCursor: true,
		};

		/**
		 * custoom cam config
		 */
		this.camConfig = {
			/** background color
			 * @type {number}
			 */
			backCol: "#828282",
			moveEventName: "LevelEditorCamMainMove",
			speed: 5,

			//zoom
			zoomBase: this.scene.cameras.main.zoom,
			zoomSpeed: 0.01,
			maxZoom: 10,
			minZoom: 0.1,
			zoomWheelComp: 8,
		};

		//#endregion
		//#region input

		/**
		 * input
		 */
		this.inputKeys = this.scene.input.keyboard.addKeys(
			{
				//#region cam
				//cam movement
				/** @type {Phaser.Input.Keyboard.Key} */
				up: Phaser.Input.Keyboard.KeyCodes.UP,
				/** @type {Phaser.Input.Keyboard.Key} */
				down: Phaser.Input.Keyboard.KeyCodes.DOWN,
				/** @type {Phaser.Input.Keyboard.Key} */
				left: Phaser.Input.Keyboard.KeyCodes.LEFT,
				/** @type {Phaser.Input.Keyboard.Key} */
				right: Phaser.Input.Keyboard.KeyCodes.RIGHT,

				//cam zoom
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomIn: Phaser.Input.Keyboard.KeyCodes.MINUS,
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomOut: Phaser.Input.Keyboard.KeyCodes.PLUS,
				/** @type {Phaser.Input.Keyboard.Key} */
				zoomReset: Phaser.Input.Keyboard.KeyCodes.BACKSPACE,

				//#endregion
				//#region world
				/** @type {Phaser.Input.Keyboard.Key} */
				worldVertClose: Phaser.Input.Keyboard.KeyCodes.CTRL,

				//#endregion
			},
			true,
			true
		);

		//mouse
		this.pointer = this.scene.input.activePointer;

		//#endregion
		//#region camera

		//#region setup

		/**
		 * the original main camera
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamMain = this.scene.cameras.main;

		//move main cam outline with camera, step 1 emit move event
		this.CamMain.on(
			"followupdate",
			/**
			 * @param {Phaser.Cameras.Scene2D.Camera} cam
			 * @param {Player} obj
			 */
			function (cam, obj) {
				cam.emit(this.camConfig.moveEventName, cam);
			},
			this
		);

		/**
		 * camera for the editor
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamEditor;

		this.CamMainGraph = this.scene.add.graphics({
			x: 0,
			y: 0,
			lineStyle: {
				alpha: 0.5,
				color: "0x00ff00",
				width: 7,
			},
		});
		// this.add(this.CamMainGraph); dont add or ittl move with

		/** cam controls
		 * @type {Phaser.Cameras.Controls.FixedKeyControl}
		 */
		this.camControls;

		//#endregion
		//#region main cam outline
		this.CamMainGraph.strokeRectShape(this.CamMain.worldView);
		this.bringToTop(this.CamMainGraph);

		//move main cam outline with camera, step 2 listent to move event aand move outline
		this.CamMain.on(
			this.camConfig.moveEventName,
			/**
			 * @param {Phaser.Cameras.Scene2D.Camera} cam
			 */
			function (cam) {
				this.CamMainGraph.setX(this.CamMain.scrollX);
				this.CamMainGraph.setY(this.CamMain.scrollY);
			},

			this
		);
		//#endregion
		//#region movement

		this.camControls = new Phaser.Cameras.Controls.FixedKeyControl({
			camera: this.CamEditor,
			up: this.inputKeys.up,
			down: this.inputKeys.down,
			left: this.inputKeys.left,
			right: this.inputKeys.right,
			speed: this.camConfig.speed,
			//zoom
			zoomIn: this.inputKeys.zoomIn,
			zoomOut: this.inputKeys.zoomOut,
			zoomSpeed: this.camConfig.zoomSpeed,
			maxZoom: this.camConfig.maxZoom,
			minZoom: this.camConfig.minZoom,
		});

		//resets zoom
		this.inputKeys.zoomReset.on(
			"down",
			function () {
				this.CamEditor.zoomTo(this.camConfig.zoomBase, 100);
			},
			this
		);

		//change zoom with mouse wheel
		this.scene.input.on(
			"wheel",
			function (pointer, obj, x, y, z) {
				this.CamEditor.zoom = Phaser.Math.Clamp(
					this.CamEditor.zoom -
						Math.sign(y) *
							this.camConfig.zoomSpeed *
							this.camConfig.zoomWheelComp,
					this.camConfig.minZoom,
					this.camConfig.maxZoom
				);
			},
			this
		);

		//#endregion

		//#endregion
		//#region world interaction

		/**
		 * array of vec2 for object vertecie creation
		 * @type {Phaser.Math.Vector2[]}
		 */
		this.worldVertList = new Array();

		this.worldGraph = this.scene.add.graphics(this.worldGraphConf);

		//manipulating objects in world

		/**
		 * the selected world Object
		 * @type {Phaser.GameObjects.GameObject}
		 */
		this.worldObjSelected;

		/**
		 * @type {MatterJS.ConstraintType}
		 */
		this.PointerConstraint = this.scene.matter.add.pointerConstraint({
			label: "LevelEditorPointerConstraint",
			length: 0,
			stiffness: 1,
			render: true,
		});

		//#endregion
		//#region toggle

		//activate or not
		if (bool != undefined) {
			this.toggle(bool);
		} else {
			this.toggle(true);
		}

		//#endregion
		//#region UI

		let subElemPadd = 5;
		let subElemPadd2 = subElemPadd * 2;

		let w = this.displayWidth / this.scaleX;
		let h = this.displayHeight / this.scaleY;
		let rp_w = 200;
		let rp_h = h;
		let rp_x = w - rp_w;
		let rp_y = 0;
		//inspector
		let i_w = rp_w - subElemPadd2;
		let i_h = rp_h - subElemPadd2;
		let i_x = rp_x + subElemPadd;
		let i_y = rp_y + subElemPadd;
		//inspector label
		let il_w = i_w - subElemPadd2;
		let il_h = 30;
		let il_x = i_x + subElemPadd;
		let il_y = i_y + subElemPadd;

		this.uiconfig = {
			//header
			header_x: 0,
			header_y: 0,
			header_w: w - rp_w,
			header_h: 20,
			//right panel
			rpanel_x: rp_x,
			rpanel_y: rp_y,
			rpanel_w: rp_w,
			rpanel_h: rp_h,
			//inspector
			inspector_x: i_x,
			inspector_y: i_y,
			inspector_w: i_w,
			inspector_h: i_h,
			//inspector laabel
			inspLeb_x: il_x,
			inspLeb_y: il_y,
			inspLeb_w: il_w,
			inspLeb_h: il_h,
		};

		//heading
		this.Label = this.UILabelCreate(
			this,
			"UILabelEditorActive",
			this.depth,
			this.uiconfig.header_x,
			this.uiconfig.header_y,
			this.uiconfig.header_w,
			this.uiconfig.header_h,
			true,
			true,
			"Level Editor Active",
			this.UIgraphConf,
			this.textConf,
			true,
			true
		);

		//#region right panel

		this.RightPanel = this.UIPanelCreate(
			this,
			"RightPanel",
			this.depth,
			this.uiconfig.rpanel_x,
			this.uiconfig.rpanel_y,
			this.uiconfig.rpanel_w,
			this.uiconfig.rpanel_h,
			this.UIgraphConf,
			true,
			true
		);

		//#region inspector

		this.Inspector = this.UIPanelCreate(
			this,
			"Inspector",
			this.depth,
			this.uiconfig.inspector_x,
			this.uiconfig.inspector_y,
			this.uiconfig.inspector_w,
			this.uiconfig.inspector_h,
			this.UIgraphConf,
			true,
			true
		);

		this.Label = this.UILabelCreate(
			this,
			"UILabelEditorActive",
			this.depth,
			this.uiconfig.inspLeb_x,
			this.uiconfig.inspLeb_y,
			this.uiconfig.inspLeb_w,
			this.uiconfig.inspLeb_h,
			true,
			true,
			"Inspector",
			this.UIgraphConf,
			this.textConf,
			true,
			true
		);

		// this.TestButton = this.UIButtonCreate(
		// 	this,
		// 	"TestButton",
		// 	this.depth,
		// 	200,
		// 	270,
		// 	100,
		// 	100,
		// 	true,
		// 	true,
		// 	"TEST",
		// 	this.UIgraphConf,
		// 	this.textButtonConf,
		// 	this.interConf,
		// 	"pointerdown",
		// 	"hello",
		// 	true,
		// 	true
		// );

		// this.TestButton.on(
		// 	"hello",
		// 	function (pointer, relX, relY, stopPropagation) {
		// 		console.log("hello", stopPropagation);
		// 	},
		// 	this
		// );

		//#endregion

		//#endregion

		//#endregion

		console.log("//////////// level editor created ////////////");
	}

	update(time, delta) {
		//parent update
		this.camera_update();

		super.update(time, delta);
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined
	 */
	toggle(bool) {
		if (bool == undefined) bool = !this.active;

		// this.PointerConstraint.

		this.enable(bool);

		this.cameraActivate(this.active);

		this.inputManageMyLIsteners(this.active);
	}

	//#region listeners general

	inputManageMyLIsteners(bool) {
		//world interaction
		this.worldSetupListeners(bool);

		if (bool) {
		} else {
		}
	}

	//#endregion
	//#region world interaction

	//#region listeners

	worldSetupListeners(bool) {
		if (bool) {
			/////pointer
			//#region clicking, drawing poly walls and selecting them
			this.scene.input.on(
				"pointerdown",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					// console.log("Level Editor World Input pointerdown");
					if (intObjects.length == 0) {
						this.worldObjUnselect();

						if (pointer.leftButtonDown()) {
							this.worldVertAdd(this.pointer.positionToCamera(this.CamEditor));
						}
						if (pointer.rightButtonDown()) {
							this.worldVertRemove();
						}
					} else {
						this.worldVertReset();
						this.worldObjSelect(intObjects);
					}
				},
				this
			);
			//#endregion
			//#region mouse move, updating line to mouse
			this.scene.input.on(
				"pointermove",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					// draw line from vert to pointer
					// console.log("Level Editor World Input pointermove");
					if (this.worldVertList.length > 0) {
						this.worldVertUpdate(2);
					} else {
						//obj selected
						if (this.worldObjSelected != undefined) {
							if (this.worldObjSelected.input.dragState == 2)
								this.worldObjHighlight();
						}
					}
				},
				this
			);
			//#endregion

			/////keyboard
			//#region closing poly
			this.inputKeys.worldVertClose.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldVertEnd(false);
				},
				this
			);
			//#endregion
		} else {
			//clicking
			this.scene.input.removeListener("pointerdown", undefined, this);

			// mouse move, updating line to mouse
			this.scene.input.removeListener("pointermove", undefined, this);

			//closing poly
			this.inputKeys.worldVertClose.removeListener("down", undefined, this);
		}
	}

	//#endregion
	//#region vertecies object

	/**
	 *
	 * @param {Phaser.Math.Vector2} vec2
	 */
	worldVertAdd(vec2) {
		this.worldVertList.push(vec2.clone());
		this.worldVertUpdate(1);
	}

	/**
	 *
	 *
	 */
	worldVertRemove() {
		if (this.worldVertList.length > 0) {
			this.worldVertList.pop();
			if (this.worldVertList.length == 0) {
				this.worldVertReset();
			} else {
				this.worldVertUpdate(0);
			}
		}
	}

	/**
	 *
	 * @param {boolean} value 0 == redo all, 1 == newest and mouse, 2 == mouse
	 */
	worldVertUpdate(value) {
		// this.worldGraph.restore();

		let leng = this.worldVertList.length;

		switch (value) {
			case 0:
				this.worldGraph.clear();
				if (leng < 3) value = 1;
			case 1:
				if (leng < 2) value = 2;
		}

		switch (value) {
			case 0: {
				//do all but last vertex

				let x1 = this.worldVertList[0].x;
				let y1 = this.worldVertList[0].y;

				let element;

				for (let index = 1; index < leng - 1; index++) {
					/** @type {Phaser.Math.Vector2} */
					element = this.worldVertList[index];

					this.worldGraph.lineBetween(x1, y1, element.x, element.y);

					x1 = element.x;
					y1 = element.y;
				}
			}
			case 1: {
				//do last vertex

				let last1 = this.worldVertList.at(leng - 1);
				let last2 = this.worldVertList.at(leng - 2);
				this.worldGraph.lineBetween(last2.x, last2.y, last1.x, last1.y);
			}
			case 2: {
				if (value == 2) this.worldGraph.commandBuffer.pop();

				let mouseVec2 = this.pointer.positionToCamera(this.CamEditor);
				let lastVec2 = this.worldVertList[leng - 1];

				this.worldGraph.lineBetween(
					lastVec2.x,
					lastVec2.y,
					mouseVec2.x,
					mouseVec2.y
				);
			}
		}
	}

	/**
	 * @param {boolean} forceSucc force obj creation
	 */
	worldVertEnd(forceSucc) {
		if (forceSucc || this.worldVertList.length >= 3) {
			//create obj

			this.scene.mapObjVertCreate(this.worldVertList, true);
			//reset
			this.worldVertReset();
		} else {
			this.worldVertReset();
		}
	}

	worldVertReset() {
		this.worldGraph.clear();
		this.worldVertList = new Array();
	}

	//#endregion
	//#region selecting a obj

	/**
	 * selecting an object
	 * @param {Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]} objs
	 */
	worldObjSelect(objs) {
		//#region set worldObjSelected
		if (Array.isArray(objs)) {
			if (objs.length > 1)
				console.log("Level editor worldObjSelect: more than one obj got", objs);
			this.worldObjSelected = objs[0];
		} else this.worldObjSelected = objs;

		//#endregion

		if (this.worldObjSelected instanceof wallObjInter) {
			/** @type {wallObjInter} */
			this.worldObjSelected;
		} else {
			console.log(
				"Oh nooooo, unknown object type selected, the system doesnt support this"
			);
		}

		this.worldObjHighlight();
	}

	/**
	 * selecting an object
	 * @param {Phaser.GameObjects.GameObject[]} objs
	 */
	worldObjUnselect() {
		if (this.worldObjSelected != undefined) {
			this.worldGraph.clear();
			this.worldObjSelected = undefined;
		}
	}

	/**
	 * draw border around the obj
	 */
	worldObjHighlight() {
		if (this.worldObjSelected instanceof wallObjInter) {
			/** @type {wallObjInter} */
			this.worldObjSelected;
		} else {
			console.log(
				"Oh nooooo, unknown object type selected, the system doesnt support this"
			);
		}

		this.worldGraph.clear();

		/**
		 * @type {Phaser.Math.Vector2[]}
		 */
		let vertArray = this.worldObjSelected.body.vertices;

		for (let index = 0; index < vertArray.length; index++) {
			const element2 = vertArray[index];
			const element1 = vertArray.at(index - 1);

			this.worldGraph.lineBetween(
				element1.x,
				element1.y,
				element2.x,
				element2.y
			);
		}
	}

	//#endregion

	//#endregion
	//#region camera

	/**
	 *
	 * @param {number} delta delta
	 */
	camera_update(delta) {
		//applying camera controls
		this.camControls.update(delta);
	}

	/**
	 * activate or deactivate camera stuff
	 * @param {boolean} active activate or deactivate
	 */
	cameraActivate(active) {
		if (active) {
			this.CamEditor = this.cameraEditorCreateFrom(this.CamMain);
			this.setFixCam(this.CamEditor);

			this.scene.cameras.addExisting(this.CamEditor, false);
			//activate cam controls
			this.camControls.active = true;
			this.camControls.camera = this.CamEditor;
			//enable main cam outline
			this.CamMainGraph.setVisible(true);
			this.worldGraph.setVisible(true);

			////main cam
			this.CamMain.setPosition(0, this.CamMain.height);
		} else {
			this.scene.cameras.remove(this.CamEditor, true);
			//deactivate cam controls
			this.camControls.active = false;
			this.camControls.camera = undefined;

			//disable main cam outline
			this.CamMainGraph.setVisible(false);
			this.worldGraph.setVisible(false);

			//main caam
			this.CamMain.setPosition(0, 0);
		}
	}

	/**
	 * create a camera
	 * @param {Phaser.Cameras.Scene2D.Camera} camToCopy to copy
	 * @returns {Phaser.Cameras.Scene2D.Camera} new camera
	 */
	cameraEditorCreateFrom(camToCopy) {
		let camNew = new Phaser.Cameras.Scene2D.Camera(
			camToCopy.x,
			camToCopy.y,
			camToCopy.displayWidth / camToCopy.zoom,
			camToCopy.displayHeight / camToCopy.zoom
		);

		camNew.zoom = camToCopy.zoom;

		camNew.setScroll(camToCopy.scrollX, camToCopy.scrollY);

		camNew.setBackgroundColor(this.camConfig.backCol);

		//end
		return camNew;
	}

	//#endregion
}
