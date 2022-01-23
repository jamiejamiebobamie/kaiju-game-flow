import React from "react";
import { Home } from "./Home";
import "./App.css";

const App = () => {
  /*
        1. Teleport and heal need css particle effect on characters.
        2. Teammate AI going below board on tutorial screen 5.
    */
  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
