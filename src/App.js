import React, { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard/GameBoard";
import "./App.css";

const App = () => {
  /*
        make a single event tick with useInterval at GameBoard level.
        hexagon pathing, a*
            player and a.i. movement direction (toward other player or closest mana well?)
                a.i. Kaiju choices (random)
                placement of Kaiju on board adjacent to player / newly-acquired mana well.
            player conflict winner
                player respawn from graveyard choices (top 5 farthest graveyards from end game point. of the 5, the farthest from the enemy player)
        final battleground vertex / "end game point"
            graveyard placement, breadth first search
        hexagons that are mana wells (random, but not adjacent to another mana well)
        mana wells / kaiju need to be sorted so that they form a non convex hull

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
