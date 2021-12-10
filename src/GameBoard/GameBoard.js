import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Player } from "./Player";
import { Kaiju } from "./Kaiju";
import { ManaPool } from "./ManaPool";
import { PENINSULA_TILE_LOOKUP } from "../Utils/gameState";
import { getTileXAndY, isAdjacent, findPath } from "../Utils/utils";
const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  minwidth: ${props => props.width}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  cursor: ${props =>
    props.kaijuTokenPickedup ? "url(testKaijuTile.png), auto;" : "pointer"};
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
  playerData,
  graveyardData,
  kaiju1Data,
  kaijuTokenTiles,
  setKaijuTokenTiles,
  setPlayerMoveToTiles,
  kaiju2Data,
  scale
}) => {
  const width = 500;
  const height = 800;
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [clickedTiles, setClickedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [kaijuTokenPickedup, setKaijuTokenPickedup] = useState(null);
  useEffect(() => {
    redrawTiles([]);
  }, []);
  const redrawTiles = highlightedTiles => {
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        const key = `${i} ${j}`;
        if (PENINSULA_TILE_LOOKUP[key]) {
          const tileLocation = getTileXAndY({ i, j, scale });
          _tiles.push(
            <HexagonTile
              key={key}
              rowLength={rowLength}
              i={i}
              j={j}
              scale={scale}
              setClickedIndex={setClickedTile}
              tileLocation={tileLocation}
              isHighlighted={highlightedTiles.some(
                ({ h_i, h_j }) => h_i === i && h_j === j
              )}
              status={{
                isKaijuPickup: false,
                isOnFire: false,
                isWooded: false,
                isElectrified: false,
                isBubble: false,
                isShielded: false,
                isGhosted: false,
                isKaiju: kaijuTokenTiles.find(
                  ({ tile }) => tile.i == i && tile.j == j
                ),
                isGraveyard: graveyardData.find(
                  ({ tile }) => tile.i == i && tile.j == j
                )
              }}
            />
          );
        }
      }
    }
    setTiles(_tiles);
  };
  useEffect(() => redrawTiles([]), [kaijuTokenTiles]);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      // check to see if a kaijuToken is picked up.
      if (kaijuTokenPickedup) {
        // if so, put down the token on the tile if not next to another kaiju token tile.
        if (kaijuTokenTiles.every(({ tile }) => !isAdjacent({ i, j }, tile))) {
          setKaijuTokenTiles(
            kaijuTokenTiles.map(data =>
              data.tile.i === kaijuTokenPickedup.i &&
              data.tile.j === kaijuTokenPickedup.j
                ? { ...data, tile: { i, j } }
                : data
            )
          );
          setKaijuTokenPickedup(null);
        }
        // check if the current tile has a kaiju
      } else if (
        kaijuTokenTiles.find(({ tile }) => tile.i === i && tile.j === j)
      ) {
        // if so, pick up the tile token.
        setKaijuTokenPickedup({ i, j });
        // else move the player to the clicked tile.
      } else {
        const path = findPath(playerData[0].tile, { i, j }, scale);
        setPlayerMoveToTiles(path);
        const highlightedTiles = path.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
        redrawTiles(highlightedTiles);
      }
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju1 = kaiju1Data.map((k, i) => (
    <Kaiju
      key={i}
      charLocation={k.charLocation}
      element={k.element}
      color={k.color}
    />
  ));
  const kaiju2 = kaiju2Data.map((k, i) => (
    <Kaiju
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
      accessoryAndFamiliars={[]}
      color={p.color}
      scale={scale}
      isInManaPool={p.isInManaPool}
    />
  ));
  return (
    <Board
      kaijuTokenPickedup={kaijuTokenPickedup}
      width={width}
      height={height}
    >
      <ManaPool
        width={width}
        height={height}
        kaijuData={kaiju1Data}
        color={playerData[0] && playerData[0].color}
      />
      <ManaPool
        width={width}
        height={height}
        kaijuData={kaiju2Data}
        color={playerData[1] && playerData[1].color}
      />
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju1}
        {kaiju2}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
