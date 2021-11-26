import React, { Component } from "react";
import { HexagonTile } from "./HexagonTile";
import "./App.css";

const App = () => {
  const tiles = [];
  const rowLength = 25;
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < rowLength; j++) {
      tiles.push(<HexagonTile rowLength={rowLength} i={i} j={j} scale={0.5} />);
    }
  }
  return <div className="App">{tiles}</div>;
};

export default App;
