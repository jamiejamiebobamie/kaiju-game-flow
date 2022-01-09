import React, { useState, useEffect } from "react";
import { Game } from "./Game/Game";
import { Tutorial } from "./Tutorial";
import "./App.css";

const App = () => {
  /*
        1. Determine class compliments for teammate so gameplay feels balanced.
        2. Teleport and heal need css particle effect on characters.
        3. Design choose abilities modal.
        4. Why is a tile status missing on dmg sometimes?
        5. Why does the game slow down as the player plays?
        6. Clean up code.
        7. tutorial.
        8. home screen.
    */
  return (
    <div className="App">
      <Game />
    </div>
  );
};
// <Tutorial />

export default App;
