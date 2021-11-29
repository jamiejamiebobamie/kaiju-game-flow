import React, { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard/GameBoard";
import "./App.css";

const App = () => {
  /*
        - x,y coords of peninsula (whether or not something is on peninsula)
        - hexagons need x,y coords
        hexagon pathing, a*
        graveyard placement, breadth first search
        - final battleground vertex
        - player start vertices
        hexagons that are mana wells (dynamically chosen to be contentious=somewhere between both)
        player and a.i. movement direction (toward other player or closest mana well?)
        - starting Kaiju for each player
        a.i. Kaiju choices
        player conflict winner
        - graveyard respawn point (decrement gravestones) at player death
        - player movement speed
        - mana pool polygons drawn between mana wells:
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#drawing_a_triangle
            https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
        - test whether player inside or outside his mana pool
        make a single event tick with useInterval at GameBoard level.
        pull up Player functional state and store in 'players' state variable at GameBoard level.
            pass down state to Player component
    */
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
};

export default App;
