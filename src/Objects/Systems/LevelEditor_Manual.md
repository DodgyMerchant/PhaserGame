

Manual for the Level editor

//////////////////////////////////////// Setup //////////////////////////////////////////////////

1. Object must be created in the scene


Debug Maanager can create a Level Editor automatically.

//////////////////////////////////////// Keybinds //////////////////////////////////////////////////


[Debug Scene Manager Exists]:{
  ["J"]: toggle debug manager on/off and debug drawing.
  ["L"]: toggle Level Editor on and off.
}

[Level Editor Active]:{
  
  Camera - {
    //controlling the camera

    [Arrow Keys]:         move the edtors camera.
    [mouse wheel, +, -]:  zoom the camera in and out.
    [BAACKSPACE]:         resets the zoom to default.
  }

  In scene Objects - {
    //editing and creating object in the scene

    creating collision objects - [In the scene]:{
      //create a collision object in the scene, from a set of points


      [Mouse Button Down Left]:   set a point to create a object from.
      [Mouse Button Down right]:  remove the last point.
      [CTRL]:                     create a object from the points set. Number of points must be >= 3.
    }

    manipulating - [On n object that set as interactable]:{
      //selecting moveing and manipulating objects

      [Mouse Button Down Left]:                 select a object.
      [Mouse Button Down Left]+[Mouse Move]:    drag the object with the mouse to another position.
    }
  }
}



Nice to know - {

  [Debug Scene Manager Exists] + [In the scene] + [Mouse Button Down Left] + [Mouse Move] + [any physics object]:
    drag the object around.
    buggy and not intentional.
    but can stay as long as its semi working
    will stop working after deactivating the level editor for the first time.
    might get removed.
}