# Level Editor Manual

Manual for the Level editor

## Setup

Debug Manager can create a Level Editor automatically.

## Keybinds

### general:

`J`: toggle debug manager on/off and debug drawing.
`L`: toggle Level Editor on and off.
`EMTER`: Switch modes.

### camera:

`Arrow Keys`: move the edtors camera.
`mouse wheel, +, -`: zoom the camera in and out.
`BACKSPACE`: resets the zoom to default.

### modes:

`EMTER`: Switch modes.

#### Create

The recources loaded in from file are cathegorized by recource type.
The type will be displayed at the top of the list. F.e. "Image".

You can see the selected recource at the bottom, above the save button.
If no resource is selectedd it will display "NaN"

In many cases the first name displayed will consist of the type and the recource name, key or something similar.
This will take the form of : "Type: RecourceName"

type:

- image: creates an image object at the point of the mouse click.
- polygon: Creates a polygon, clicking to aadd one point and CTRL to complete the polygon

`CTRL`: Completes and creates the polygon.

#### Edit

`Mouse Button Down Left`: select object / deselect all objects

`Mouse Button Down Left + Mouse Move`: drag the object with the mouse to another position.
`DEL`: Delete selected object.
`INSERT`: Duplicate object.
`ESC`: deselect all objects.
`PAGE UP`: Rotate selected object left.
`PAGE DOWN`: Rotate selected object right.
