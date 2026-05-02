import React, { useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Pieces/PlayerPiece";
import { DeadPlayer } from "./Pieces/DeadPlayerPiece";
import { ExplodingKaiju } from "./Pieces/ExplodingKaijuPiece";
import { Kaiju } from "./Pieces/KaijuPiece";
import { PauseModal } from "./PauseModal";
import { GameMap } from "../../Components/GameMap.js";
import { getFlattenedArrayIndex, getDistance } from "../../Utils/utils";
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
  cursor: pointer;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
export const GameBoard = ({
  isPaused,
  playerData,
  kaijuData,
  setPlayerMoveToTiles,
  clickedTile,
  setClickedTile,
  tiles,
  path,
  width,
  height,
  scale,
  hoverLookupString,
  setHoverLookupString,
  deadKaijuLocations
}) => {
  const playerIndex = 0;

  const isPlayerDead = !!playerData[playerIndex] && typeof(playerData[playerIndex].lives) === "number" && playerData[playerIndex].lives < 1;

  useEffect(() => {
    const { i, _ } = clickedTile;
    if (i !== -1) {
      setPlayerMoveToTiles(path);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju = kaijuData.map(k => (
    <Kaiju
      key={k.key}
      dir={k.dir}
      charLocation={k.charLocation}
      color={k.color}
      scale={scale}
      lives={k.lives}
      zIndex={getFlattenedArrayIndex(k.tile)}
      dropShadowSize={k.dropShadowSize}
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
  const deadPlayers = playerData.filter(({ lives }) => lives < 1).map(p => (
    <DeadPlayer
      key={p.i}
      i={p.i}
      charLocation={p.charLocation}
      color={p.color}
      zIndex={getFlattenedArrayIndex(p.tile)}
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
    <Board
      onClick={e => {
        if(!isPlayerDead){
          var rect = e.target.getBoundingClientRect();
          var x = e.clientX - rect.left - 23; // x position within the gameboard w/ offset: -23
          var y = e.clientY - rect.top;  // y position within the gameboard.
          const test = tiles && tiles.reduce((acc, {props : { i, j, tileLocation }}) =>
                        {
                            const distance = getDistance({ x, y }, tileLocation);
                            return acc.distance > distance ? ({key: `${i} ${j}`, distance }) : acc;

                        }  , {
                            distance: Number.MAX_SAFE_INTEGER,
                            key: undefined
                          }
                     )
        test.key && setClickedTile(test.key);
        }
      }}
      onMouseMove={e => {
        if(!isPlayerDead){
            var rect = e.target.getBoundingClientRect();
            var x = e.clientX - rect.left - 23; // x position within the gameboard w/ offset: -23
            var y = e.clientY - rect.top + 8;  // y position within the gameboard.
            const test = tiles && tiles.reduce((acc, {props : { i, j, tileLocation }}) =>
                          {
                              const distance = getDistance({ x, y }, tileLocation);
                              return acc.distance > distance ? ({key: `${i} ${j}`, distance }) : acc;

                          }  , {
                              distance: Number.MAX_SAFE_INTEGER,
                              key: undefined
                            }
                      )
          test.key && test.key !== hoverLookupString && setHoverLookupString(test.key);
        } else if (isPlayerDead && hoverLookupString != '') {
          setHoverLookupString('');
        } 
      }}
      width={width}
      height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver>
        {tiles}
        {kaiju}
        {players}
        {deadPlayers}
        {kaijuRemains}
      </ShiftContentOver>
      <GameMap />
    </Board>
  );
};
