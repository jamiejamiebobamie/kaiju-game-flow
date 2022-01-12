import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "../../../MainGame/GameBoard/Pieces/PlayerPiece";
import { Kaiju } from "../../../MainGame/GameBoard/Pieces/KaijuPiece";
import { Abilities } from "../../../MainGame/UI/PlayerUI/Components/Abilities";

const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  minwidth: ${props => props.width}px;
  /* overflow: hidden; */
  /* border-style: solid;
  border-thickness: medium;
  border-radius: 10px; */
  margin-top: 40px;
  margin-bottom: 10px;
  /* background-color: red; */
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const AbilitiesWrapper = styled.div`
  margin-top: 220px;
`;
export const ClassPickerGameBoard = ({
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
      </AbilitiesWrapper>
    </Board>
  );
};
