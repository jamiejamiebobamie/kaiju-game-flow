import React from "react";
import { Home } from "./Home";
import "./App.css";

const App = () => {
  /*
        1. zIndex of gameboard pieces relative to flattened array index of i,j curr tile.
        2. Teammate AI going below board on tutorial screen 5.
    */
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
