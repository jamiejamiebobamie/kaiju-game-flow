import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";
import { PENINSULA_TILE_LOOKUP } from "./Utils/gameState";
import {
  getCharXAndY,
  getRandomIntInRange,
  aStar,
  isAdjacent,
  getIndicesFromFlattenedArrayIndex,
  getFlattenedArrayIndex
} from "./Utils/utils";

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
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const BackgroundImage = styled.img`
  z-index: -2;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
`;
export const GameBoard = () => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [includedHexes, setIncludedHexes] = useState({});
  const [path, setPath] = useState({
    to: null,
    from: null
  });
  const [endGamePoint, setEndGamePoint] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
  const [players, setPlayers] = useState([]);
  // FOR TESTING:
  // var width =
  //   window.innerWidth ||
  //   document.documentElement.clientWidth ||
  //   document.body.clientWidth;
  // var height =
  //   window.innerHeight ||
  //   document.documentElement.clientHeight ||
  //   document.body.clientHeight;
  const redrawTiles = highlightedTiles => {
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        const key = `${i} ${j}`;
        if (PENINSULA_TILE_LOOKUP[key])
          _tiles.push(
            <HexagonTile
              key={key}
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
  };
  useEffect(() => {
    const highlightedTiles = [];
    redrawTiles(highlightedTiles);
    // const _graveyards = [];
    // for (let i = 0; i < 30; i++) {
    //   const x = Math.random() * width;
    //   const y = Math.random() * height;
    //   _graveyards.push(<Graveyard key={`${x} ${y}`} x={x} y={y} />);
    // }
    // setGraveyards(_graveyards);
    const _players = [];
    for (let i = 0; i < 2; i++) {
      const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
      const randomInt = getRandomIntInRange({ max: tileIndices.length });
      const { i, j } = tileIndices[randomInt];
      const { x, y } = getCharXAndY({ i, j, scale });
      _players.push(
        <Player
          key={`${x} ${y}`}
          startingX={x}
          startingY={y}
          color={`rgb(${Math.random() * 255},${Math.random() *
            255},${Math.random() * 255})`}
          scale={scale}
        />
      );
    }
    setPlayers(_players);
    const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
    const randomInt = getRandomIntInRange({ max: tileIndices.length });
    const { i, j } = tileIndices[randomInt];
    const { x, y } = getCharXAndY({ i, j, scale });
    setEndGamePoint(
      <Graveyard key={`${x} ${y}`} isEndgame={true} x={x} y={y} />
    );
  }, []);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      // console.log(clickedTile);
      // let _includedHexes;
      // if (includedHexes[`${i} ${j}`]) {
      //   _includedHexes = { ...includedHexes };
      //   delete _includedHexes[`${i} ${j}`];
      //   setIncludedHexes(_includedHexes);
      // } else {
      //   _includedHexes = { ...includedHexes, [`${i} ${j}`]: clickedTile };
      //   setIncludedHexes(_includedHexes);
      // }
      // const highlightedTiles = Object.entries(_includedHexes).map(([k, v]) => {
      //   return { h_i: v.i, h_j: v.j };
      // });
      // console.log(highlightedTiles);

      // FOR TESTING A*:
      const { to, from } = path;
      // if (to && from) console.log(isAdjacent(to, from));

      const _path =
        (to && from) || !from
          ? { from: clickedTile, to: null }
          : { from, to: clickedTile };
      setPath(_path);
      // const highlightedTiles = Object.entries(_path)
      //   .filter(([k, v]) => v !== null)
      //   .map(([k, v]) => {
      //     return { h_i: v.i, h_j: v.j };
      //   });

      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  useEffect(() => {
    const { to, from } = path;
    if (to && from) {
      console.log(isAdjacent(to, from));
      // const AStarPath = aStar(to, from);
      // console.log(AStarPath);
      // const highlightedTiles = Object.values(PENINSULA_TILE_LOOKUP)
      //   .map(v =>
      //     AStarPath.includes(`${v.i} ${v.j}`) ? { h_i: v.i, h_j: v.j } : null
      //   )
      //   .filter(v => v !== null);
      // const highlightedTiles =
      //   to && from
      //     ? Object.values(PENINSULA_TILE_LOOKUP)
      //         .map(v => {
      //           isAdjacent(to, { i: v.i, j: v.j }) && console.log(v);
      //           // isAdjacent(from, { i: v.i, j: v.j }) ||
      //           return isAdjacent(to, { i: v.i, j: v.j })
      //             ? { h_i: v.i, h_j: v.j }
      //             : null;
      //         })
      //         .filter(v => v !== null)
      //     : [];
      // redrawTiles(highlightedTiles);
    }
  }, [path]);
  return (
    <Board width={width} height={height}>
      <ShiftContentOver scale={scale}>
        {endGamePoint}
        {tiles}
        {graveyards}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
