import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Player";
import { Kaiju } from "./Kaiju";
import { PowerUp } from "./PowerUp";
import { PauseModal } from "./PauseModal";
const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  minwidth: ${props => props.width}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const BackgroundImage = styled.img`
  z-index: -3;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
`;
const TestMoon = styled.i`
  position: absolute;
  /* margin-top: -50px;
  margin-left: 520px; */
  pointer-events: none;
  left: 600px;
  top: 200px;
  opacity: 0.3;
  z-index: 1;
  width: 120px;
  height: 120px;
  color: yellow;
  transform: rotate(250deg) scale(5);
`;
export const GameBoard = ({
  isPaused,
  powerUpData,
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
  const [clickedTiles, setClickedTiles] = useState([]);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      setPlayerMoveToTiles(path);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju = kaijuData.map((k, i) => (
    <Kaiju
      key={k.key}
      charLocation={k.charLocation}
      color={k.color}
      scale={scale}
      lives={k.lives}
    />
  ));
  const powerUps = powerUpData.map((k, i) => (
    <PowerUp
      key={i}
      charLocation={k.charLocation}
      element={k.element}
      color={k.color}
    />
  ));
  const players = playerData.map(p => (
    <Player
      key={p.i}
      i={p.i}
      charLocation={p.charLocation}
      color={p.color}
      scale={scale}
      isInManaPool={p.isInManaPool}
      lives={p.lives}
      isHealed={p.isHealed}
      isTeleported={p.isTeleported}
    />
  ));
  return (
    <Board width={width} height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver scale={scale}>
        {tiles}
        {powerUps}
        {kaiju}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
// <TestMoon className="fa fa-moon-o" />
