import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Player } from "./Player";
import { Kaiju } from "./Kaiju";
import { PowerUp } from "./PowerUp";
import { ManaPool } from "./ManaPool";
import {
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PERIMETER_TILES
} from "../Utils/gameState";
import {
  getTileXAndY,
  isAdjacent,
  findPath,
  useHover,
  useInterval,
  getRandBool,
  isTileOnGameBoard,
  solveForStatus,
  getTileOffsetFromDir,
  getAdjacentTilesFromTile,
  getRandomIntInRange
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
  z-index: -3;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
`;
export const GameBoard = ({
  powerUpData,
  playerData,
  kaijuData,
  incrementPlayerLives,
  graveyardTileKeys,
  setPlayerMoveToTiles,
  tileStatuses,
  setTileStatuses,
  scale
}) => {
  const width = 500;
  const height = 800;
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [clickedTiles, setClickedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const [tileInterval, setTileInterval] = useState(null);
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
          isPlayer:
            playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
            playerData.find(({ tile }) => tile.i === i && tile.j === j).i,
          isGraveyard: graveyardTileKeys.find(key => key === `${i} ${j}`)
        });
      }
      status.push(_status);
    }
    setTileStatuses(status);
  }, []);

  const updateTileState = () => {
    setTileStatuses(_statuses => {
      if (_statuses) {
        const rowLength = Math.ceil(width / (70 * scale));
        const colLength = Math.ceil(height / (75 * scale));
        const updateKey = Math.random();
        for (let i = 0; i < rowLength; i++) {
          for (let j = 0; j < colLength; j++) {
            // 1. solve what should be on the tile
            if (_statuses[i][j].updateKey !== updateKey) {
              let tileStatus = solveForStatus(_statuses[i][j]);
              const entry = Object.entries(tileStatus).find(([_k, _v]) => _v);
              if (entry) {
                const [k, data] = entry;
                const {
                  startCount,
                  count,
                  dirs,
                  playerIndex,
                  isInManaPool
                } = data;
                const deathTiles =
                  startCount - 1 > count
                    ? [
                        "isElectrified",
                        "isOnFire",
                        "isGhosted",
                        "isWooded",
                        "isCold"
                      ]
                    : [];
                if (count) {
                  Array.isArray(dirs) &&
                    dirs.forEach((d, l) => {
                      // 2. move the status based on the direction
                      const offset = getTileOffsetFromDir(d, { i, j });
                      const nextTile = { i: i + offset.i, j: j + offset.j };
                      if (
                        isTileOnGameBoard({
                          i: nextTile.i,
                          j: nextTile.j
                        })
                      ) {
                        let direction = [d];
                        if (count < startCount && k === "isCold") {
                          const tileDirMapping = [
                            "up",
                            "up right",
                            "down right",
                            "down",
                            "down left",
                            "up left"
                          ];
                          const newDir =
                            tileDirMapping[count % tileDirMapping.length];
                          direction = [newDir];
                          // const [_, newDirs] = getAdjacentTilesFromTile(
                          //   { i, j },
                          //   nextTile,
                          //   scale,
                          //   3
                          // );
                          // direction = [...d, ...newDirs];
                        } else if (
                          k === "isElectrified" &&
                          isInManaPool &&
                          count === startCount - 3
                        ) {
                          const [_, newDirs] = getAdjacentTilesFromTile(
                            { i, j },
                            nextTile,
                            scale,
                            3
                          );
                          direction = newDirs;
                        } else if (
                          k === "isOnFire" ||
                          (k === "isBubble" && count === startCount) ||
                          (k === "isBubble" && isInManaPool) ||
                          k === "isShielded"
                          // || (k === "isWooded" && count > 9)
                        ) {
                          direction = dirs;
                        } else if (
                          k === "isGhosted" ||
                          k === "isWooded"
                          // ||
                          // (k === "isElectrified" &&
                          //   isInManaPool &&
                          //   count > startCount - 3)
                        ) {
                          const targetIndex = playerIndex ? 0 : 1;
                          const targetTile = playerData
                            ? playerData[targetIndex].tile
                            : { i, j };
                          const [_, targetDirection] = getAdjacentTilesFromTile(
                            nextTile,
                            targetTile,
                            scale,
                            1
                          );
                          direction = targetDirection;
                        }
                        const _count =
                          count -
                          getRandomIntInRange({
                            min: count - 2,
                            max: count - 1
                          });
                        const nextTileCount =
                          _statuses[nextTile.i][nextTile.j][k] &&
                          _statuses[nextTile.i][nextTile.j][k].count
                            ? _statuses[nextTile.i][nextTile.j][k].count
                            : 0;
                        // console.log({ _count, nextTileCount, l });
                        _statuses[nextTile.i][nextTile.j][k] = {
                          dirs: direction,
                          count:
                            k === "isWooded" && // this is broken nextTile
                            dirs.length > 1 &&
                            l > 0 &&
                            nextTileCount < _count - 1
                              ? _count - 1
                              : count - 1,
                          playerIndex: playerIndex,
                          startCount,
                          isInManaPool
                        };
                        const nextTilesStatus = solveForStatus(
                          _statuses[nextTile.i][nextTile.j]
                        );
                        _statuses[nextTile.i][nextTile.j] = nextTilesStatus;
                        _statuses[nextTile.i][nextTile.j].updateKey = updateKey;
                      }
                      // 3. erase current tile's state if not: isElectrified
                      const doNotErase = [
                        "isElectrified",
                        "isShielded",
                        "isWooded"
                      ];
                      const playerOnTileStatus = playerData.find(
                        ({ tile }) => tile.i === i && tile.j === j
                      );
                      playerOnTileStatus &&
                        deathTiles.includes(k) &&
                        incrementPlayerLives(playerOnTileStatus.i);
                      _statuses[i][j][k] =
                        !doNotErase.includes(k) ||
                        // (k === "isShielded" && count === startCount) ||
                        (k === "isWooded" && count === startCount) ||
                        (k === "isOnFire" && count === startCount) ||
                        playerOnTileStatus
                          ? undefined
                          : {
                              ...tileStatus[k],
                              count: 0
                            };
                      _statuses[i][j].updateKey = updateKey;
                    });
                } else {
                  Array.isArray(dirs) &&
                    dirs.forEach(d => {
                      // 3. erase current tile's state.
                      const doNotErase = [("isShielded", "isWooded")];
                      const playerOnTileStatus = playerData.find(
                        ({ tile }) => tile.i === i && tile.j === j
                      );
                      playerOnTileStatus &&
                        deathTiles.includes(k) &&
                        incrementPlayerLives(playerOnTileStatus.i);
                      _statuses[i][j][k] =
                        !doNotErase.includes(k) || playerOnTileStatus
                          ? undefined
                          : {
                              ...tileStatus[k],
                              count: 0
                            };
                    });
                }
              }
              _statuses[i][j].updateKey = updateKey;
            }
          }
        }
        return _statuses;
      } else {
        return _statuses;
      }
    });
  };
  useInterval(() => {
    let highlightedTiles = [];
    if (playerData && playerData[0]) {
      if (hoverLookupString) {
        const [i, j] = hoverLookupString.split(" ");
        const lastTile =
          Array.isArray(path) && path[path.length - 1]
            ? path[path.length - 1]
            : { i: -1, j: -1 };
        if (
          playerData &&
          playerData[0] &&
          playerData[0].moveToTiles.length === 0 &&
          `${lastTile.i} ${lastTile.j}` === hoverLookupString
        ) {
          highlightedTiles = path.map(t => {
            return { h_i: t.i, h_j: t.j };
          });
        } else if (!graveyardTileKeys.find(key => key === hoverLookupString)) {
          const _path = findPath(
            playerData[0].tile,
            { i: Number(i), j: Number(j) },
            scale,
            graveyardTileKeys
          );
          highlightedTiles = _path.map(t => {
            return { h_i: t.i, h_j: t.j };
          });
          setPath(_path);
        }
      } else if (
        playerData &&
        playerData[0] &&
        playerData[0].moveToTiles.length > 0
      ) {
        highlightedTiles = playerData[0].moveToTiles.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
      }
    }
    // console.log(tileStatuses);
    redrawTiles(highlightedTiles);
    updateTileState();
  }, 250);
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
                  isPlayer:
                    playerData.find(
                      ({ tile }) => tile.i === i && tile.j === j
                    ) &&
                    playerData.find(({ tile }) => tile.i === i && tile.j === j)
                      .i,
                  isGraveyard: graveyardTileKeys.find(
                    key => key === `${i} ${j}`
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
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      // move the player to the clicked tile.
      if (!graveyardTileKeys.find(key => key === `${i} ${j}`)) {
        setPlayerMoveToTiles(path);
      }
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju = kaijuData.map((k, i) => (
    <Kaiju
      key={k.i}
      charLocation={k.charLocation}
      color={k.color}
      scale={scale}
    />
  ));
  const powerUps = powerUpData.map((k, i) => (
    <PowerUp
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
      color={p.color}
      scale={scale}
      isInManaPool={p.isInManaPool}
    />
  ));
  return (
    <Board width={width} height={height}>
      <ShiftContentOver scale={scale}>
        {tiles}
        {powerUps}
        {kaiju}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
