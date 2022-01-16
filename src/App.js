import React, { useState, useEffect } from "react";
import { Game } from "./Game/Game";
import "./App.css";

const App = () => {
  /*
        1. Determine class compliments for teammate so gameplay feels balanced.
        2. Teleport and heal need css particle effect on characters.
        3. Clean up code.
        4. home screen.
    */
  return (
    <div className="App">
      <Game />
    </div>
  );
};

export default App;
