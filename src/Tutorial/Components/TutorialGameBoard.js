import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "Game/GameBoard/Pieces/PlayerPiece";
import { Kaiju } from "Game/GameBoard/Pieces/KaijuPiece";
import { ExplodingKaiju } from "Game/GameBoard/Pieces/ExplodingKaijuPiece";
import { Abilities, TutorialAbilitiesWrapper } from "Game/UI/PlayerUI/Components/Abilities";
import { getFlattenedArrayIndex } from "Utils/utils";

const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  max-height: 300px;
  margin-top: 40px;
  margin-bottom: 10px;
`;
const PiecesWrapper = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;

const Title = styled.div`
  display: flex;
  width: 70px;
  height: 70px;
  margin-top: 40px;
  pointer-events: none;
  font-size: 13px;
  z-index: 1;
  color: #db974f;
`;
export const TutorialGameBoard = ({
  playerData,
  setPlayerData,
  setTeleportData,
  kaijuData,
  setPlayerMoveToTiles,
  setTileStatuses,
  clickedTile,
  setClickedTile,
  tiles,
  path,
  width,
  height,
  scale,
  deadKaijuLocations
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
      gender={p.gender}
    />
  ));
    const kaijuRemains = deadKaijuLocations.map(k => (
      <ExplodingKaiju
        key={k.key}
        charLocation={k.charLocation}
        color={k.color}
        zIndex={getFlattenedArrayIndex(k.tile)}
      />
    ));
  return (
    <Board width={width} height={height}>
      <PiecesWrapper scale={scale}>
        {tiles}
        {kaiju}
        {kaijuRemains}
        {players}
      </PiecesWrapper>
      <TutorialAbilitiesWrapper>
        {playerData.length &&
        Array.isArray(playerData[0].abilities) &&
        playerData[0].abilities.length ? (
          <Title>Click: </Title>
        ) : null}
        <Abilities
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
      </TutorialAbilitiesWrapper>
    </Board>
  );
};
