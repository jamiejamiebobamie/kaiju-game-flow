import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";
import { Kaiju } from "./Kaiju";
import { ManaPool } from "./ManaPool";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES
} from "../Utils/gameState";
import {
  getRandAdjacentTile,
  getCharXAndY,
  getTileXAndY,
  getRandomIntInRange,
  useInterval,
  movePiece,
  isLocatonInsidePolygon,
  checkIsInManaPool
} from "../Utils/utils";
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
  const [kaiju1Data, setKaiju1Data] = useState([]);
  const [kaiju2Data, setKaiju2Data] = useState([]);
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
              // isHighlighted={highlightedTiles.some(
              //   ({ h_i, h_j }) => h_i === i && h_j === j
              // )}
              isWooded={false}
              isOnFire={false}
            />
          );
        }
      }
    }
    setTiles(_tiles);
  };
  useEffect(() => {
    redrawTiles([]);
    const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
    // PLAYERS - - - - - - - - - - - -
    const _players = [];
    let _max = tileIndices.length - 1;
    for (let k = 0; k < 2; k++) {
      _max -= k;
      const randomInt = getRandomIntInRange({
        max: _max
      });
      const { i, j } = tileIndices[randomInt];
      const storeItem = tileIndices.length - k;
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      const location = getCharXAndY({ i, j, scale });
      _players.push({
        isInManaPool: false,
        color: k ? "salmon" : "blue",
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: getCharXAndY({
          ...getRandAdjacentTile({ i, j }),
          scale
        }),
        tile: { i, j },
        i: k,
        isThere: false
      });
    }
    setPlayerData(_players);
    // PLAYERS - - - - - - - - - - - -
    // GRAVEYARDS - - - - - - - - - - - -
    const _graveyards = [];
    for (let k = 0; k < 15; k++) {
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
      const charLocation = getCharXAndY({ i, j, scale });
      const { x, y } = charLocation;
      console.log(charLocation, randTile, randomInt);
      _graveyards.push({
        charLocation,
        tile: { i, j },
        isUsed: false
      });
    }
    setGraveyardData(_graveyards);
    // GRAVEYARDS - - - - - - - - - - - -
    // KAIJU - - - - - - - - - - - -
    const _kaiju = [];
    const _canvasLocations = [];
    for (let k = 0; k < 6; k++) {
      _max -= k;
      const randomInt = getRandomIntInRange({
        max: _max
      });
      const { i, j } = tileIndices[randomInt];
      const storeItem = tileIndices.length - k;
      const location = getCharXAndY({ i, j, scale });
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      _kaiju.push({
        charLocation: getCharXAndY({ i, j, scale }),
        moveFromLocation: location,
        moveToLocation: getCharXAndY({
          ...getRandAdjacentTile({ i, j }),
          scale
        }),
        tile: { i, j },
        element: undefined,
        owner: k < 3 ? _players[0] : _players[1],
        color: k < 3 ? _players[0].color : _players[1].color
      });
    }
    setKaiju1Data(_kaiju.filter(k => k.owner === _players[0]));
    setKaiju2Data(_kaiju.filter(k => k.owner === _players[1]));
    // KAIJU - - - - - - - - - - - -
  }, []);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      if (clickedTiles.find(tile => tile.i === i && tile.j === j)) {
        const item = clickedTiles.find(tile => tile.i === i && tile.j === j);
        const index = clickedTiles.indexOf(item);
        console.log(index);
        const _clickedTiles = [...clickedTiles];
        console.log(_clickedTiles);
        _clickedTiles.splice(index, 1);
        console.log(_clickedTiles);
        setClickedTiles(_clickedTiles);
        const highlightedTiles = Object.entries(_clickedTiles).map(([k, v]) => {
          return { h_i: v.i, h_j: v.j };
        });
        redrawTiles(highlightedTiles);
      } else {
        const _clickedTiles = [...clickedTiles, { i, j }];
        setClickedTiles(_clickedTiles);
        const highlightedTiles = Object.entries(_clickedTiles).map(([k, v]) => {
          return { h_i: v.i, h_j: v.j };
        });
        redrawTiles(highlightedTiles);
      }
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  useInterval(() => {
    movePiece(playerData, setPlayerData, scale);
    const isKaiju = true;
    movePiece(kaiju1Data, setKaiju1Data, scale, isKaiju);
    movePiece(kaiju2Data, setKaiju2Data, scale, isKaiju);
    checkIsInManaPool({ setPlayerData, kaiju1Data, kaiju2Data });
  }, 1000);
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
  const graveyards = graveyardData.map((g, i) => (
    <Graveyard key={i} charLocation={g.charLocation} isUsed={g.isUsed} />
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
        {graveyards}
        {kaiju1}
        {kaiju2}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
