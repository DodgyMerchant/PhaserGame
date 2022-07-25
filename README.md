# Phaser Game (Name Pending)

look into the Sample project Readme.
run "npm start" in the terminal to start a live server

## LEVEL EDITOR

The Level Editor manual is in:
[Level Editor](src\Objects\Systems\LevelEditor_Manual.txt)

## ASSET MANAGEMENT

all assest should be loaded in by json files.

1. "files: []":
   everytime any kind of json structure has a "files" property it will hold assets.
   "files" is a built in system of phaser that recognizes all objects in the "files" list as assets add will process them according to their "type" property.
   for information on these types look at the [File Types in Phaser](node_modules\phaser\types\phaser.d.ts) Line: 63002.
   (Ctrl + G: to jump to a line by inuting the line number)
   if the data changes the section is nested in:
   Phaser > Types > Loader > FileTypes.
   if searching is not your thing and intellisense is fully funktional:
   this the files property will have an annotation that has a link to the Phaser FileTypes.

   ``
   /\*\*

   - @type {Phaser.Types.Loader.FileTypes.PackFileSection}
     \*/
     let obj = {
     files,
     }
     ``

there are 4 types of asset json files, some specific to objects some general:

"alwaysAssets.json" : these assets are loaded in

"zoneData.json" :
