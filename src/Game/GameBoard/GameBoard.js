import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Pieces/PlayerPiece";
import { Kaiju } from "./Pieces/KaijuPiece";
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
  border-color: #db974f;
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
      dir={p.dir}
    />
  ));
  return (
    <Board width={width} height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
