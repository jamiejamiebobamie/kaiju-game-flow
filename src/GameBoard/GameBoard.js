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
  cursor: ${props =>
    props.kaijuTokenPickedup ? "url(testKaijuTile.png), auto;" : "pointer"};
  /* color: #495a6e;
  background-color: #495a6e; */
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
  incrementPlayerLives,
  graveyardData,
  kaiju1Data,
  kaijuTokenTiles,
  setKaijuTokenTiles,
  setPlayerMoveToTiles,
  tileStatuses,
  setTileStatuses,
  kaiju2Data,
  setTestDir,
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
          isOnFire: undefined, //getRandBool() ? { i: -1, j: -1 } : null,
          isWooded: undefined, //getRandBool() ? { i: 1, j: 1 } : null,
          isElectrified: undefined, //getRandBool() ? { i: 0, j: -1 } : null,
          isBubble: undefined, //getRandBool() ? { i: -1, j: -1 } : null,
          isShielded: undefined, //getRandBool() ? { i: -1, j: -1 } : null,
          isGhosted: undefined, //getRandBool() ? { i: -1, j: -1 } : null,
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
                const deathTiles = [
                  "isElectrified",
                  "isOnFire",
                  "isGhosted",
                  "isWooded"
                ];
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
                        if (k === "isWindy") {
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
                        (k === "isShielded" && count === startCount) ||
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
                              ...tileStatus[k]
                              // count: 0
                            };
                      _statuses[i][j].updateKey = updateKey;
                    });
                }
              }
            }
          }
        }
        return _statuses;
      } else {
        return _statuses;
      }
    });
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
      // if (
      //   kaiju1Data.every(k => k.tile.i !== i && k.tile.j !== j) &&
      //   kaiju2Data.every(k => k.tile.i !== i && k.tile.j !== j) &&
      //   !kaijuTokenPickedup
      // ) {
      const path = findPath(
        playerData[0].tile,
        { i: Number(i), j: Number(j) },
        scale
      );
      highlightedTiles = path.map(t => {
        return { h_i: t.i, h_j: t.j };
      });
      // } else {
      // highlightedTiles = [{ h_i: Number(i), h_j: Number(j) }];
      // }
    } else if (goalTile) {
      const path = findPath(playerData[0].tile, goalTile, scale);
      highlightedTiles = path.map(t => {
        return { h_i: t.i, h_j: t.j };
      });
      if (!path.length) setGoalTile(null);
    }
    redrawTiles(highlightedTiles);
    updateTileState();
  }, 500);
  // useInterval(() => {
  //   redrawTiles([]);
  // }, 500);
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
                  isPlayer:
                    playerData.find(
                      ({ tile }) => tile.i === i && tile.j === j
                    ) &&
                    playerData.find(({ tile }) => tile.i === i && tile.j === j)
                      .i,
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
  // useEffect(() => redrawTiles([]), [kaijuTokenTiles]);
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
        // console.log(i, j);
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
  const manaPools = (
    <>
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
    </>
  );
  const kaiju = (
    <>
      {kaiju1}
      {kaiju2}
    </>
  );
  return (
    <Board
      kaijuTokenPickedup={kaijuTokenPickedup}
      width={width}
      height={height}
    >
      {manaPools}
      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju}
        {players}
      </ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );
};
