import React, { useState, useEffect } from "react";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";

export const GameBoard = () => {
  /*
      x,y coords of peninsula (whether or not something is on peninsula)
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
      player inside or outside his mana pool?
  */
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [tiles, setTiles] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
  const [players, setPlayers] = useState([]);
  var width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  var height =
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
  useEffect(() => {
    const scale = 0.5;
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        _tiles.push(
          <HexagonTile
            key={`${i} ${j}`}
            rowLength={rowLength}
            i={i}
            j={j}
            scale={scale}
            setClickedIndex={setClickedTile}
            isHighlighted={false}
          />
        );
      }
    }
    const x = Math.random() * width;
    const y = Math.random() * height;
    const _graveyards = [<Graveyard isEndgame={true} x={x} y={y} />];
    for (let i = 0; i < 250; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      _graveyards.push(<Graveyard x={x} y={y} />);
    }
    const _players = [];
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      _players.push(
        <Player
          startingX={x}
          startingY={y}
          color={`rgb(${Math.random() * 255},${Math.random() *
            255},${Math.random() * 255})`}
        />
      );
    }
    setTiles(_tiles);
    setGraveyards(_graveyards);
    setPlayers(_players);
  }, []);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      const highlightedTiles = [{ h_i: i, h_j: j }];
      const scale = 0.5;
      const rowLength = Math.ceil(width / (70 * scale));
      const colLength = Math.ceil(height / (75 * scale));
      const _tiles = [];
      for (let i = 0; i < rowLength; i++) {
        for (let j = 0; j < colLength; j++) {
          _tiles.push(
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
      setTiles(_tiles);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  return (
    <>
      {tiles}
      {graveyards}
      {players}
    </>
  );
};
