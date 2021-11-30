import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";
import { ManaWell } from "./ManaWell";
import { ManaPoolOverlay } from "./ManaPoolOverlay";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES
} from "../Utils/gameState";
import {
  getCharXAndY,
  getManaWellXAndY,
  getRandomIntInRange,
  aStar,
  isAdjacent,
  getIndicesFromFlattenedArrayIndex,
  getFlattenedArrayIndex,
  getRandomCharacterLocation,
  useInterval,
  moveTo,
  getRandomAdjacentLocation
} from "../Utils/utils";
const Board = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 100px;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const BackgroundImage = styled.img`
  z-index: -2;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
`;
export const GameBoard = () => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [clickedTiles, setClickedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerData, setPlayerData] = useState([]);
  const [graveyardData, setGraveyardData] = useState([]);
  const [kaijuAndManaWellData, setKaijuAndManaWellData] = useState([]);
  useEffect(() => {
    redrawTiles([]);
    const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
    // PLAYERS - - - - - - - - - - - -
    const _players = [];
    let _max = tileIndices.length - 1;
    for (let k = 0; k < 2; k++) {
      // players:
      // [
      // {
      //   charLocation: {x,y},
      //   accessoryAndFamiliars:[{}],
      //   color:"",
      //   i:0,
      //   isInManaPool: false
      // }
      // ]
      _max -= k;
      const randomInt = getRandomIntInRange({
        max: _max
      });
      const { i, j } = tileIndices[randomInt];
      const storeItem = tileIndices.length - k;
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      _players.push({
        accessoryAndFamiliars: [],
        color: `rgb(${Math.random() * 255},${Math.random() *
          255},${Math.random() * 255})`,
        charLocation: getCharXAndY({ i, j, scale }),
        i: k
      });
    }
    setPlayerData(_players);
    // PLAYERS - - - - - - - - - - - -
    // GRAVEYARDS - - - - - - - - - - - -
    const _graveyards = [];
    for (let k = 0; k < 15; k++) {
      // graveyards:
      // [
      //  {
      //     charLocation: {x,y},
      //     tileIndices: {i,j},
      //     isUnused: false
      //  }
      // ]
      _max -= k;
      const bridgeTiles = Object.values(BRIDGE_TILES);
      const bridgeTile = bridgeTiles[bridgeTiles.length - 1];
      let key = `${bridgeTile.i} ${bridgeTile.j}`;
      let randTile, randomInt;
      while (BRIDGE_TILES[key]) {
        randomInt = getRandomIntInRange({
          max: _max
        });
        randTile = tileIndices[randomInt];
        key = `${randTile.i} ${randTile.j}`;
      }
      const { i, j } = randTile;
      const storeItem = tileIndices.length - k;
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      _graveyards.push({
        charLocation: getCharXAndY({ i, j, scale }),
        tileIndices: { i, j },
        isUnused: true
      });
    }
    setGraveyardData(_graveyards);
    // GRAVEYARDS - - - - - - - - - - - -
    // KAIJUANDMANAWELLS - - - - - - - - - - - -
    const _kaijuAndManaWells = [];
    for (let k = 0; k < 3; k++) {
      // kaijuAndManaWells:
      // [
      //  {
      //     charLocation: {x,y},
      //     tileIndices: {i,j},
      //     canvasLocation: {x,y},
      //     element: "Fire" /// undefined or string, dictates if it moves and gif/png used
      //     owner: 0, // undefined or index into players array
      //  }
      // ]
      _max -= k;
      const randomInt = getRandomIntInRange({
        max: _max
      });
      const { i, j } = tileIndices[randomInt];
      const storeItem = tileIndices.length - k;
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      _kaijuAndManaWells.push({
        charLocation: getCharXAndY({ i, j, scale }),
        canvasLocation: getManaWellXAndY({ i, j, scale }),
        tileIndices: { i, j },
        element: undefined,
        owner: undefined
      });
    }
    setKaijuAndManaWellData(_kaijuAndManaWells);
    // KAIJUANDMANAWELLS - - - - - - - - - - - -
  }, []);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      const _clickedTiles = [...clickedTiles, { i, j }];
      setClickedTiles(_clickedTiles);
      const highlightedTiles = Object.entries(_clickedTiles).map(([k, v]) => {
        return { h_i: v.i, h_j: v.j };
      });
      redrawTiles(highlightedTiles);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const redrawTiles = highlightedTiles => {
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        const key = `${i} ${j}`;
        if (PENINSULA_TILE_LOOKUP[key])
          _tiles.push(
            <HexagonTile
              key={key}
              rowLength={rowLength}
              i={i}
              j={j}
              scale={scale}
              setClickedIndex={setClickedTile}
              isHighlighted={highlightedTiles.some(
                ({ h_i, h_j }) => h_i === i && h_j === j
              )}
            />
          );
      }
    }
    setTiles(_tiles);
  };
  const manaPools = playerData.map(p => (
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
  const kaijuAndManaWells = kaijuAndManaWellData.map((kmw, i) => (
    <ManaWell
      key={i}
      charLocation={kmw.charLocation}
      canvasLocation={kmw.canvasLocation}
      scale={scale}
      element={kmw.element}
      owner={kmw.owner}
      tileIndices={kmw.tileIndices}
    />
  ));
  const graveyards = graveyardData.map((g, i) => (
    <Graveyard
      key={i}
      charLocation={g.charLocation}
      tileIndices={g.tileIndices}
      isUnused={g.isUnused}
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
    <Board width={width} height={height}>
      <ManaPoolOverlay
        manaWellLocations={kaijuAndManaWellData.map(kmw => kmw.canvasLocation)}
      />
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaijuAndManaWells}
        {graveyards}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
