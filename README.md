# Phaser Game (Name Pending)

look into the Sample project Readme.
run "npm start" in the terminal to start a live server

## LEVEL EDITOR

The Level Editor manual is in:
[Level Editor](src\Objects\Systems\LevelEditor_Manual.md)

## ASSET MANAGEMENT

1. ### json vs manual

   All assest should be loaded in by json files.
   The can be exceptions, especially for testing.

2. ### "files: []":

   everytime any kind of json structure has a "files" property it will hold assets.
   "files" is a built in system of phaser that recognizes all objects in the "files" list as assets add will process them according to their "type" property.
   for information on these types look at the [File Types in Phaser](node_modules\phaser\types\phaser.d.ts) Line: 63002.
   (Ctrl + G: to jump to a line by inuting the line number)

   if the data changes the section is nested in:
   Phaser > Types > Loader > FileTypes.

   if searching is not your thing and intellisense is fully funktional:
   this the files property will have an annotation that has a link to the Phaser FileTypes.
   `/** @type {Phaser.Types.Loader.FileTypes.PackFileSection} */ let obj = { files, } `

3. ### System explanation

   there are 4 types of asset json files, some specific to objects and some general:

   - "alwaysAssets.json":
     These assets are always loaded in on game boot (in the main menu atm).
     Assets in this file should always/most of the time be in use. F.e. The player sprite.
   - "EditorAssets.json":
     All assets that arent needed 100% of the time while the game is runnig will be here.
     This file will only be loaded when the level editor is present.
     That means not in the final game build.
     This is because the editor then has access to these assets and can place them in the game scene, asssociate them with zones and the game can dynamically load in assets when needed in the zone.
   - "zoneData.json":
     This holds zone data and the assets associated with the zones.
     This works with the zone system which can load in aassest dynamically as they are needed.

   - Object specific asset files:
     These follow no system rules.
     F.e. MainMenuAssets.json is for the Main Menu and gets loaded in by the Menu.

4. ### Where should I add my new assets?

   If the assets is uses in the world space (the game map) or enviroment, then putting them into the "EditorAssets.json" will be correct 90% of the time.
   If the asset cant be associated with a game zone, f.e. the player sprites,
   then they belong in "alwaysAssets.json".
   If the asset is for an object outside of the actual game level, then "alwaysAssets.json" would work but putting them into a object or system specific file would be better.
