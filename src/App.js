import React, { useState, useEffect } from "react";
import { Game } from "./Game";
import { Tutorial } from "./Tutorial";

const App = () => {
  /*
        1. home screen.
        2. teammate a.i.
        3. have smarter ai for teammate lightning power... (like a rook queen or bishop in chess)
        4. tutorial.
        5. Determine class compliments for teammate so gameplay feels balanced.
        6. Clean up code.

        - tileStatus updates.
        - make character move to the last tile on a path.
        - do a circular of icons around profile pic for activated passives
        - hover descriptions.
        - fix issue with NaN location values.
        - hexagon pathing
        - kaijus only move if clicked on, and then stop moving when they get to the next tile.
                - do not allow Kaiju to move to tiles that are adjacent to other Kaiju
        - make a single event tick with useInterval at GameBoard level.
        - mana wells / kaiju need to be sorted so that they form a non convex hull
        - x,y coords of peninsula (whether or not something is on peninsula)
        - hexagons need x,y coords
        - player start vertices
        - starting Kaiju for each player
        - graveyard respawn point (decrement gravestones) at player death
        - player movement speed
        - mana pool polygons drawn between mana wells:
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#drawing_a_triangle
            https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
        - test whether player inside or outside his mana pool
        - pull up Player functional state and store in 'players' state variable at GameBoard level.
            - pass down state to Player component
    */
  return (
    <div className="App">
      <Game />
    </div>
  );
};
// <Tutorial />

export default App;
