import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Pieces/PlayerPiece";
import { DeadPlayer } from "./Pieces/DeadPlayerPiece";
import { ExplodingKaiju } from "./Pieces/ExplodingKaijuPiece";
import { Kaiju } from "./Pieces/KaijuPiece";
import { PauseModal } from "./PauseModal";
import { GameMap } from "../../Components/GameMap.js";
import { initializeGameBoard, getFlattenedArrayIndex, getDistance, redrawTiles } from "../../Utils/utils";
import { GameBoardPieceComponent } from 'Game/GameBoard/Pieces/GameBoardPieceComponent'
import { GameBoardTileComponent } from 'Game/GameBoard/Tile/GameBoardTileComponent';
import { getDistanceToFrom } from 'Game/utils'

const getBoardTileIndexFromHtml = (e, tiles) => {
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left - 23; // x position within the gameboard w/ offset: -23
  var y = e.clientY - rect.top + 8;  // y position within the gameboard.
  const tileIndex = tiles && tiles.reduce((acc, { tileIndex, tileLocation }) => {
    const distance = getDistanceToFrom({ x, y }, tileLocation);
    return acc.distance > distance ? { distance, tileIndex } : acc;
  }, {
    distance: Number.MAX_SAFE_INTEGER,
    tileIndex: undefined
  }
  ).tileIndex
  return tileIndex;
}

const Board = styled.div`
  position: relative;
  display: flex;

  ${props => props.width ? `width: ${props.width}px;` : 'width: 500px;'}
  // crop bottom of image. use 98% of required height.
  ${props => props.height ? `height: ${props.height * .98}px;` : 'height: 790px;'}
  overflow: hidden;

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
  pieces,
  tiles,
  colorLookup,
  inputHandler,
  tilePiecesColorLookup,
  // playerData,
  // kaijuData,
  setPlayerMoveToTiles,
  clickedTile,
  setClickedTile,
  // tiles,
  // path,
  width,
  height,
  scale,
  hoverLookupString,
  setHoverLookupString,
  // deadKaijuLocations,
  highlightedTiles0,
  // setTiles,
  // tileStatuses,
  // setTileStatuses,
  ROW_LENGTH,
  COL_LENGTH,
  ROW_OFFSET,
  COL_OFFSET,
  // initializationProps,
}) => {
  const playerIndex = 0;
  const isPlayerDead = !!pieces[playerIndex] && pieces[playerIndex].isDead;

  const isRenderCityMap = !isPaused;
  const isRenderTiles = !isPaused;
  // const isMap = true;

  // useEffect(() => initializeGameBoard({ ...initializationProps, isMap: true, isRenderTiles: true }), []);

  // useEffect(() => {
  //   if (isPaused) {
  //     // trigger tile redraw to see the scale down effect on pause
  //     redrawTiles({
  //       highlightedTiles0,
  //       setClickedTile,
  //       setTiles,
  //       playerData,
  //       kaijuData,
  //       tileStatuses,
  //       setTileStatuses,
  //       scale,
  //       rowLength: ROW_LENGTH,
  //       colLength: COL_LENGTH,
  //       rowOffset: ROW_OFFSET,
  //       colOffset: COL_OFFSET,
  //       isMap: isMap,
  //       isRenderTiles: false
  //     });
  //   }
  // }, [isPaused]);

  // useEffect(() => {
  //   const { i, _ } = clickedTile;
  //   if (i !== -1) {
  //     setPlayerMoveToTiles(path);
  //     setClickedTile({ i: -1, j: -1 });
  //   }
  // }, [clickedTile]);

  const piecesComponents = pieces.map(p =>
    <GameBoardPieceComponent
      key={p.pieceIndex}
      zIndex={p.getZIndex()}
      charLocation={p.charLocation}
      avatar={p.avatar}
      color={p.color}
      isVisible={p.isVisible}
      isHealed={p.isHealed}
      isCharmed={p.isCharmed}
      isTeleported={p.isTeleported}
      dir={p.dir}
      spriteSheetSrc={p.spriteSheetSrc}
      lives={p.lives}
      isGoingToSpewFire={p.isGoingToSpewFire}
      isShowHealthBarOnComponent={p.isShowHealthBarOnComponent}
    />
  );

  const tilesComponents = tiles.map(t =>
    <GameBoardTileComponent
      key={t.getZIndex}
      zIndex={t.getZIndex()}
      isVisible={isRenderTiles && t.getIsVisible()}
      tileLocation={t.tileLocation}
      scale={scale}
      i={t.tileIndex.i}
      j={t.tileIndex.j}
      setClickedIndex={t.getIsVisible() ? t.setClickedTile : () => { }}
      isHighlighted0={t.getIsHighlighted()}
      color={t.getColor()}
      iconRotation={t.getRotation()}
      icon={t.getActiveIcon()}
      pieceTileColor={colorLookup[`${t.tileIndex.i} ${t.tileIndex.j}`]}
    />
  )

  // const kaiju = kaijuData.map(k => (
  //   <Kaiju
  //     key={k.key}
  //     dir={k.dir}
  //     charLocation={k.charLocation}
  //     color={k.color}
  //     scale={scale}
  //     lives={k.lives}
  //     zIndex={getFlattenedArrayIndex(k.tile)}
  //     isGoingToSpewFire={k.isGoingToSpewFire}
  //   />
  // ));
  // const players = playerData.map(p => (
  //   <Player
  //     key={p.i}
  //     charLocation={p.charLocation}
  //     color={p.color}
  //     scale={scale}
  //     lives={p.lives}
  //     isDead={p.isDead}
  //     isHealed={p.isHealed}
  //     isTeleported={p.isTeleported}
  //     dir={p.dir}
  //     zIndex={getFlattenedArrayIndex(p.tile)}
  //     gender={p.gender}
  //   />
  // ));
  // const deadPlayers = playerData.filter(({ isDead }) => isDead).map(p => (
  //   <DeadPlayer
  //     key={p.i}
  //     i={p.i}
  //     charLocation={p.charLocation}
  //     color={p.color}
  //     zIndex={getFlattenedArrayIndex(p.tile)}
  //   />
  // ));
  // const kaijuRemains = deadKaijuLocations.map(k => (
  //   <ExplodingKaiju
  //     key={k.key}
  //     charLocation={k.charLocation}
  //     color={k.color}
  //     zIndex={getFlattenedArrayIndex(k.tile)}
  //   />
  // ));

  return (
    <Board
      onClick={e => {
        if (isPlayerDead) return;
        const tileIndex = getBoardTileIndexFromHtml(e, tiles);
        inputHandler.updatePlayerDestinationFromClick(tileIndex);
      }}
      onMouseMove={e => {
        if (isPlayerDead) return;
        const tileIndex = getBoardTileIndexFromHtml(e, tiles);
        inputHandler.updateHighlightedTilesFromPlayerHover(tileIndex);
      }}
      width={width}
      height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver>
        {/* {tiles} */}
        {piecesComponents}
        {tilesComponents}
        {/* {kaiju}
        {players}
        {deadPlayers}
        {kaijuRemains} */}
      </ShiftContentOver>
      <GameMap isVisible={isRenderCityMap} width={width} height={height} />
    </Board>
  );
};
