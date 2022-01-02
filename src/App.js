import React, { useState, useEffect } from "react";
import { Game } from "./Game/Game";
import { Tutorial } from "./Tutorial";

const App = () => {
  /*
        1. Determine class compliments for teammate so gameplay feels balanced.
        2. Why is a tile status missing on dmg sometimes?
        3. Why does the game slow down as the player plays?
        4. Clean up code.
        5. tutorial.
        6. home screen.
        7. Teleport and heal need css particle effect on characters.
    */
  return (
    <div className="App">
      <Game />
    </div>
  );
};
// <Tutorial />

export default App;
