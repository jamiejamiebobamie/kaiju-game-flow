import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "../../../Game/GameBoard/Pieces/PlayerPiece";
import { Kaiju } from "../../../Game/GameBoard/Pieces/KaijuPiece";
import { Abilities } from "../../../Game/UI/PlayerUI/Components/Abilities";

const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  max-height: 300px;
  margin-top: 40px;
  margin-bottom: 10px;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const AbilitiesWrapper = styled.div`
  display: flex;
  margin-left: 5px;
  margin-top: 200px;
  height: 105px;
`;
const Title = styled.div`
  display: flex;
  align-self: flex-end;
  align-content: flex-end;
  font-alignment: flex-end;
  width: 70px;
  height: 70px;
  margin-top: 40px;
  pointer-events: none;
  font-size: 13px;
  z-index: 1;
  color: black;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const TutorialGameBoard = ({
  shiftContentOver,
  isClassWrapper = false,
  playerData,
  setPlayerData,
  setTeleportData,
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
    />
  ));
  return (
    <Board width={width} height={height}>
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju}
        {players}
      </ShiftContentOver>
      <AbilitiesWrapper>
        {playerData.length &&
        Array.isArray(playerData[0].abilities) &&
        playerData[0].abilities.length ? (
          <Title>Click: </Title>
        ) : null}
        <Abilities
          shiftContentOver={shiftContentOver}
          playerData={playerData}
          setPlayerData={setPlayerData}
          kaijuData={kaijuData}
          setTileStatuses={setTileStatuses}
          scale={scale}
          abilities={(playerData.length && playerData[0].abilities) || []}
          setDisplayString={() => {}}
          playerIndex={0}
          setTeleportData={setTeleportData}
        />
      </AbilitiesWrapper>
    </Board>
  );
};
