import React, { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard/GameBoard";
import "./App.css";

const App = () => {
  /*
        1. kaijus only move if clicked on, and then stop moving when they get to the next tile.
                do not allow Kaiju to move to tiles that are adjacent to other Kaiju
        2. hexagon pathing, a*
                player and a.i. movement direction (toward other player or closest mana well?)
                    a.i. Kaiju choices (random)
                    placement of Kaiju on board adjacent to player / newly-acquired mana well.
                player conflict winner
                    player respawn from graveyard choices (top 5 farthest graveyards from end game point. of the 5, the farthest from the enemy player)
        3. object placement, breadth first search
                final battleground vertex / "end game point"
                    graveyard placement
                do not place mana wells adjacent to one another
        4. mana pool non-convex hulls
            new method to sort kaiju locations to create a non-convex hull (current method only works with 3 vertices)
        5. fix issue with NaN location values.

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
      <GameBoard />
    </div>
  );
};

export default App;
