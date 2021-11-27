import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";

const ShiftContent = styled.div`
  margin-top: -50px;
  margin-left: -200px;
`;
const Board = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 100px;
`;

export const GameBoard = () => {
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [tiles, setTiles] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
  const [players, setPlayers] = useState([]);
  // FOR TESTING
  // var width =
  //   window.innerWidth ||
  //   document.documentElement.clientWidth ||
  //   document.body.clientWidth;
  // var height =
  //   window.innerHeight ||
  //   document.documentElement.clientHeight ||
  //   document.body.clientHeight;
  const width = 500;
  const height = 800;
  const scale = 0.5;
  useEffect(() => {
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
    const _graveyards = [
      <Graveyard key={`${x} ${y}`} isEndgame={true} x={x} y={y} />
    ];
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      _graveyards.push(<Graveyard key={`${x} ${y}`} x={x} y={y} />);
    }
    const _players = [];
    for (let i = 0; i < 2; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      _players.push(
        <Player
          key={`${x} ${y}`}
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
    <Board width={width} height={height}>
      <ShiftContent>
        {tiles}
        {graveyards}
        {players}
      </ShiftContent>
    </Board>
  );
};
