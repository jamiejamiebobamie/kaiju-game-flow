import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Player } from "./Player";
import { Kaiju } from "./Kaiju";
import { ManaPool } from "./ManaPool";
import { PENINSULA_TILE_LOOKUP } from "../Utils/gameState";
import {
  getTileXAndY,
  isAdjacent,
  findPath,
  useHover,
  useInterval,
  getRandBool,
  isTileOnGameBoard
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
  const [setHoverRef, hoverLookupString] = useHover();
  const [goalTile, setGoalTile] = useState(null);
  const [tileInterval, setTileInterval] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);

  useEffect(() => {
    redrawTiles([]);
    const status = [];
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    for (let i = 0; i < rowLength; i++) {
      const _status = [];
      for (let j = 0; j < colLength; j++) {
        _status.push({
          updateKey: Math.random(),
          isPlayer: playerData.some(({ tile }) => tile.i === i && tile.j === j),
          isOnFire: getRandBool() ? { i: -1, j: -1 } : null,
          isWooded: null, //getRandBool() ? { i: 1, j: 1 } : null,
          isElectrified: null, //getRandBool() ? { i: 0, j: -1 } : null,
          isBubble: null, //getRandBool() ? { i: -1, j: -1 } : null,
          isShielded: null, //getRandBool() ? { i: -1, j: -1 } : null,
          isGhosted: null, //getRandBool() ? { i: -1, j: -1 } : null,
          isKaiju: kaijuTokenTiles.find(
            ({ tile }) => tile.i == i && tile.j == j
          ),
          isGraveyard: graveyardData.find(
            ({ tile }) => tile.i == i && tile.j == j
          )
        });
      }
      status.push(_status);
    }
    setTileStatuses(status);
  }, []);

  const updateTileState = () => {
    const updateKey = Math.random();
    if (tileStatuses) {
      const status = [...tileStatuses];
      const rowLength = Math.ceil(width / (70 * scale));
      const colLength = Math.ceil(height / (75 * scale));
      for (let i = 0; i < rowLength; i++) {
        for (let j = 0; j < colLength; j++) {
          let tileStatus = status[i][j];
          // 1. solve what should be on the tile
          if (tileStatus.isGraveyard) {
            tileStatus = { isGraveyard: { i: 0, j: 0 }, updateKey };
          } else if (tileStatus.isBubble) {
            tileStatus = { isBubble: status[i][j].isBubble, updateKey };
          } else if (tileStatus.isGhosted) {
            tileStatus = { isGhosted: status[i][j].isGhosted, updateKey };
          } else if (tileStatus.isShielded) {
            tileStatus = { isShielded: status[i][j].isShielded, updateKey };
          } else if (tileStatus.isElectrified) {
            tileStatus = {
              isElectrified: status[i][j].isElectrified,
              updateKey
            };
          } else if (tileStatus.isOnFire) {
            tileStatus = { isOnFire: status[i][j].isOnFire, updateKey };
          } else if (tileStatus.isWooded) {
            tileStatus = { isWooded: status[i][j].isWooded, updateKey };
          }
          const entry = Object.entries(tileStatus).find(
            ([_k, _v]) => _k !== "updateKey" && _v
          );
          if (entry) {
            // 2. move the tile based on the direction vectors array
            const [k, v] = entry;
            if (k !== "isGraveyard" && k !== "isShielded") {
              const _i = i + v.i;
              const _j = j + v.j;
              if (
                isTileOnGameBoard({
                  i: _i,
                  j: _j
                })
              )
                status[_i][_j][k] = {
                  i: tileStatus[k].i,
                  j: tileStatus[k].j
                };
              // 3. erase current tile's state if not: isElectrified
              status[i][j][k] =
                k !== "isElectrified" && status[i][j].updateKey !== updateKey
                  ? null
                  : status[i][j][k];
            }
          }
        }
      }
      setTileStatuses(status);
    }
  };
  // useEffect(() => {
  //   if (hoverLookupString) {
  //     const [i, j] = hoverLookupString.split(" ");
  //     const path = findPath(
  //       playerData[0].tile,
  //       { i: Number(i), j: Number(j) },
  //       scale
  //     );
  //     const highlightedTiles = path.map(t => {
  //       return { h_i: t.i, h_j: t.j };
  //     });
  //     redrawTiles(highlightedTiles);
  //   } else {
  //     redrawTiles([]);
  //   }
  // }, [hoverLookupString]);
  useInterval(() => {
    let highlightedTiles = [];
    if (hoverLookupString) {
      const [i, j] = hoverLookupString.split(" ");
      if (
        kaiju1Data.every(k => k.tile.i !== i && k.tile.j !== j) &&
        kaiju2Data.every(k => k.tile.i !== i && k.tile.j !== j) &&
        !kaijuTokenPickedup
      ) {
        const path = findPath(
          playerData[0].tile,
          { i: Number(i), j: Number(j) },
          scale
        );
        highlightedTiles = path.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
      } else {
        highlightedTiles = [{ h_i: Number(i), h_j: Number(j) }];
      }
    } else if (goalTile) {
      const path = findPath(playerData[0].tile, goalTile, scale);
      highlightedTiles = path.map(t => {
        return { h_i: t.i, h_j: t.j };
      });
      if (!path.length) setGoalTile(null);
    }
    redrawTiles(highlightedTiles);
  }, 500);
  useInterval(() => {
    updateTileState();
  }, 2000);
  // useEffect(() => {
  //   if (hoverLookupString || goalTile) setTileInterval(250);
  //   else {
  //     setTileInterval(2000);
  //     redrawTiles([]);
  //   }
  // }, [hoverLookupString, goalTile]);
  const redrawTiles = highlightedTiles => {
    if (tileStatuses) {
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
                setHoverRef={setHoverRef}
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
                  ...tileStatuses[i][j],
                  isPlayer: playerData.some(
                    ({ tile }) => tile.i === i && tile.j === j
                  ),
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
    }
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
        setGoalTile({ i, j });
        // const test1 = getNormVecFromTiles(playerData[0].tile, { i, j }, scale);
        // const test2 = getTileDiff(playerData[0].tile, { i, j });
        // const test3 = getAdjacentTileFromTile(
        //   playerData[0].tile,
        //   { i, j },
        //   scale
        // );
        // console.log(test3);
        // setGoalTile(test3);
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
