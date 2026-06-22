import React from "react";
import styled from "styled-components";
import { DeadPlayer } from "./Pieces/DeadPlayerPiece";
import { ExplodingKaiju } from "./Pieces/ExplodingKaijuPiece";
import { PauseModal } from "./PauseModal";
import { GameMap } from "../../Components/GameMap.js";
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
  width,
  height,
  scale
}) => {
  const playerIndex = 0;
  const isPlayerDead = !!pieces[playerIndex] && pieces[playerIndex].isDead;

  const isRenderCityMap = !isPaused;
  const isRenderTiles = !isPaused;

  const piecesComponents = pieces.map(p =>
    <GameBoardPieceComponent
      key={p.pieceIndex}
      zIndex={p.getZIndex()} // TO-DO: fix. this is not working...
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
      key={t.getZIndex()}
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
        inputHandler.updatePlayerDestinationAndClickedTileFromClick(tileIndex);
      }}
      onMouseMove={e => {
        if (isPlayerDead) return;
        const tileIndex = getBoardTileIndexFromHtml(e, tiles);
        inputHandler.updateHoveredTileFromPlayerHover(tileIndex);
      }}
      onMouseOut={() => {
        if (isPlayerDead) return;
        inputHandler.updateHoveredTileFromPlayerHover(undefined);
      }}
      width={width}
      height={height}>
      {isPaused && <PauseModal />}
      <ShiftContentOver>
        {piecesComponents}
        {tilesComponents}
      </ShiftContentOver>
      <GameMap isVisible={isRenderCityMap} width={width} height={height} />
    </Board>
  );
};
