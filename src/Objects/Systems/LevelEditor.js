import { GUI } from "dat.gui";
import UIManager from "../UI/Abstract/UIManager";
import UIObj from "../UI/Abstract/UIObj";
import UIElement, { UIConfig } from "../UI/UIElement";
import CollisionInstance from "../WorldObjects/Dev/CollisionInstance";
import { ZONEDATA } from "../../scenes/SceneMainGame";
import ImageInteractive from "../WorldObjects/Dev/imageInteractive";

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
	 * @param {bool | undefined} active if active. default true
	 * @param {mode | undefined} editorMode mode to start in default, create
	 */
	constructor(name, scene, debugGroup, x, y, active, editorMode) {
		super(name, scene, 1000, x, y, undefined, true, true, undefined);

		//#region dat.gui

		this.datgui = new GUI({
			hideable: true,
			name: "LevelEditorDatGUI",
			closeOnTop: false,
		});

		this.datgui.levelEditor = this;
		this.datgui.folderArr = [];

		this.datGuiSelected = this.datGuiFolderCreate(this.datgui, "Selected Obj");
		this.datGuiSelected.open();

		//#endregion
		//#region loading

		this.assestsDataKey = "levelEditorAssets";
		this.assets = {
			number: 0,
			typeNum: 0,
			map: new Map(),
			dataMap: new Map(),
		};
		this.loadAssets();

		//#endregion
		//#region saving

		//#region saving

		/**
		 * list of all object to be saved
		 * @type {object[]}
		 */
		this.saveableList = new Array();

		//#endregion

		//#endregion
		//#region recources

		/**
		 * the type of recource selected
		 * @type {string}
		 */
		this.recourceType = RECOURCETYPES.NOTHING;
		/**
		 * sibject of the recource selection
		 * different types of recources have different subject types
		 * f.e. image => string sprite key, polygon => function to call with the polygon data
		 */
		this.recourceSubject;

		this.recourceDefaultText = "NaN";

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
				alpha: 1,
				color: "0xffff00",
				width: 3,
			},
			fillStyle: {
				alpha: 1,
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
			worldEditRotateLeft: Phaser.Input.Keyboard.KeyCodes.PAGE_UP,
			worldEditRotateRight: Phaser.Input.Keyboard.KeyCodes.PAGE_DOWN,

			//not implemented
			worldEditScaleUp: Phaser.Input.Keyboard.KeyCodes.HOME,
			worldEditScaleDown: Phaser.Input.Keyboard.KeyCodes.END,

			worldEditDuplicate: Phaser.Input.Keyboard.KeyCodes.INSERT,

			//#endregion
			//#region UI

			/** @type {Phaser.Input.Keyboard.Key} */
			UISwitchModes: Phaser.Input.Keyboard.KeyCodes.ENTER,

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

		this.worldGraph = this.scene.add
			.graphics(this.worldGraphConf)
			.setDepth(this.depth + 100);

		//#endregion world general

		//post world graph
		this.cameraActivate(true);

		//#region world vert create

		/**
		 * array of vec2 for object vertecie creation
		 * @type {Phaser.Math.Vector2[]}
		 */
		this.worldVertList = new Array();

		/**
		 * set method that uses the vertevies created
		 * @type {function}
		 */
		this.worldVertCallback;

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
		this.worldSelectableList = [CollisionInstance, ImageInteractive];

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

		let saveButton_h = 30;
		let recouceSelectLabel_h = 30;

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
			-saveButton_h,
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
			function () {
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

		this.CreateColliderButton = this.recourceButtonCreate(
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
			"collider",
			RECOURCETYPES.POLYGON,
			this.createCollisionObject,
			this.UICreateGraphConf,
			this.textButtonConf,
			this.interConf
		);

		//#endregion collider button
		//#region zone button

		this.CreateZoneButton = this.recourceButtonCreate(
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
			"zone",
			RECOURCETYPES.POLYGON,
			"zone",
			this.UICreateGraphConf,
			this.textButtonConf,
			this.interConf
		);

		//#endregion zone button

		//#region recouce select label

		this.recouceSelectLabel = this.UILabelCreate(
			this.CreatePanel,
			"recouceSelectLabel",
			this.depth,
			undefined,
			-recouceSelectLabel_h,
			undefined,
			undefined,
			UIconfig,
			0.5,
			0.5,
			this.recourceDefaultText,
			this.UICreateGraphConf,
			this.textConf,
			true,
			true
		);

		//#endregion recouce select label
		//#region asset grid

		this.CreateAssetGrid = this.UIPanelCreate(
			this.CreatePanel,
			"CreateAssetGrid",
			this.depth,
			undefined,
			this.CreateColliderButton,
			undefined,
			this.recouceSelectLabel,
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
			header_h: 20,

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
		this.state =
			// editorMode != undefined ? editorMode : LEVELEDITORMODES.mode_create;
			editorMode != undefined ? editorMode : LEVELEDITORMODES.mode_edit;
		this.modeLeaveAll(this.modeCheck());
		this.modeSetup(true);

		//#endregion

		this.enable(active);
		this.inputManageMyLIsteners(this.active);

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

		//mode
		console.log("here");
		this.modeSetup(this.active);
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
		this.modeSetupMode(oldMode, false);

		//new mode
		if (mode != undefined) {
			this.modeSetTo(mode);
		} else {
			this.modeSetTo(
				LEVELEDITORMODES.modeArr[
					(LEVELEDITORMODES.modeArr.findIndex((mode) => mode === this.state) +
						1) %
						LEVELEDITORMODES.modeArr.length
					// (LEVELEDITORMODES.modeArr.indexOf(mode) + 1) %
					// 	LEVELEDITORMODES.modeArr.length
				]
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
	 * @param {mode | undefined} modeToCheck
	 */
	modeCheck(modeToCheck) {
		if (modeToCheck != undefined) {
			return modeToCheck == this.state;
		} else {
			return this.state;
		}
	}

	//#endregion general
	//#region internal

	//#region system

	modeSetup(bool) {
		//general
		this.modeSetupListeners(bool);

		//mode specific
		this.modeSetupMode(this.modeCheck(), bool);
	}

	/**
	 * listeners for general mode input
	 * @param {boolean} bool
	 */
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

	//#endregion system
	//#region mode

	//setup

	/**
	 * INTERNAL
	 * enable or disaable mode properties
	 * @param {mode} mode mode to perform exit actions for
	 * @param {boolean} bool enable or disable
	 * @param {boolean} listeners should listeners be updated
	 */
	modeSetupMode(mode, bool) {
		switch (mode) {
			case LEVELEDITORMODES.mode_create:
				//UI panel
				this.CreatePanel.enable(bool);
				this.recourceSetup(this.recourceCheck(), bool, this.recourceSubject);

				if (bool) {
					//entering
				} else {
					//leaving
				}

				break;
			case LEVELEDITORMODES.mode_edit:
				//UI panel

				this.EditPanel.enable(bool);
				this.modeEditSetupListeners(bool);

				if (bool) {
					//entering
				} else {
					//leaving

					this.worldUnselect();
				}
				break;

			default:
				console.log("MODE - SETUP - UNKNOWN MODE: ", mode);
				return;
		}

		console.log("MODE - SETUP - mode: ", mode.description, ", to: ", bool);
	}

	//setting modes
	/**
	 * internal
	 * @param {mode} mode
	 * @param {boolean} listeners should listeners be updated
	 */
	modeSetTo(mode) {
		console.log("MODE - set to: ", mode.description);

		this.state = mode;
		this.modeSetupMode(mode, true);
	}

	/**
	 * leave all modes.
	 * Optionally stay or enter one mode
	 * @param {mode | undefined} but leave aall but this mode
	 * @param {boolean | undefined} listeners should listeners be updated
	 */
	modeLeaveAll(but) {
		console.log("MODE - Leave all, but: ", but.description, " - start");
		let mode;
		let arr = LEVELEDITORMODES.modeArr;
		for (let index = 0; index < arr.length; index++) {
			mode = arr[index];

			if (mode != but) {
				this.modeSetupMode(mode, false);
			}
		}

		if (!this.modeCheck(but)) {
			this.modeSetTo(but);
		}

		console.log("MODE - Leave all - end");
	}

	//#endregion mode

	//#endregion internal

	//#endregion modes
	//#region create

	//#region vertecies object

	/**
	 * activate or deactivate the vertecy world drawing system
	 * @param {boolean} bool
	 * @param {function} callback
	 */
	worldVertSetup(bool, callback) {
		if (bool) {
			//set callback function
			if (callback == undefined) {
				this.worldVertCallback = undefined;
			} else {
				this.worldVertCallback = callback;
			}

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
					this.worldVertEnd();
				},
				this
			);
		} else {
			this.worldVertCallback = undefined;
			this.worldVertReset();

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
	 *
	 */
	worldVertEnd() {
		if (this.worldVertList.length >= 3) {
			//create obj

			this.worldVertCallback(this.worldVertList);

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
	//#region point create

	pointCreateSetup(bool) {
		if (bool) {
			//////pointer//////
			//clicking, to place obj
			this.scene.input.on(
				"pointerdown",
				/**
				 * @param {Phaser.Input.Pointer} pointer
				 * @param {Phaser.GameObjects.GameObject[]} intObjects
				 */
				function (pointer, intObjects) {
					if (!this.pointOnUI(pointer.x, pointer.y)) {
						if (pointer.leftButtonDown()) {
							this.createImageObject(pointer.worldX, pointer.worldY);
						}
						if (pointer.rightButtonDown()) {
						}
					}
				},
				this
			);
		} else {
			//////pointer//////
			//click to place obj
			this.scene.input.removeListener("pointerdown", undefined, this);
		}
	}

	//#endregion

	//#region recources / menu interaction

	/**
	 *
	 * @param {UIObj} parent
	 * @param {string} namePrefix namePrefix + "_" + displayTxt
	 * @param {number} depth
	 * @param {number} x
	 * @param {number} y
	 * @param {number} w
	 * @param {number} h
	 * @param {UIConfig} UiConfig
	 * @param {number} posH
	 * @param {number} posV
	 * @param {string} displayTxt
	 * @param {string} type so far supports image, poly
	 * @param {any} subject
	 * @param {Phaser.Types.GameObjects.Graphics.Options} graphconfig
	 * @param {Phaser.Types.GameObjects.Text.TextStyle} textconfig
	 * @param {Phaser.Types.Input.InputConfiguration} interConf
	 */
	recourceButtonCreate(
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
		displayTxt,
		type,
		subject,
		graphconfig,
		textconfig,
		interConf
	) {
		let button = this.UIButtonCreate(
			parent,
			namePrefix + "_" + displayTxt,
			depth,
			x,
			y,
			w,
			h,
			UiConfig,
			posH,
			posV,
			displayTxt,
			graphconfig,
			textconfig,
			interConf,
			"pointerdown",
			"RecourceButtonTrigger",
			true,
			true
		).on("RecourceButtonTrigger", this.recourceButtonInteract, this);

		button.recourceSubject = subject;
		button.recourceType = type;

		switch (type) {
			case RECOURCETYPES.IMAGE:
				let image = new Phaser.GameObjects.Image(
					this.scene,
					button.width / 2,
					0,
					subject,
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
			case RECOURCETYPES.POLYGON:
				break;
			case "object":

			default:
				console.log(
					"RECOURCE BUTTON - button type hasnt been fully impemented - txt: ",
					displayTxt,
					", type: ",
					type,
					", subject: ",
					subject
				);
				break;
		}

		return button;
	}

	/**
	 * receives information from selected recource buttons
	 * @param {Phaser.Input.Pointer} pointer
	 * @param {number} relX
	 * @param {number} relY
	 * @param {function} stopPropagation
	 * @param {object} obj
	 * @returns
	 */
	recourceButtonInteract(pointer, relX, relY, stopPropagation, obj) {
		// button.recourceSubject = key;
		// button.recourceType = type;

		switch (obj.recourceType) {
			case RECOURCETYPES.IMAGE:
				break;
			case RECOURCETYPES.POLYGON:
				break;
			default:
				console.log(
					"recource button type not supported, contact admin: ",
					obj.recourceType,
					obj.recourceSubject
				);
				return;
		}

		this.recourceSelect(obj.recourceType, obj.recourceSubject);
	}

	/**
	 * return the current type, if a type is supplied will return if that is the current type
	 * @param {string | undefined} type
	 * @returns
	 */
	recourceCheck(type) {
		if (type == undefined) {
			return this.recourceType;
		} else {
			return type == this.recourceType;
		}
	}

	/**
	 * select new type, performs background stuff.
	 * If a type was previously selected it and its systems will be disabled
	 * @param {string} type so far supports image, poly
	 * @param {any} subject
	 */
	recourceSelect(type, subject) {
		//deactiovate old
		if (this.recourceType != RECOURCETYPES.NOTHING) {
			let oldtype = this.recourceType;
			this.recourceSetup(oldtype, false);
		}

		this.recourceType = type;
		this.recourceSubject = subject;

		//change label text
		this.recouceSelectLabel.UI_Label_setText(
			this.recourceSelectText(type, subject)
		);

		//activate new
		this.recourceSetup(this.recourceType, true, this.recourceSubject);
	}

	recourceUnselect() {
		//deactiovate new
		this.recourceSetup(this.recourceType, false);

		this.recourceType = undefined;
		this.recourceSubject = undefined;

		//change label text
		this.recouceSelectLabel.UI_Label_setText(this.recourceDefaultText);
	}

	/**
	 *
	 * @param {*} type
	 * @param {*} bool
	 * @param {any} subject
	 */
	recourceSetup(type, bool, subject) {
		switch (type) {
			// case RECOURCETYPES.IMAGE:
			// 	break;
			case RECOURCETYPES.POLYGON:
				this.worldVertSetup(bool, subject);
				break;
			case RECOURCETYPES.IMAGE:
				this.pointCreateSetup(bool);

				break;
			case RECOURCETYPES.NOTHING:
				break;
			default:
				console.log("RECOURCE SETUP - type not setup: ", type, bool);
				break;
		}
	}

	/**
	 *
	 * @param {string} type so far supports image, poly
	 * @param {any} subject
	 * @returns {string} text for label
	 */
	recourceSelectText(type, subject) {
		switch (type) {
			case RECOURCETYPES.IMAGE:
				return type + ": " + subject;
			case RECOURCETYPES.POLYGON:
				return type + ": " + subject.name;

			default:
				return this.recourceDefaultText;
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
			this.gridConf.header_config,
			0.5,
			0.5,
			"type - " + type,
			this.UICreateGraphConf,
			this.textConf,
			true,
			true
		);

		let asset_height =
			(this.CreateAssetGrid.UIE_getInnerHeight() -
				this.assets.typeNum *
					(assetGridLabel.UIE_getTotalHeight() +
						UIElement.UIE_configGetMargin(this.gridConf.list_config, 3, 0) +
						UIElement.UIE_configGetMargin(this.gridConf.list_config, 1, 0) +
						UIElement.UIE_configGetPadding(this.gridConf.list_config, 3, 0) +
						UIElement.UIE_configGetPadding(this.gridConf.list_config, 1, 0))) /
			Math.ceil(this.assets.number / this.gridConf.list_rowNum);

		//go through list and create an asset entry for every asset in list
		let y_base = assetGridLabel.UIE_getOutterY2(false);
		let x = 0;
		let y = assetGridLabel;

		let winc = assetGrid.UIE_getInnerWidth() / this.gridConf.list_rowNum;
		let hinc = Math.min(winc, asset_height);

		let w = 1 / this.gridConf.list_rowNum;
		let h = hinc;
		let entry = 0;
		let key;
		let leng = list.length;
		for (let index = 0; index < leng; index++) {
			x = (index % this.gridConf.list_rowNum) * winc;
			y = y_base + Math.floor(index / this.gridConf.list_rowNum) * hinc;

			key = list[index];

			entry = this.recourceButtonCreate(
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
				key,
				type,
				key,
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
	//#region creating

	/**
	 * creates a collision only object
	 * @param {Phaser.Math.Vector2} vecArr
	 * @returns {MatterJS.BodyType | CollisionInstance}
	 */
	createCollisionObject(vecArr) {
		return this.scene.mapObjCreate_Collision(true, vecArr);
	}

	/**
	 * creates a collision only object
	 * @param {Phaser.Math.Vector2} vecArr
	 * @returns {Phaser.GameObjects.Image | ImageInteractive}
	 */
	createImageObject(x, y) {
		return this.scene.mapObjCreate_Image(
			true,
			x,
			y,
			this.recourceSubject,
			undefined
		);
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
			//duplicate
			this.inputKeys.worldEditDuplicate.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldEditDuplicate();
				},
				this
			);

			//rotating
			this.inputKeys.worldEditRotateLeft.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldEditRotate(-1);
				},
				this
			);
			this.inputKeys.worldEditRotateRight.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldEditRotate(1);
				},
				this
			);
			//size
			this.inputKeys.worldEditScaleUp.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldEditScale(1);
					console.log("scalllle up");
				},
				this
			);
			this.inputKeys.worldEditScaleDown.on(
				"down",
				function () {
					// console.log("Level Editor World Input worldVertClose down");
					this.worldEditScale(-1);
					console.log("scalllle down");
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
			// duplicate
			this.inputKeys.worldEditDuplicate.removeListener("down", undefined, this);

			//rotating
			this.inputKeys.worldEditRotateLeft.removeListener(
				"down",
				undefined,
				this
			);
			this.inputKeys.worldEditRotateRight.removeListener(
				"down",
				undefined,
				this
			);
			//size
			this.inputKeys.worldEditScaleUp.removeListener("down", undefined, this);
			this.inputKeys.worldEditScaleDown.removeListener("down", undefined, this);
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
		console.log("New Obj selected: ", this.worldObjSelected);

		//check for non implementation

		//select obj
		this.worldObjSelectAll(this.worldObjSelected, true, false);

		this.worldObjHighlight();
		this.modeEditSelectGUISetup(true);
	}
	/**
	 * unselecting the object(s) in this.worldObjSelected.
	 * @param {boolean | undefined} deleteObj should delete? default false.
	 */
	worldUnselect(deleteObj = false) {
		if (this.worldObjSelected != undefined) {
			//unselect all
			this.worldObjSelectAll(this.worldObjSelected, false, deleteObj);

			this.worldGraph.clear();
			this.modeEditSelectGUISetup(false);
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
	worldObjSelectAll(objs, bool, deleteObj = false) {
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
	worldObjSelectOne(obj, bool, deleteObj = false) {
		if (bool) {
			switch (obj.type) {
				case RECOURCETYPES.OBJ_IMAGE:
					break;
				case RECOURCETYPES.OBJ_POLYGON:
					break;

				default:
					console.log(
						"Oh nooooo, semi implemented object type selected, the system doesnt support this"
					);
					break;
			}

			this.scene.input.setDraggable(obj, true);
		} else {
			this.scene.input.setDraggable(obj, false);

			if (deleteObj) {
				obj.destroy(false);
			}
		}
	}

	/**
	 * draw border around the obj
	 */
	worldObjHighlight() {
		this.worldGraph.clear();

		let obj = this.worldObjSelected;
		let geom = obj.input.hitArea;
		let objPosition = new Phaser.Math.Vector2(obj.x, obj.y);
		let objOrigin = new Phaser.Math.Vector2(
			obj.displayOriginX,
			obj.displayOriginY
		);

		//subtract origin from position
		objPosition.subtract(objOrigin);

		switch (obj.type) {
			case Phaser.GameObjects.Polygon.name:
				let localPoints = Phaser.Utils.Objects.DeepCopy(geom.points);
				// shift points by poly top left
				// let polyBoundBox = Phaser.Geom.Polygon.GetAABB(geom, undefined);
				// let boundTopLeft = new Phaser.Math.Vector2(
				// 	polyBoundBox.x,
				// 	polyBoundBox.y
				// );
				// this.scene.matter.vertices.translate(points, boundTopLeft, 1);

				this.scene.matter.vertices.rotate(localPoints, obj.rotation, objOrigin);
				this.scene.matter.vertices.scale(
					localPoints,
					obj.scaleX,
					obj.scaleY,
					objOrigin
				);

				this.scene.matter.vertices.translate(localPoints, objPosition, 1);

				this.worldGraph.strokePoints(localPoints, true);

				//temp

				break;
			case Phaser.GameObjects.Image.name:
				// obj.

				// obj.rotation = 2;

				// obj.x - obj.width;

				// let rec = new Phaser.Geom.Rectangle(
				// 	obj.x,
				// 	obj.y,
				// 	obj.width,
				// 	obj.height
				// );

				// console.log("log - rec: ", rec);

				// this.worldGraph.strokeRectShape(rec);

				break;
			default:
				console.log("what to highlight???");
				break;
		}

		//x,y
		this.worldGraph.fillCircle(obj.x, obj.y, 5);
		//orign
		this.worldGraph.strokeCircle(
			obj.x - obj.displayOriginX,
			obj.y - obj.displayOriginY,
			10
		);
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

	worldObjSelectRefresh() {
		this.worldObjSelected.refresh();
		this.worldObjHighlight();
	}

	//#endregion
	//edit

	worldEditRotate(mod) {
		if (
			this.worldObjSelected != undefined &&
			this.worldObjSelected.setAngle != undefined
		) {
			let power = 1;
			// this.worldObjSelected.rotation += (Phaser.Math.PI2 * 2) / (10 * mod);
			this.worldObjSelected.setAngle(this.worldObjSelected.angle + power * mod);

			this.worldObjSelectRefresh();
		}
	}

	worldEditScale(mod) {
		if (
			this.worldObjSelected != undefined &&
			this.worldObjSelected.setScale != undefined
		) {
			let power = 0.01;
			// this.worldObjSelected.rotation += (Phaser.Math.PI2 * 2) / (10 * mod);
			this.worldObjSelected.setScale(
				this.worldObjSelected.scaleX + power * mod
			);

			this.worldObjSelectRefresh();
		}
	}

	worldEditDuplicate() {
		console.log("insert");

		if (this.worldObjSelected != undefined) {
			console.log("log - this.worldObjSelected: ", this.worldObjSelected);
			console.log("eeeee", this.worldObjSelected.constructor);
		}
	}

	//#endregion edit
	//#region listeners general

	inputManageMyLIsteners(bool) {
		//world interaction

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
	//#region loading

	loadAssets() {
		this.scene.load.pack(this.assestsDataKey, "src/assets/EditorAssets.json");
		this.scene.load.start();

		//pack file complete
		this.scene.load.once(
			"filecomplete-packfile-" + this.assestsDataKey,
			this.loadAssetDataComplete,
			this
		);

		//all complete
		this.scene.load.once("complete", this.loadComplete, this);
	}

	loadAssetDataComplete(key, type, data) {
		//setp data
		// console.log("LEVELEDITOR load packfile complete: ", key, type, data);

		let list = data.all.files;
		let leng = list.length;
		let fileKey, fileType, file;
		for (let index = 0; index < leng; index++) {
			file = list[index];
			fileKey = file.key;
			fileType = file.type;

			this.assets.dataMap.set(fileKey, file);
			this.loadEnterAsset(fileKey, fileType);

			// switch (fileType) {
			// 	case RECOURCETYPES.IMAGE:
			// 		checkFunc = this.scene.textures;
			// 		break;
			// 	default:
			// 		checkFunc = Phaser.Utils.Objects.GetFastValue(
			// 			this.scene.cache,
			// 			fileType,
			// 			undefined
			// 		);
			// 	// console.log( "LEVELEDITOR - loadAssetDataComplete - unknown filetype in editor: ", fileKey, fileKey );
			// }

			// if (!checkFunc.exists(fileKey)) {
			// 	//setting up the individual sprite data load events
			// 	this.scene.load.once(
			// 		"filecomplete-" + fileType + "-" + fileKey,
			// 		this.loadEnterAsset,
			// 		this
			// 	);
			// } else {
			// 	this.loadEnterAsset(fileKey, fileType);
			// }
		}
	}

	loadEnterAsset(key, type, data) {
		// console.log("LEVELEDITOR load complete: ", key, type, data);

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
		// console.log("LEVELEDITOR load finished: ", totalComplete, totalFailed);

		this.AssetGridBuild();
	}

	//#endregion loading
	//#region saving

	UISaveInteraction() {
		console.log("SAVE BUTTON PRESS");

		let data = this.saveProcessList(this.saveableList);

		console.log("data to save: ", data);

		this.scene.load.saveJSON(data, "levelData");
	}

	/**
	 * process all savable things in the scene
	 * @param {object[]} arr
	 * @return {object} jason object
	 */
	saveProcessList(arr) {
		let data = Phaser.Utils.Objects.DeepCopy(ZONEDATA.DataDefault);
		let mapdata = data.mapData;
		let files = data.files;
		let depCollectList = [];

		/** @type {object} */
		let objInfo;
		/** @type {Array} */
		let dataList;

		//go through list and process
		let obj, objDependencies, dep;
		let leng = arr.length;
		for (let index = 0; index < leng; index++) {
			//process obj

			obj = arr[index];
			objInfo = this.saveProcessObj(obj);
			if (objInfo == undefined) continue;

			//workout dependencies
			objDependencies = obj.recourceDependency.list;
			if (objDependencies != undefined) {
				//go through obkject dependencies and all all new to collection list
				for (let index = 0; index < objDependencies.length; index++) {
					dep = objDependencies[index];
					if (depCollectList.indexOf(dep) == -1) depCollectList.push(dep);
				}
			}

			//pushes data onto respective list
			// dataList = Phaser.Utils.Objects.GetValue(
			dataList = Phaser.Utils.Objects.GetFastValue(
				mapdata,
				objInfo.type,
				undefined
			);
			dataList.push(objInfo.obj);
		}

		//add files from dependencies
		let recourceData, key;
		for (let index = 0; index < depCollectList.length; index++) {
			//get dependant recource and find associated data in the aassets storage
			//add the data to the daat that should be be saved
			key = depCollectList[index];
			recourceData = this.assets.dataMap.get(key);

			if (!recourceData)
				console.log(
					"SAVE - CANNOT RESOLVE RECOURCE DEPENDENCY - missing reference in LevelEditor recources: ",
					key
				);

			files.push(recourceData);
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
		switch (obj.type) {
			case RECOURCETYPES.OBJ_POLYGON:
				return ZONEDATA.data_collisionInstance(obj);
			case RECOURCETYPES.OBJ_IMAGE:
				return ZONEDATA.data_worldImage(obj);
			default:
				console.log("SAVE - object type couldnt be identified");
				break;
		}
	}

	//object

	/**
	 *
	 * @param {Phaser.GameObjects.GameObject} obj
	 */
	enableSaving(obj) {
		// console.log("SAVE - enableSaving of: ", obj.name);

		this.saveableList.push(obj);

		obj.on("destroy", this.savebleRemove, this);
	}

	/**
	 *
	 * @param {Phaser.GameObjects.GameObject} obj
	 */
	savebleRemove(obj) {
		let index = this.saveableList.indexOf(obj);
		if (index > -1) {
			this.saveableList.splice(index, 1);
			console.log("disabled saving :", obj.name);

			obj.removeListener("destroy", this.savebleRemove, this);
		}
	}

	//#endregion saving
	//#region object setup

	/**
	 *
	 * @param {*} obj
	 * @param {*} hitArea
	 * @param {*} hitAreaCallback
	 */
	objectSetup(obj, hitArea, hitAreaCallback) {
		this.interactiveSetup(obj, hitArea, hitAreaCallback);

		this.enableSaving(obj);

		this.objectRecourceSetup(obj);

		return obj;
	}

	/**
	 *
	 * @param {Phaser.GameObjects.GameObject} obj
	 */
	objectRecourceSetup(obj) {
		/**
		 * @type {Map}
		 */
		obj.recourceDependency = {
			/**
			 * list with dependencies
			 * @type {string[]}
			 */
			list: [],

			add: function (string) {
				if (this.list.indexOf(string) == -1) {
					this.list.push(string);
				}
			},
		};

		if (typeof obj.texture === "object") {
			obj.recourceDependency.add(obj.texture.key);
		} else if (typeof obj.texture === "string") {
			obj.recourceDependency.add(obj.texture);
		}

		// console.log("dependency setup", obj.name, obj.recourceDependency);
	}

	/**
	 * setup code for interactable world objects
	 * @param {Phaser.GameObjects.GameObject} obj
	 * @param {any} hitArea The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
	 * @param {Phaser.Types.Input.HitAreaCallback | undefined} hitAreaCallback
	 */
	interactiveSetup(obj, hitArea, hitAreaCallback) {
		/**
		 * interactive config
		 * @type {Phaser.Types.Input.InputConfiguration}
		 */
		let interactiveConfig = {
			hitArea: hitArea,
			hitAreaCallback: hitAreaCallback,
			pixelPerfect: false,
			draggable: false,
			useHandCursor: true,
		};

		let fallbackFunc = function () {
			console.log("OBJECT INTERACTIVE - fallback function for: ", this.name);
		};

		//setup
		obj.setInteractive(interactiveConfig);

		//start
		obj.on(
			"dragstart",
			/** @param {Phaser.Input.Pointer} pointer */
			function (pointer) {
				//#region moving
				//set to dynamic
				// this.setStatic(false);
				//#endregion

				console.log("drag start: ", this.name);
			},
			obj
		);
		//drag
		obj.on(
			"drag",
			/**
			 * @param {Phaser.Input.Pointer} pointer
			 * @param {number} dragX
			 * @param {number} dragY */
			function (pointer, dragX, dragY) {
				// this.setPosition(dragX, dragY);

				if (!this.scene.debug.levelEditor.pointOnUI(pointer.x, pointer.y)) {
					this.setPosition(dragX, dragY);
				}
				// this.scene.matter.body.translate(this.body, new Phaser.Math.Vector2(dragX, dragY));

				// console.log("drag: ", this.name);
			},
			obj
		);
		//end
		obj.on(
			"dragend",
			/** @param {Phaser.Input.Pointer} pointer */
			function (pointer) {
				//moving

				//set to saaved static
				// this.setStatic(this.saveStatic);

				this.refresh();
				console.log("drag end: ", this.name);
			},
			obj
		);

		//fallbacks
		if (obj.refresh == undefined) obj.refresh = fallbackFunc;
	}

	//#endregion
	//#region dat gui

	/**
	 *
	 * @param {GUI} parent
	 * @param {string} propName
	 * @returns {GUI} the folder
	 */
	datGuiFolderCreate(parent, propName) {
		let folder = parent.addFolder(propName);
		/**
		 * @type {GUI}
		 */
		folder.folderArr = [];
		parent.folderArr.push(folder);
		/**
		 * clears all folder children
		 */
		folder.clear = function () {
			let list = this.__controllers;

			while (list.length > 0) {
				this.remove(list[0]);
			}

			//folders
			list = this.folderArr;
			let leng = list.length;

			if (leng > 0) {
				let folder;
				for (let index = 0; index < leng; index++) {
					folder = list[index];
					this.removeFolder(folder);
				}
				this.folderArr = [];
			}
		};

		folder.levelEditor = this;

		return folder;
	}

	modeEditSelectGUISetup(bool) {
		if (bool && !(typeof this.worldObjSelected === "object")) return;
		// this.worldObjSelected
		// this.datGuiSelected
		let gui = this.datGuiSelected;

		//this.__gui.levelEditor.worldObjSelectRefresh();
		//this.__gui.levelEditor.worldObjSelected
		//this.__gui.levelEditor

		if (bool) {
			let refresh = function () {
				this.__gui.levelEditor.worldObjSelectRefresh();
			};

			let folder_general = this.datGuiFolderCreate(gui, "General");
			folder_general.open();

			let obj = this.worldObjSelected;

			folder_general.add(obj, "name").listen();
			folder_general.add(obj, "type").listen();


			folder_general.add(obj, "x").step(1).listen().onChange(refresh);
			folder_general.add(obj, "y").step(1).listen().onChange(refresh);

			folder_general
				.add(obj, "displayWidth")
				.step(1)
				.listen()
				.onChange(refresh);
			folder_general
				.add(obj, "displayHeight")
				.step(1)
				.listen()
				.onChange(refresh);

			folder_general.add(obj, "width").step(1).listen().onChange(refresh);
			folder_general.add(obj, "height").step(1).listen().onChange(refresh);

			folder_general.add(obj, "scaleX", 0.001).listen().onChange(refresh);
			folder_general.add(obj, "scaleY", 0.001).listen().onChange(refresh);

			folder_general.add(obj, "depth", -500, 500, 1).listen().onChange(refresh);
			folder_general.add(obj, "alpha", 0, 1, 0.01).listen().onChange(refresh);

			folder_general
				.add(obj, "rotation", -Math.PI, Math.PI, (Math.PI * 2) / 100)
				.listen()
				.onChange(refresh);
			folder_general.add(obj, "angle", -180, 180).listen().onChange(refresh);

			folder_general.add(obj, "originX", 0, 1, 0.01).listen().onChange(refresh);
			folder_general.add(obj, "originY", 0, 1, 0.01).listen().onChange(refresh);

			folder_general
				.add(obj, "scrollFactorX", -20, 20, 0.001)
				.listen()
				.onChange(refresh);
			folder_general
				.add(obj, "scrollFactorY", -20, 20, 0.001)
				.listen()
				.onChange(refresh);

			folder_general.add(obj, "visible", true).listen().onChange(refresh);

			switch (obj.type) {
				case RECOURCETYPES.OBJ_IMAGE:
					let folder_image = this.datGuiFolderCreate(gui, "Image");
					folder_image.open();

					//texture
					// obj.texture.__tempParentConnection = obj;
					folder_image.add(obj.texture, "key").listen();
					folder_image
						.add(
							obj.texture,
							"key",
							this.assets.map.get(obj.type.toLowerCase())
						)
						.listen()
						// .onFinishChange(obj.setTexture);
						.onFinishChange(function (value) {
							this.__gui.levelEditor.worldObjSelected.setTexture(value);
							this.__gui.levelEditor.worldObjSelectRefresh();
						});

					folder_image
						.addColor(obj, "tintTopLeft")
						.listen()
						.onChange(function (value) {
							obj.setTint(value);
						});

					break;
				case RECOURCETYPES.OBJ_POLYGON:
					break;

				default:
					break;
			}
		} else {
			gui.clear();
		}
	}

	//#endregion
}

/** enum-like for modes/states the Level editor can be in */
class LEVELEDITORMODES {
	/**
	 * @typedef {symbol} mode a mode
	 */
	//#region other
	/** @type {mode[]} */
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

/**
 * enum-like for recource types custon and phaser
 */
class RECOURCETYPES {
	/** identifier of the image recource
	 * @type {string}
	 */
	static IMAGE = "image";
	/** identifier of the CUSTOM polygon recource
	 * @type {string}
	 */
	static POLYGON = "polygon";
	/** identifier of the no recource
	 * @type {string}
	 */
	static NOTHING = undefined;

	//object

	/** identifier of the Object Instance for image recources polygon recource
	 * @type {string}
	 */
	static OBJ_IMAGE = "Image";
	/** identifier of the Object Instance for polygon recources polygon recource
	 * @type {string}
	 */
	static OBJ_POLYGON = "Polygon";
}
