import React, { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard";
import "./App.css";

const App = () => {
  /*
        x,y coords of peninsula (whether or not something is on peninsula)
        hexagons need x,y coords
        - graveyard vertices and # of gravestones (2-3)
        - final battleground vertex
        - player start vertices
        hexagons that are mana wells (dynamically chosen to be contentious=somewhere between both)
        player and AI movement direction (toward other player or closest mana well?)
        - starting Kaiju for each player
        A.I. Kaiju choices
        player conflict winner
        - graveyard respawn point (decrement gravestones) at player death
        - player movement speed
        Mana Pool polygons drawn between mana wells
        test whether player inside or outside his mana pool
    */
  return (
    <div className="App">
      <GameBoard />
    </div>
  );
};

export default App;
