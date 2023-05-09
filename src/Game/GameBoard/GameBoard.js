import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Pieces/PlayerPiece";
import { Kaiju } from "./Pieces/KaijuPiece";
import { PauseModal } from "./PauseModal";
import { GameMap } from "../../Components/GameMap.js";
import { getFlattenedArrayIndex } from "../../Utils/utils";
const Board = styled.div`
  position: relative;
  width: 500px;
  min-width: 500px;
  height: 790px;
  minwidth: 790px;
  overflow: hidden;
  /* border-top: 0px;
  border-left: 0px;
  border-bottom: 0px; */

  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  border-color: #db974f;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const RoadsImage = styled.img`
  position: absolute;
  ${props => props.zIndex && `z-index: -${props.zIndex};`};
  pointer-events: none;
  background-color: transparent;
  opacity: 0.5;
  ${props =>
    props.speed && `animation: glitter ${props.speed}s linear infinite;`};
  @keyframes glitter {
    0% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.9;
    }
    100% {
      opacity: 0.5;
    }
  }
`;

// const BackgroundImage = styled.svg`
//   margin-left: -55px;
//   pointer-events: none;
//   background-color: #06080c;
// `;

// stroke-width: 1px;

const Peninsula = styled.path`
  fill: #1b2536;
`;

const GreenSpaces = styled.path`
  fill: #173e41;
`;
export const GameBoard = ({
  isClassWrapper = false,
  isPaused,
  playerData,
  kaijuData,
  setPlayerMoveToTiles,
  tileStatuses,
  setTileStatuses,
  clickedTile,
  setClickedTile,
  tiles,
  path,
  width,
  height,
  scale
}) => {
  const [speed1, setSpeed1] = useState(Math.random() * 10 + 10);
  const [speed2, setSpeed2] = useState(Math.random() * 10 + 10);
  useEffect(() => {
    const { i, _ } = clickedTile;
    if (i !== -1) {
      setPlayerMoveToTiles(path);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju = kaijuData.map((k, i) => (
    <Kaiju
      key={k.key}
      dir={k.dir}
      charLocation={k.charLocation}
      color={k.color}
      scale={scale}
      lives={k.lives}
      zIndex={getFlattenedArrayIndex(k.tile)}
    />
  ));
  const players = playerData.map(p => (
    <Player
      key={p.i}
      i={p.i}
      charLocation={p.charLocation}
      color={p.color}
      scale={scale}
      lives={p.lives}
      isHealed={p.isHealed}
      isTeleported={p.isTeleported}
      dir={p.dir}
      zIndex={getFlattenedArrayIndex(p.tile)}
    />
  ));

  // <BackgroundImage src={"mapPic.png"} width={500} />
  // <RoadsImage zIndex={1} speed={3} src={"testRoads1.png"} width={500} />

  return (
    <Board width={width} height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju}
        {players}
      </ShiftContentOver>
      <GameMap />
    </Board>
  );
};
