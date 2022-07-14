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
		//#region conf
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
		this.textButtonConf = {
			align: "center",
		};
		//clone the basic text config and overwrite it with button specific changes
		this.textButtonConf = this.UIConfigMergeOverwrite(
			this.textConf,
			this.textButtonConf
		);

		/**
		 * config obj for interactive objects
		 * @type {Phaser.Types.Input.InputConfiguration}
		 */
		this.interConf = {
			pixelPerfect: false,
			useHandCursor: true,
		};

		/**
		 * graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.graphConf = {
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
		// this.scene.input.on()

		//#endregion
		//#region camera

		//#region setup

		/**
		 * the original main camera
		 * @type {Phaser.Cameras.Scene2D.Camera}
		 */
		this.CamMain = this.scene.cameras.main;

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

		this.inputKeys.zoomReset.on(
			"down",
			function () {
				this.CamEditor.zoomTo(this.camConfig.zoomBase, 100);
			},
			this
		);

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
		//#region world input

		/**
		 * array of vec2 for object vertecie creation
		 * @type {Phaser.Math.Vector2[]}
		 */
		this.world_objVertList = new Array();

		this.world_Graph = this.scene.add
			.graphics({
				x: 0,
				y: 0,
				lineStyle: {
					alpha: 1,
					color: "0x00ff00",
					width: 3,
				},
			})
			.save();

		this.scene.input.on(
			"pointerdown",
			/**
			 * @param {Phaser.Input.Pointer} pointer
			 * @param {Phaser.GameObjects.GameObject[]} intObjects
			 */
			function (pointer, intObjects) {
				if (intObjects.length == 0) {
					if (pointer.leftButtonDown()) {
						this.worldVertAdd(this.pointer.positionToCamera(this.CamEditor));
					}
					if (pointer.rightButtonDown()) {
						this.worldVertRemove();
					}
				} else {
					console.log(
						"///////////////////OMFG SOMETHINGGGGGGGG///////////: ",
						intObjects
					);
				}
			},
			this
		);

		//mouse move
		this.scene.input.on(
			"pointermove",
			/**
			 * @param {Phaser.Input.Pointer} pointer
			 * @param {Phaser.GameObjects.GameObject[]} intObjects
			 */
			function (pointer, intObjects) {
				// draw line from vert to pointer
				if (this.world_objVertList.length > 0) this.worldVertUpdate(2);
			},
			this
		);

		this.inputKeys.worldVertClose.on(
			"down",
			function () {
				this.worldVertEnd();
			},
			this
		);

		//#endregion

		//#region post camera setup

		//activate or not
		if (bool != undefined) {
			this.toggle(bool);
		} else {
			this.toggle(true);
		}

		//#endregion

		//#region UI

		let w = this.displayWidth / this.scaleX;
		let h = this.displayHeight / this.scaleY;
		let rp_w = 200;

		this.uiconfig = {
			//header
			header_x: 0,
			header_y: 0,
			header_w: w - rp_w,
			header_h: 20,

			//right panel
			rpanel_x: w - rp_w,
			rpanel_y: 0,
			rpanel_w: rp_w,
			rpanel_h: h,
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
			this.graphConf,
			this.textConf,
			true,
			true
		);

		this.RightPanel = this.UIPanelCreate(
			this,
			"Inspector",
			this.depth,
			this.uiconfig.rpanel_x,
			this.uiconfig.rpanel_y,
			this.uiconfig.rpanel_w,
			this.uiconfig.rpanel_h,
			this.graphConf,
			true,
			true
		);

		this.TestButton = this.UIButtonCreate(
			this,
			"TestButton",
			this.depth,
			200,
			270,
			100,
			100,
			true,
			true,
			"TEST",
			this.graphConf,
			this.textButtonConf,
			this.interConf,
			"pointerdown",
			"hello",
			true,
			true
		);

		this.TestButton.on(
			"hello",
			function (pointer, relX, relY, stopPropagation) {
				console.log("hello", stopPropagation);
			},
			this
		);

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

		this.enable(bool);

		this.cameraActivate(this.active);
	}

	//#region world interaction

	//#region vertecies object

	/**
	 *
	 * @param {Phaser.Math.Vector2} vec2
	 */
	worldVertAdd(vec2) {
		this.world_objVertList.push(vec2.clone());
		this.worldVertUpdate(1);
	}

	/**
	 *
	 *
	 */
	worldVertRemove() {
		if (this.world_objVertList.length > 0) {
			this.world_objVertList.pop();
			if (this.world_objVertList.length == 0) {
				this.worldVertEnd();
			} else {
				this.worldVertUpdate(0);
			}
		}
	}

	/**
	 *
	 * @param {boolean} value redo all?
	 */
	worldVertUpdate(value) {
		// this.world_Graph.restore();

		let leng = this.world_objVertList.length;

		switch (value) {
			case 0:
				this.world_Graph.clear();
				if (leng < 3) value = 1;
			case 1:
				if (leng < 2) value = 2;
		}

		switch (value) {
			case 0: {
				//do all but last vertex

				let x1 = this.world_objVertList[0].x;
				let y1 = this.world_objVertList[0].y;

				let element;

				for (let index = 1; index < leng - 1; index++) {
					/** @type {Phaser.Math.Vector2} */
					element = this.world_objVertList[index];

					this.world_Graph.lineBetween(x1, y1, element.x, element.y);

					x1 = element.x;
					y1 = element.y;
				}
			}
			case 1: {
				//do last vertex

				let last1 = this.world_objVertList.at(leng - 1);
				let last2 = this.world_objVertList.at(leng - 2);
				this.world_Graph.lineBetween(last2.x, last2.y, last1.x, last1.y);
			}
			case 2: {
				if (value == 2) this.world_Graph.commandBuffer.pop();

				let mouseVec2 = this.pointer.positionToCamera(this.CamEditor);
				let lastVec2 = this.world_objVertList[leng - 1];

				this.world_Graph.lineBetween(
					lastVec2.x,
					lastVec2.y,
					mouseVec2.x,
					mouseVec2.y
				);
			}
		}
	}

	/**
	 *
	 * @param {boolean | undefined} successful
	 */
	worldVertEnd() {
		this.world_Graph.clear();

		if (this.world_objVertList.length >= 3) {
			//create obj

			this.scene.mapObjVertCreate(this.world_objVertList, true);
			//reset
			this.worldVertReset();
		} else {
			this.worldVertReset();
		}
	}

	worldVertReset() {
		this.world_objVertList = new Array();
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
			this.world_Graph.setVisible(true);

			////main cam
			this.CamMain.setPosition(0, this.CamMain.height);
		} else {
			this.scene.cameras.remove(this.CamEditor, true);
			//deactivate cam controls
			this.camControls.active = false;
			this.camControls.camera = undefined;

			//disable main cam outline
			this.CamMainGraph.setVisible(false);
			this.world_Graph.setVisible(false);

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
