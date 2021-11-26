import React, { useState, useEffect } from "react";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";

import "./App.css";

const App = () => {
  /*
x,y coords of peninsula (whether or not something is on peninsula)
graveyard vertices and # of gravestones (2-3)
final battleground vertex
player start vertices
hexagons that are mana wells (dynamically chosen to be contentious=somewhere between both)
player and AI movement direction (toward other player or closest mana well?)
starting Kaiju for each player
A.I. Kaiju choices
player conflict winner
graveyard respawn point (decrement gravestones) at player death
player movement speed
Mana Pool polygons drawn between mana wells
player inside or outside his mana pool?
*/
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  const scale = 0.5;
  const rowLength = Math.ceil(width / (70 * scale));
  const colLength = Math.ceil(height / (75 * scale));
  const tiles = [];
  for (let i = 0; i < rowLength; i++) {
    for (let j = 0; j < colLength; j++) {
      tiles.push(
        <HexagonTile
          key={`${i} ${j}`}
          rowLength={rowLength}
          i={i}
          j={j}
          scale={scale}
          setClickedIndex={setClickedTile}
          isHighlighted={highlightedTiles.some(
            ({ h_i, h_j }) => h_i === i && h_j === j
          )}
        />
      );
    }
  }
  const coords = [];

  const isNotTooClose = (x, y) => {
    const maxCloseness = 0.5;
    let tooClose = false;
    for (let coord of coords) {
      if (tooClose) break;
      const x2 = coord.x;
      const y2 = coord.y;
      tooClose =
        maxCloseness > Math.sqrt(Math.exp(x2 - x, 2) + Math.exp(y2 - y, 2));
    }
    return !tooClose;
  };
  const x = Math.random() * width;
  const y = Math.random() * height;
  coords.push({ x, y });
  const graveyards = [<Graveyard isEndgame={true} x={x} y={y} />];
  for (let i = 0; i < 250; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    if (isNotTooClose(x, y)) {
      coords.push({ x, y });
      graveyards.push(<Graveyard x={x} y={y} />);
      // i++;
    }
  }
  // const isNotPresent = (i, j) => {
  //   return highlightedHexagons.every(({ h_i, h_j }) => h_i !== i && h_j !== j);
  // };
  // const checkIsInBounds = (i, j, count) => {
  //   if (count) {
  //     if (i >= 0 && i < rowLength && j >= 0 && j < colLength) {
  //       setHighlightedHexagons(arr =>
  //         isNotPresent(i, j) ? [...arr, { h_i: i, h_j: j }] : [...arr]
  //       );
  //     }
  //     // top: i, j + 1;
  //     if (j + count < colLength) {
  //       setHighlightedHexagons(arr =>
  //         isNotPresent(i, j) ? [...arr, { h_i: i, h_j: j + count }] : [...arr]
  //       );
  //       checkIsInBounds(i, j + count, count - 1);
  //     }
  //     // left: i - 1, j
  //     if (i - count >= 0) {
  //       setHighlightedHexagons(arr =>
  //         isNotPresent(i, j) ? [...arr, { h_i: i - count, h_j: j }] : [...arr]
  //       );
  //       checkIsInBounds(i - count, j, count - 1);
  //     }
  //     // bottom:  i, j - 1
  //     if (j - count >= 0) {
  //       setHighlightedHexagons(arr =>
  //         isNotPresent(i, j) ? [...arr, { h_i: i, h_j: j - count }] : [...arr]
  //       );
  //       checkIsInBounds(i, j - count, count - 1);
  //     }
  //     // right: i + 1, j
  //     if (i + count < rowLength) {
  //       setHighlightedHexagons(arr =>
  //         isNotPresent(i, j) ? [...arr, { h_i: i + count, h_j: j }] : [...arr]
  //       );
  //       checkIsInBounds(i + count, j, count - 1);
  //     }
  //     if (i % 2) {
  //       // top-left:  i - 1, j + 1
  //       if (i - count >= 0 && j + count < colLength) {
  //         setHighlightedHexagons(arr =>
  //           isNotPresent(i, j)
  //             ? [...arr, { h_i: i - count, h_j: j + count }]
  //             : [...arr]
  //         );
  //         checkIsInBounds(i - count, j + count, count - 1);
  //       }
  //       // top-right:  i + 1, j + 1
  //       if (i + count < rowLength && j + count < colLength) {
  //         setHighlightedHexagons(arr =>
  //           isNotPresent(i, j)
  //             ? [...arr, { h_i: i + count, h_j: j + count }]
  //             : [...arr]
  //         );
  //         checkIsInBounds(i + count, j + count, count - 1);
  //       }
  //     } else {
  //       // bottom-left:  i - 1, j - 1
  //       if (i - count >= 0 && j - count >= 0) {
  //         setHighlightedHexagons(arr =>
  //           isNotPresent(i, j)
  //             ? [...arr, { h_i: i - count, h_j: j - count }]
  //             : [...arr]
  //         );
  //         checkIsInBounds(i - count, j - count, count - 1);
  //       }
  //       // bottom-right:  i + 1, j - 1
  //       if (i + count < rowLength && j - count >= 0) {
  //         setHighlightedHexagons(arr =>
  //           isNotPresent(i, j)
  //             ? [...arr, { h_i: i + count, h_j: j - count }]
  //             : [...arr]
  //         );
  //         checkIsInBounds(i + count, j - count, count - 1);
  //       }
  //     }
  //   }
  // };
  const stepSize = 1;
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      setHighlightedTiles([{ h_i: i, h_j: j }]);
      // checkIsInBounds(i, j, stepSize);
    }
  }, [clickedTile]);
  return (
    <div className="App">
      {tiles}
      {graveyards}
      <Player startingX={500} startingY={500} />
    </div>
  );
};

export default App;
