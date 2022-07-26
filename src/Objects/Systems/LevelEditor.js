import { GUI } from "dat.gui";
import UIManager from "../UI/Abstract/UIManager";
import UIObj from "../UI/Abstract/UIObj";
import UIElement, { UIConfig } from "../UI/UIElement";
import CollisionInstance from "../WorldObjects/Dev/CollisionInstance";

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

		//#region loading

		this.assestsDataKey = "levelEditorAssets";
		this.assets = {
			number: 0,
			typeNum: 0,
			map: new Map(),
		};
		this.loadAssets();

		//#endregion

		//#region this obj setup
		/**
		 * @type {Phaser.GameObjects.Group} group im in
		 */
		(this.group = debugGroup);

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
		this.UILabelgraphConf = {
			fillStyle: {
				alpha: 1,
				color: "0x282828",
			},
			lineStyle: {
				alpha: 1,
				color: "0x282828",
				width: 5,
			},
		};

		/**
		 * graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.UIBackGraphConf = {
			fillStyle: {
				alpha: 1,
				color: "0x282828",
			},
			lineStyle: {
				alpha: 1,
				color: "0x282828",
				width: 5,
			},
		};

		/**
		 * graph config
		 * with x and y missing
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		let modeUIGraphConf = {
			fillStyle: {
				alpha: 0.05,
			},
			lineStyle: {
				alpha: 0.3,
				width: 5,
			},
		};

		let modeLabelGraphConf = {
			fillStyle: {
				alpha: 0.2,
			},
			lineStyle: {
				alpha: 0.3,
				width: 5,
			},
		};

		let createCol = "0x00ff00";
		let editCol = "0x0000ff";
		let saveCol = "0xC81010";
		let saveA = 1;

		//create
		this.UICreateGraphConf = Phaser.Utils.Objects.DeepCopy(modeUIGraphConf);
		this.UICreateLabelGraphConf =
			Phaser.Utils.Objects.DeepCopy(modeLabelGraphConf);
		//edit
		this.UICreateGraphConf.fillStyle.color = createCol;
		this.UICreateGraphConf.lineStyle.color = createCol;
		this.UICreateLabelGraphConf.fillStyle.color = createCol;
		this.UICreateLabelGraphConf.lineStyle.color = createCol;

		//create
		this.UIEditGraphConf = Phaser.Utils.Objects.DeepCopy(modeUIGraphConf);
		this.UIEditLabelGraphConf =
			Phaser.Utils.Objects.DeepCopy(modeLabelGraphConf);
		//edit
		this.UIEditGraphConf.fillStyle.color = editCol;
		this.UIEditGraphConf.lineStyle.color = editCol;
		this.UIEditLabelGraphConf.fillStyle.color = editCol;
		this.UIEditLabelGraphConf.lineStyle.color = editCol;

		//create
		this.UISaveGraphConf = Phaser.Utils.Objects.DeepCopy(modeLabelGraphConf);
		//edit
		this.UISaveGraphConf.fillStyle.color = saveCol;
		this.UISaveGraphConf.fillStyle.alpha = saveA;
		this.UISaveGraphConf.lineStyle.color = saveCol;
		this.UISaveGraphConf.lineStyle.alpha = saveA;

		/**
		 * cam config
		 * @type {Phaser.Types.GameObjects.Graphics.Options}
		 */
		this.worldGraphConf = {
			x: 0,
			y: 0,
			lineStyle: {
				alpha: 0.7,
				color: "0xffff00",
				width: 3,
			},
		};

		//#endregion
		//#region other config

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
			backCol: "0x828282",
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

		//#endregion
		//#region input

		/**
		 * input
		 */
		this.inputKeys = {
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

			//create
			/** @type {Phaser.Input.Keyboard.Key} */
			worldVertClose: Phaser.Input.Keyboard.KeyCodes.CTRL,

			//edit

			worldEditUnselect: Phaser.Input.Keyboard.KeyCodes.ESC,
			worldEditDelete: Phaser.Input.Keyboard.KeyCodes.DELETE,

			//#endregion
			//#region UI

			/** @type {Phaser.Input.Keyboard.Key} */
			UISwitchModes: Phaser.Input.Keyboard.KeyCodes.TAB,

			//#endregion
		};
		this.inputKeys = this.scene.input.keyboard.addKeys(
			this.inputKeys,
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
		//#region world general

		this.worldGraph = this.scene.add.graphics(this.worldGraphConf);

		//#endregion world general
		//#region world vert create

		/**
		 * array of vec2 for object vertecie creation
		 * @type {Phaser.Math.Vector2[]}
		 */
		this.worldVertList = new Array();

		//#endregion world vert create
		//#region world select obj

		/**
		 * the selected world Object
		 * @type {Phaser.GameObjects.GameObject}
		 */
		this.worldObjSelected;

		/**
		 * selectable types of objects
		 * @type {Phaser.Physics.Matter.Image[] | Phaser.Physics.Matter.Sprite[]}
		 */
		this.worldSelectableList = [CollisionInstance];

		// /**
		//  * @type {MatterJS.ConstraintType}
		//  */
		// this.PointerConstraint = this.scene.matter.add.pointerConstraint({
		// 	label: "LevelEditorPointerConstraint",
		// 	length: 0,
		// 	stiffness: 1,
		// 	render: true,
		// });

		//#endregion world select obj

		if (bool != undefined) {
			this.toggle(bool);
		} else {
			this.toggle(true);
		}

		//#region UI creation

		/**
		 * @type {UIConfig}
		 */
		let UIconfig = {
			marginApplyNoParent: false,
			margin: 2,
			padding: 2,
		};
		let UIAssetGridconfig = {
			marginApplyNoParent: false,
			margin: 0,
			padding: 0,
		};

		let w = this.displayWidth / this.scaleX;
		let h = this.displayHeight / this.scaleY;
		let rp_w = 200;
		let rp_h = h;
		let rp_x = w - rp_w;
		let rp_y = 0;

		//header
		let header_x = 0;
		let header_y = 0;
		let header_w = w - rp_w;
		let header_h = 20;

		//inspector
		let StateButton_h = 30;
		let StateButton_w = 0.5;

		let button_w = 0.5;
		let button_h = 30;

		//heading
		this.Label = this.UILabelCreate(
			this,
			"UILabelEditorActive",
			this.depth,
			header_x,
			header_y,
			header_w,
			header_h,
			UIconfig,
			0.5,
			0.5,
			"Level Editor Active",
			this.UILabelgraphConf,
			this.textConf,
			true,
			true
		);

		//#region right panel

		this.RightPanel = this.UIPanelCreate(
			this,
			"RightPanel",
			this.depth,
			rp_x,
			rp_y,
			rp_w,
			rp_h,
			UIconfig,
			this.UIBackGraphConf,
			true,
			true
		);

		this.CreateButton = this.UIButtonCreate(
			this.RightPanel,
			"CreateButton",
			this.depth,
			undefined,
			undefined,
			StateButton_w,
			StateButton_h,
			UIconfig,
			0.5,
			0.5,
			"Create",
			this.UICreateLabelGraphConf,
			this.textConf,
			this.interConf,
			"pointerdown",
			"switch",
			true,
			true
		);

		this.CreateButton.on(
			"switch",
			function () {
				this.modeSwitch(LEVELEDITORMODES.mode_create);
			},
			this
		);

		this.EditButton = this.UIButtonCreate(
			this.RightPanel,
			"EditButton",
			this.depth,
			this.CreateButton,
			undefined,
			StateButton_w,
			StateButton_h,
			UIconfig,
			0.5,
			0.5,
			"Edit",
			this.UIEditLabelGraphConf,
			this.textConf,
			this.interConf, //this.interConf  undefined
			"pointerdown",
			"switch",
			true,
			true
		);

		this.EditButton.on(
			"switch",
			function () {
				this.modeSwitch(LEVELEDITORMODES.mode_edit);
			},
			this
		);

		//#region save

		this.SaveButton = this.UIButtonCreate(
			this.RightPanel,
			"EditButton",
			this.depth,
			undefined,
			-30,
			undefined,
			undefined,
			UIconfig,
			0.5,
			0.5,
			"Save",
			this.UISaveGraphConf,
			this.textConf,
			this.interConf, //this.interConf  undefined
			"pointerdown",
			"SaveButtonPress",
			true,
			true
		).on(
			"SaveButtonPress",
			function (a, b, c, d, e) {
				console.log("a,b,c,d,e: ", a, b, c, d, e);
				this.UISaveInteraction();
			},
			this
		);

		//#endregion save
		//#region create panel

		this.CreatePanel = this.UIPanelCreate(
			this.RightPanel,
			"CreatePanel",
			this.depth,
			undefined,
			this.CreateButton,
			undefined,
			this.SaveButton,
			UIconfig,
			this.UICreateGraphConf,
			true,
			true
		);

		//#region collider button

		this.CreateColliderButton = this.createRecourceButton(
			this.CreatePanel,
			"CreateColliderButton",
			this.depth,
			undefined,
			undefined,
			button_w,
			button_h,
			UIconfig,
			0.5,
			0.5,
			"object",
			"collider",
			this.UICreateGraphConf,
			this.textButtonConf,
			this.interConf
		);

		//#endregion collider button
		//#region zone button

		this.CreateZoneButton = this.createRecourceButton(
			this.CreatePanel,
			"CreateZoneButton",
			this.depth,
			this.CreateColliderButton,
			undefined,
			button_w,
			button_h,
			UIconfig,
			0.5,
			0.5,
			"object",
			"zone",
			this.UICreateGraphConf,
			this.textButtonConf,
			this.interConf
		);

		//#endregion zone button
		//#region asset grid

		this.CreateAssetGrid = this.UIPanelCreate(
			this.CreatePanel,
			"CreateAssetGrid",
			this.depth,
			undefined,
			this.CreateColliderButton,
			undefined,
			undefined,
			UIAssetGridconfig,
			this.UICreateGraphConf,
			true,
			true
		);

		this.gridConf = {
			//list
			/** @type {UIConfig} */
			list_config: {
				margin: 0,
				padding: 0,
			},
			list_rowNum: 2,

			//headr
			/** @type {UIConfig} */
			header_config: {
				margin: 0,
				padding: 0,
			},
			header_h: 25,

			//entry

			/** @type {UIConfig} */
			entry_config: {
				margin: 3,
				padding: 0,
			},
			/** @type {Phaser.Types.GameObjects.Graphics.Options} */
			entry_graphconfig: {
				fillStyle: {
					color: "0x000000",
					alpha: 0.2,
				},
			},
			/** @type {Phaser.Types.GameObjects.Text.TextStyle} */
			entry_textconfig: {
				fontSize: 10,
			},
			entry_scale: 0.9,
		};

		this.gridConf.entry_textconfig = this.UIConfigMergeOverwrite(
			this.textButtonConf,
			this.gridConf.entry_textconfig
		);
		this.gridConf.entry_graphconfig = this.UIConfigMergeOverwrite(
			this.UICreateGraphConf,
			this.gridConf.entry_graphconfig
		);

		//#endregion asset grid

		//#endregion create panel
		//#region edit panel

		this.EditPanel = this.UIPanelCreate(
			this.RightPanel,
			"EditPanel",
			this.depth,
			undefined,
			undefined,
			undefined,
			this.SaveButton,
			UIconfig,
			this.UIEditGraphConf,
			true,
			true
		);

		//#endregion edit panel

		//#endregion right panel

		//#endregion UI creation
		//#region modes

		/**
		 * the level editor state, UI state
		 * @type {mode}
		 */
		this.state;
		this.modeLeaveAll(LEVELEDITORMODES.mode_create, false);
		this.modeSetupModeListener(this.modeCheck(), true);

		//#endregion

		this.datgui = new GUI({
			hideable: true,
			name: "LevelEditorDatGUI",
			closeOnTop: false,
		});

		console.log("//////////// level editor created ////////////");
	}

	update(time, delta) {
		//use accumulator
		this.fixedUpdateCall(time, delta);

		//parent update
		super.update(time, delta);
	}

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
	fixedUpdate(time, delta, executesLeft, looseDelta) {
		//END OF FIXED UPDATE CHAIN
		// super.fixedUpdate(time, delta);

		this.camera_update();
	}

	/**
	 * toggles or set debug
	 * @param {boolean | undefined} bool boolean to set or undefined
	 */
	toggle(bool) {
		if (bool == undefined) {
			bool = !this.active;
		} else {
			if (this.active == bool) {
				console.log(
					"TOGGLE - Object ",
					this.name,
					" already in this state: ",
					this.active,
					"!"
				);
				return;
			}
		}

		// this.PointerConstraint.

		this.enable(bool);

		this.cameraActivate(this.active);
		this.inputManageMyLIsteners(this.active);
	}

	//#region ui

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean} if point is on UI
	 */
	pointOnUI(x, y) {
		return (
			this.RightPanel.x < x &&
			x < this.RightPanel.x + this.RightPanel.width &&
			this.RightPanel.y < y &&
			y < this.RightPanel.y + this.RightPanel.height
		);
	}

	//#endregion
	//#region modes

	//#region general
	/**
	 * @param {mode | undefined} mode mode to switch to, undefined will witch through the modes
	 */
	modeSwitch(mode) {
		//old mode and leaving it
		let oldMode = this.state;
		this.modeLeave(oldMode, true);

		//new mode
		if (mode != undefined) {
			this.modeSetTo(mode, true);
		} else {
			this.modeSetTo(
				LEVELEDITORMODES.modeArr[
					(LEVELEDITORMODES.modeArr.findIndex((mode) => mode === this.state) +
						1) %
						LEVELEDITORMODES.modeArr.length
					// (LEVELEDITORMODES.modeArr.indexOf(mode) + 1) %
					// 	LEVELEDITORMODES.modeArr.length
				],
				true
			);
		}

		console.log(
			"MODE - from: ",
			oldMode.description,
			" to ",
			this.state.description
		);
	}

	/**
	 * check if the mode provided is the current mode.
	 * if undefined returns the current mode
	 * @param {LEVELEDITORMODES.mode | undefined} modeToCheck
	 */
	modeCheck(modeToCheck) {
		if (modeToCheck != undefined) {
			return modeToCheck == this.state;
		} else {
			return this.state;
		}
	}

	/**
	 *
	 * @param {mode} mode
	 * @param {boolean} bool
	 */
	modeSetupModeListener(mode, bool) {
		console.log("MODE - listeners for: ", mode.description, " set to: ", bool);

		switch (mode) {
			case LEVELEDITORMODES.mode_create:
				this.modeCreateSetupListeners(bool);
				break;
			case LEVELEDITORMODES.mode_edit:
				this.modeEditSetupListeners(bool);
				break;

			default:
				break;
		}
	}
	//#endregion general
	//#region internal

	/**
	 *
	 * @param {mode} mode
	 * @param {boolean} listeners should listeners be updated
	 */
	modeSetTo(mode, listeners) {
		console.log("MODE - set to: ", mode.description);

		this.state = mode;
		this.modeEnter(mode, listeners);
	}

	/**
	 * use modeSwitch if you can,
	 * this is mostly for interal use.
	 * @param {mode} mode mode to perform enter actions for
	 * @param {boolean} listeners should listeners be updated
	 */
	modeEnter(mode, listeners) {
		console.log("MODE - entering mode: ", mode.description);

		switch (mode) {
			case LEVELEDITORMODES.mode_create:
				//UI
				this.CreatePanel.enable(true);

				break;
			case LEVELEDITORMODES.mode_edit:
				//UI
				this.EditPanel.enable(true);

				break;

			default:
				break;
		}

		if (listeners) this.modeSetupModeListener(mode, true);
	}

	/**
	 * use modeSwitch if you can,
	 * this is mostly for interal use.
	 * @param {mode} mode mode to perform exit actions for
	 * @param {boolean} listeners should listeners be updated
	 */
	modeLeave(mode, listeners) {
		console.log("MODE - leaving mode: ", mode.description);

		switch (mode) {
			case LEVELEDITORMODES.mode_create:
				//UI
				this.CreatePanel.enable(false);
				this.worldVertReset();

				break;
			case LEVELEDITORMODES.mode_edit:
				//UI

				this.EditPanel.enable(false);
				this.worldUnselect();

				//world interaction

				break;

			default:
				break;
		}

		if (listeners) this.modeSetupModeListener(mode, false);
	}

	/**
	 * leave all modes.
	 * Optionally stay or enter one mode
	 * @param {mode | undefined} but leave aall but this mode
	 * @param {boolean} listeners should listeners be updated
	 */
	modeLeaveAll(but, listeners) {
		let mode;
		let arr = LEVELEDITORMODES.modeArr;
		for (let index = 0; index < arr.length; index++) {
			mode = arr[index];

			if (mode != but) {
				this.modeLeave(mode, listeners);
			}
		}

		if (!this.modeCheck(but)) {
			this.modeSetTo(but, listeners);
		}
	}

	modeSetupListeners(bool) {
		if (bool) {
			//tab awitch
			this.inputKeys.UISwitchModes.on(
				"down",
				function () {
					this.modeSwitch();
				},
				this
			);
		} else {
			//tab awitch
			this.inputKeys.UISwitchModes.removeListener("down", undefined, this);
		}
	}

	//#endregion

	//#endregion modes
	//#region create

	modeCreateSetupListeners(bool) {
		//manache world vert setup

		this.worldVertSetup(bool);

		if (bool) {
		} else {
		}
	}

	//#region vertecies object

	/** activate or deactivate the vertecy world drawing system */
	worldVertSetup(bool) {
		if (bool) {
			//////pointer//////
			//clicking, drawing poly walls and selecting them
			this.scene.input.on(
				"pointerdown",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					// console.log("Level Editor World Input pointerdown");
					if (!this.pointOnUI(pointer.x, pointer.y)) {
						if (pointer.leftButtonDown()) {
							this.worldVertAdd(this.pointer.positionToCamera(this.CamEditor));
						}
						if (pointer.rightButtonDown()) {
							this.worldVertRemove();
						}
					}
				},
				this
			);

			//mouse move, updating line to mouse
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
					}
				},
				this
			);

			//////keyboard//////
			//closing poly
			this.inputKeys.worldVertClose.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldVertEnd(false);
				},
				this
			);
		} else {
			//////pointer//////
			//clicking, drawing poly walls and selecting them
			this.scene.input.removeListener("pointerdown", undefined, this);

			//mouse move, updating line to mouse
			this.scene.input.removeListener("pointermove", undefined, this);

			//////keyboard//////
			//closing poly
			this.inputKeys.worldVertClose.removeListener("down", undefined, this);
		}
	}

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
				if (leng <= 2) value = 1;
			case 1:
				if (leng <= 1) value = 2;
		}

		switch (value) {
			case 0: {
				//do all but last vertex

				let x1 = this.worldVertList[0].x;
				let y1 = this.worldVertList[0].y;

				let element;

				for (let index = 1; index <= leng - 2; index++) {
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
				//to mouse
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

			this.scene.mapObjCreate_Collision(this.worldVertList, true);
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
	//#region menu interaction

	/**
	 *
	 * @param {UIObj} parent
	 * @param {string} namePrefix namePrefix + "_" + type + "_" + key
	 * @param {number} depth
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {UIConfig} UiConfig
	 * @param {number} posH
	 * @param {number} posV
	 * @param {string} type
	 * @param {string} key
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphconfig
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} textconfig
	 * @param {Phaser.Types.Input.InputConfiguration} interConf
	 */
	createRecourceButton(
		parent,
		namePrefix,
		depth,
		x,
		y,
		w,
		h,
		UiConfig,
		posH,
		posV,
		type,
		key,
		graphconfig,
		textconfig,
		interConf
	) {
		let button = this.UIButtonCreate(
			parent,
			namePrefix + "_" + type + "_" + key,
			depth,
			x,
			y,
			w,
			h,
			UiConfig,
			posH,
			posV,
			key,
			graphconfig,
			textconfig,
			interConf,
			"pointerdown",
			"RecourceButtonTrigger",
			true,
			true
		).on("RecourceButtonTrigger", this.interactionRecource, this);

		button.recourceKey = key;
		button.recourceType = type;

		switch (type) {
			case "image":
				let image = new Phaser.GameObjects.Image(
					this.scene,
					button.width / 2,
					0,
					key,
					undefined
				);
				image.setOrigin(0.5, 0.3);
				image.setPosition(
					button.width * image.originX,
					button.height * image.originY
				);
				image.setScale(
					(Math.min(button.width, button.height) /
						Math.max(image.width, image.height)) *
						this.gridConf.entry_scale
				);

				button.add(image);

				button.moveAbove(button.UI_Label_text, image);
				break;
			case "object":

			default:
				console.log(
					"recource button type hasnt been fully impemented: ",
					type,
					key
				);
				break;
		}

		return button;
	}

	interactionRecource(pointer, relX, relY, stopPropagation, obj) {
		// button.recourceKey = key;
		// button.recourceType = type;
		switch (obj.recourceType) {
			case "image":
				console.log("image: ", obj.recourceType, obj.recourceKey);

				break;
			case "object":
				console.log("object: ", obj.recourceType, obj.recourceKey);

				break;

			default:
				console.log(
					"recource button type not supported, contact admin: ",
					obj.recourceType,
					obj.recourceKey
				);
				break;
		}
	}

	//#endregion menu interaction
	//#region asset grid

	/**
	 *
	 *
	 */
	AssetGridBuild() {
		this.assets.map.forEach(this.AssetGridAddList, this);
	}

	/**
	 * @param {string[]} list
	 * @param {string} type type of recource
	 *
	 */
	AssetGridAddList(list, type) {
		let nameprefix = "UIAsset_" + type + "_";

		let assetGrid = this.UIPanelCreate(
			this.CreateAssetGrid,
			nameprefix + "Panel",
			this.CreateAssetGrid.depth,
			undefined,
			undefined,
			undefined,
			undefined,
			this.gridConf.list_config,
			this.UICreateGraphConf,
			true,
			true
		);

		let assetGridLabel = this.UILabelCreate(
			assetGrid,
			nameprefix + "Label",
			this.CreateAssetGrid.depth,
			undefined,
			undefined,
			undefined,
			this.gridConf.header_h,
			{ margin: 0, padding: 0 },
			0.5,
			0.5,
			"type - " + type,
			this.UICreateGraphConf,
			this.textConf,
			true,
			true
		);

		let asset_height =
			assetGrid.UIE_getInnerHeight() -
			(this.assets.typeNum *
				(this.gridConf.header_h +
					UIElement.UIE_configGetMargin(this.gridConf.header_config, 3, 0) +
					UIElement.UIE_configGetMargin(this.gridConf.header_config, 1, 0) +
					UIElement.UIE_configGetPadding(this.gridConf.header_config, 3, 0) +
					UIElement.UIE_configGetPadding(this.gridConf.header_config, 1, 0) +
					UIElement.UIE_configGetMargin(this.gridConf.list_config, 3, 0) +
					UIElement.UIE_configGetMargin(this.gridConf.list_config, 1, 0) +
					UIElement.UIE_configGetPadding(this.gridConf.list_config, 3, 0) +
					UIElement.UIE_configGetPadding(this.gridConf.list_config, 1, 0))) /
				this.assets.number;

		let leng = list.length;

		Math.ceil(leng / this.gridConf.list_rowNum);

		//go through list and create an asset entry for every asset in list
		let y_base = assetGridLabel.UIE_getOutterY2(false);
		let x = 0;
		let y = assetGridLabel;

		let winc = assetGrid.UIE_getInnerWidth() / this.gridConf.list_rowNum;
		let hinc = Math.min(winc, asset_height);

		let w = 1 / this.gridConf.list_rowNum;
		let h = hinc;
		let entry = 0;
		for (let index = 0; index < leng; index++) {
			x = (index % this.gridConf.list_rowNum) * winc;
			y = y_base + Math.floor(index / this.gridConf.list_rowNum) * hinc;

			entry = this.createRecourceButton(
				assetGrid,
				"gridEntry",
				this.CreateAssetGrid.depth,
				x,
				y,
				w,
				h,
				this.gridConf.entry_config,
				0,
				1,
				type,
				list[index],
				this.gridConf.entry_graphconfig,
				this.gridConf.entry_textconfig,
				this.interConf,
				true,
				true
			);
		}

		//rresizinh list
		assetGrid.UIE_setSize(undefined, y + h);
	}

	//#endregion

	//#endregion create
	//#region edit

	modeEditSetupListeners(bool) {
		if (bool) {
			//////pointer//////

			// clicking, drawing poly walls and selecting them
			this.scene.input.on(
				"pointerdown",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					// console.log("mode edit mouse objs: ", intObjects);

					if (!this.pointOnUI(pointer.x, pointer.y)) {
						if (intObjects.length >= 1) {
							this.worldSelect(intObjects);
						} else {
							this.worldUnselect(false);
						}
					}
				},
				this
			);

			// mouse move, updating line to mouse
			this.scene.input.on(
				"pointermove",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					// draw line from vert to pointer
					// console.log("Level Editor World Input pointermove");

					if (this.worldObjSelected != undefined) {
						if (this.worldObjSelected.input.dragState == 2)
							this.worldObjHighlight();
					}
				},
				this
			);

			//////keyboard//////
			// unselecting
			this.inputKeys.worldEditUnselect.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldUnselect();
				},
				this
			);
			//deleting objs
			this.inputKeys.worldEditDelete.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.modeEditDelete();
				},
				this
			);
		} else {
			//////pointer//////
			//clicking
			this.scene.input.removeListener("pointerdown", undefined, this);

			// mouse move, updating line to mouse
			this.scene.input.removeListener("pointermove", undefined, this);

			//////keyboard//////
			// unselecting
			this.inputKeys.worldEditDelete.removeListener("down", undefined, this);
			// deleting objs
			this.inputKeys.worldEditUnselect.removeListener("down", undefined, this);
		}
	}

	/**
	 * deletes the selectedd object
	 * @param {Phaser.GameObjects.GameObject} obj
	 */
	modeEditDelete() {
		this.worldUnselect(true);
	}

	//#region selecting a obj

	/**
	 * selecting an object
	 * @param {Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]} objs
	 */
	worldSelect(objs) {
		let select;

		//#region check for new

		if (Array.isArray(objs)) {
			if (objs.length == 1) {
				if (
					objs[0] != this.worldObjSelected &&
					this.worldObjCheckCanBeSelceted(objs[0])
				) {
					select = objs[0];
				}
			} else {
				let obj;
				for (let index = 0; index < objs.length; index++) {
					obj = objs[index];

					if (this.worldObjCheckCanBeSelceted(obj)) {
						select = obj;
						break;
					}
				}
			}
		} else {
			if (
				objs != this.worldObjSelected &&
				this.worldObjCheckCanBeSelceted(objs)
			) {
				select = objs;
			}
		}

		//#endregion

		//nothing could be selected
		if (select == undefined) return;

		//unselecting old
		if (this.worldObjSelected != undefined) {
			this.worldUnselect();
		}

		//selected obj saved
		this.worldObjSelected = select;
		console.log("New Obj selected: ", this.worldObjSelected.name);

		//check for non implementation

		//select obj
		this.worldObjSelectAll(this.worldObjSelected, true, false);

		this.worldObjHighlight();
	}
	/**
	 * unselecting the object(s) in this.worldObjSelected.
	 * @param {boolean | undefined} deleteObj should delete? default false.
	 */
	worldUnselect(deleteObj) {
		if (deleteObj == undefined) deleteObj = false;

		if (this.worldObjSelected != undefined) {
			//unselect all
			this.worldObjSelectAll(this.worldObjSelected, false, deleteObj);

			this.worldGraph.clear();
			this.worldObjSelected = undefined;
		}
	}

	/**
	 * internally used by worldUnselect
	 * goes through an array and unselects ALL
	 * @param {Phaser.GameObjects.GameObject[] | Phaser.GameObjects.GameObject} objs
	 * @param {boolean} bool select or unselect
	 * @param {boolean} deleteObj should delete?
	 */
	worldObjSelectAll(objs, bool, deleteObj) {
		if (Array.isArray(objs)) {
			for (let index = 0; index < objs.length; index++) {
				worldObjSelectAll(objs[index], bool, deleteObj);
			}
		} else {
			this.worldObjSelectOne(objs, bool, deleteObj);
		}
	}
	/**
	 * internally usedd by worldUnselect
	 * what needs to be done on one obj to unselect it
	 * @param {Phaser.GameObjects.GameObject} obj
	 * @param {boolean} bool
	 * @param {boolean} deleteObj should delete?
	 */
	worldObjSelectOne(obj, bool, deleteObj) {
		if (bool) {
			if (!(obj instanceof CollisionInstance)) {
				console.log(
					"Oh nooooo, semi implemented object type selected, the system doesnt support this"
				);
			}

			this.scene.input.setDraggable(obj, true);
		} else {
			this.scene.input.setDraggable(obj, false);

			if (deleteObj) {
				console.log("del????????");
				obj.destroy(false);
			}
		}
	}

	/**
	 * draw border around the obj
	 */
	worldObjHighlight() {
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

	worldObjCheckCanBeSelceted(obj) {
		let worldObjType;
		for (let index = 0; index < this.worldSelectableList.length; index++) {
			worldObjType = this.worldSelectableList[index];

			if (obj instanceof worldObjType) {
				// console.log("obj selectable: ", obj, worldObjType);
				return true;
			}
		}

		// console.log("no objs selectaable :(");
		return false;
	}

	//#endregion

	//#endregion edit
	//#region listeners general

	inputManageMyLIsteners(bool) {
		//world interaction

		this.modeSetupListeners(bool);
		//configure listeners for current mode
		this.modeSetupModeListener(this.modeCheck(), bool);

		if (bool) {
		} else {
		}
	}

	//#endregion
	//#region camera

	/**
	 *
	 * @param {number} delta delta
	 */
	camera_update(delta) {
		//applying camera controls
		this.cameraUpdateSpeed();
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

	/**
	 * updates camera speed depending on zoom
	 */
	cameraUpdateSpeed() {
		let spd = this.camConfig.speed / this.camControls.camera.zoom;

		this.camControls.speedX = spd;
		this.camControls.speedY = spd;
	}

	//#endregion
	//#region saving loading

	loadAssets() {
		this.scene.load.pack(this.assestsDataKey, "src/assets/EditorAssets.json");
		this.scene.load.start();

		//pack file complete
		this.scene.load.once(
			"filecomplete-packfile-" + this.assestsDataKey,
			function (key, type, data) {
				console.log("LEVELEDITOR load complete: ", key, type);

				let arr = data.all.files;
				for (let index = 0; index < arr.length; index++) {
					let file = arr[index];

					this.scene.load.once(
						"filecomplete-" + file.type + "-" + file.key,
						this.loadAssetComplete,
						this
					);
				}
			},
			this
		);

		//all complete
		this.scene.load.once("complete", this.loadComplete, this);
	}

	loadAssetComplete(key, type, data) {
		console.log("LEVELEDITOR load complete: ", key, type);

		//maintain asset list

		/** @type {string[]} */
		let list;
		if (this.assets.map.has(type)) {
			list = this.assets.map.get(type);
		} else {
			list = new Array();
			this.assets.map.set(type, list);
			this.assets.typeNum++;
		}

		list.push(key);
		this.assets.number++;
	}

	loadComplete(loader, totalComplete, totalFailed) {
		console.log("LEVELEDITOR load finished: ", totalComplete, totalFailed);

		console.log("assets: ", this.assets);
		this.AssetGridBuild();
	}

	UISaveInteraction() {
		console.log("SAVE BUTTON PRESS");

		let data = this.saveProcessList(this.scene.saveableList);

		this.scene.load.saveJSON(data, "levelData");
	}

	/**
	 * process all savable things in the scene
	 * @param {object[]} arr
	 * @return {object} jason object
	 */
	saveProcessList(arr) {
		let data = {
			collisionInstances: [],
		};
		/** @type {object} */
		let objInfo;
		/** @type {Array} */
		let dataList;

		// Phaser.Utils.Objects.

		//go through list and process
		let leng = arr.length;
		for (let index = 0; index < leng; index++) {
			objInfo = this.saveProcessObj(arr[index]);
			if (objInfo == undefined) continue;

			console.log("SAVE - objInfo - : ", objInfo);

			dataList = Phaser.Utils.Objects.GetValue(data, objInfo.type, undefined);
			dataList.push(objInfo.obj);
		}

		return data;
	}
	/**
	 * process all savable things in the scene
	 * @param {object} arr
	 * @return {{
	 * type: (string),
	 * obj: (object)
	 * }} information object
	 */
	saveProcessObj(obj) {
		//go through list and process

		// if (obj instanceof PLEASE GIVE BODY TYPE) {
		// 	//raw phy body
		// 	return {
		// 		type: "collisionInstances",
		// 		obj: {
		// 			vert: obj.vertices,
		// 		},
		// 	};
		// } else if (obj instanceof CollisionInstance) {
		// 	//interactive physics wall
		// 	return this.saveProcessObj(obj.body);
		// } else {
		// 	console.log("SAVE - obj could not be saved - no solution setup");
		// 	return undefined;
		// }

		if (obj instanceof CollisionInstance) {
			//interactive physics wall
			return this.saveProcessObj(obj.body);
		} else {
			console.log("SAVE - temporary saving solution");

			let data = {
				type: "collisionInstances",
				obj: {
					vert: [],
				},
			};
			obj.vertices.forEach((vec) => {
				data.obj.vert.push({
					x: vec.x,
					y: vec.y,
				});
			});

			return data;
		}
	}

	//#endregion saving loading
}

/** enum-like for modes/states the Level editor can be in */
class LEVELEDITORMODES {
	/**
	 * @typedef {symbol} mode a mode
	 */

	//#region other
	static modeArr = new Array();

	static modeAdd(modeName) {
		let mode = Symbol(modeName);
		LEVELEDITORMODES.modeArr.push(mode);
		return mode;
	}
	//#endregion other

	/**
	 * mode to edit, selectm, manipulate objects
	 * @type {mode}
	 */
	static mode_edit = LEVELEDITORMODES.modeAdd("modeEdit");
	/** modes to create new objects in
	 * @type {mode}
	 */
	static mode_create = LEVELEDITORMODES.modeAdd("modeCreate");
}
