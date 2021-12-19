import { useState, useEffect, useRef } from "react";
import {
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PLAYER_ABILITIES,
  PERIMETER_TILES
} from "./gameState";
import { HexagonTile } from "../GameBoard/Tile/HexagonTile";
export const spawnGraveyards = setGraveyardTiles => {
  // find a random tile that is not a bridge tile
  const notBridgeTiles = Object.values(PENINSULA_TILE_LOOKUP).filter(
    val => !BRIDGE_TILES[`${val.i} ${val.j}`]
  );
  const randomInt = getRandomIntInRange({
    max: notBridgeTiles.length - 1
  });
  const randStartingTile = notBridgeTiles[randomInt];
  // from that starting tile recur outward,
  // adding all adjacent tiles for each adjacent tile to a result array.
  const _flattenedArray = [randStartingTile];
  const result = { isFound: false, tiles: [] };
  const recur = (tile, flattenedArray, remainingTiles, result) => {
    if (result.isFound) return;
    if (!remainingTiles.length) {
      result.isFound = true;
      result.tiles = flattenedArray;
    }
    const tiles = getAdjacentTiles(tile).filter(t =>
      flattenedArray.every(entry => !(entry.i === t.i && entry.j === t.j))
    );
    for (let i = 0; i < tiles.length; i++) {
      recur(
        tiles[i],
        [...flattenedArray, tiles[i]],
        remainingTiles.filter(t => tiles[i].i !== t.i && tiles[i].j !== t.j),
        result
      );
    }
  };
  recur(randStartingTile, _flattenedArray, notBridgeTiles, result);
  console.log(result.tiles);
  const graveyardTiles = [];
  result.tiles.forEach((t, i) => !(i % 12) && graveyardTiles.push(t));
  console.log(graveyardTiles);
  setGraveyardTiles(graveyardTiles);
};
export const spawnPowerUp = (
  powerUpData,
  setPowerUpData,
  elementPickUps,
  setElementPickUps,
  graveyardTileKeys,
  playerData,
  scale
) => {
  if (powerUpData.length < 2 && elementPickUps.length) {
    const freeTiles = Object.entries(PENINSULA_TILE_LOOKUP).filter(
      (k, v) =>
        k !== graveyardTileKeys.every(key => key !== k) &&
        playerData.every(
          ({ tile }) =>
            `${tile.i} ${tile.j}` !== k &&
            playerData.every(({ tile }) =>
              getAdjacentTiles(tile).every(t => `${t.i} ${t.j}` !== k)
            )
        )
    );
    const randInt = getRandomIntInRange({ max: freeTiles.length - 1 });
    const randInt2 = getRandomIntInRange({
      max: elementPickUps.length - 1
    });
    const ability = elementPickUps[randInt2];
    setElementPickUps(_pickups => {
      _pickups.splice(randInt2, 1);
      return _pickups;
    });
    const [k, v] = freeTiles[randInt];
    const location = getCharXAndY({ ...v, scale });
    setPowerUpData(_powerUps => {
      return [
        ..._powerUps,
        {
          charLocation: location,
          key: k,
          tile: v,
          element: ability,
          color: "white"
        }
      ];
    });
  }
};
export const spawnKaiju = (
  playerData,
  setKaijuData,
  setTileStatuses,
  scale
) => {
  const minX = 0;
  const minY = 30;
  const maxX = 490;
  const maxY = 800;
  const randIntX = getRandomIntInRange({ min: minX, max: maxX });
  const randIntY = getRandomIntInRange({ min: minY, max: maxY });
  const randBool1 = Math.random() > 0.5;
  const randBool2 = Math.random() > 0.5;
  const randPlayerIndex = getRandomIntInRange({
    max: playerData.length - 1
  });
  const location = randBool1
    ? { x: randIntX, y: randBool2 ? minY : maxY }
    : { x: randBool2 ? minX : maxX, y: randIntY };
  const kaijuTile = getClosestPerimeterTileFromLocation({
    ...location,
    scale
  });
  const normVec = getNormVecFromTiles(
    kaijuTile,
    playerData[randPlayerIndex].tile,
    scale
  );
  const [_, dirs] = getAdjacentTilesFromNormVec(kaijuTile, normVec, scale, 1);
  const key = Math.random();
  setKaijuData(_kaiju => [
    ..._kaiju,
    {
      key,
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [kaijuTile],
      tile: kaijuTile,
      color: "purple",
      isThere: false,
      moveSpeed: 14,
      abilities: [
        () =>
          PLAYER_ABILITIES["kaiju"](
            key,
            dirs,
            _kaiju.length,
            setKaijuData,
            setTileStatuses,
            scale
          )
      ],
      isKaiju: true
    }
  ]);
};
export const updateHighlightedTiles = (
  setHighlightedTiles,
  playerData,
  graveyardTileKeys,
  hoverLookupString,
  path,
  setPath,
  scale
) => {
  let _highlightedTiles = [];
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
        _highlightedTiles = path.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
      } else if (!graveyardTileKeys.find(key => key === hoverLookupString)) {
        const _path = findPath(
          playerData[0].tile,
          { i: Number(i), j: Number(j) },
          scale,
          graveyardTileKeys
        );
        _highlightedTiles = _path.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
        setPath(_path);
      }
    } else if (
      playerData &&
      playerData[0] &&
      playerData[0].moveToTiles.length > 0
    ) {
      _highlightedTiles = playerData[0].moveToTiles.map(t => {
        return { h_i: t.i, h_j: t.j };
      });
    }
  }
  setHighlightedTiles(_highlightedTiles);
};
export const redrawTiles = (
  highlightedTiles,
  setHoverRef,
  setClickedTile,
  setTiles,
  playerData,
  graveyardTileKeys,
  tileStatuses,
  setTileStatuses,
  incrementPlayerLives,
  width,
  height,
  scale
) => {
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
                  playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
                  playerData.find(({ tile }) => tile.i === i && tile.j === j).i,
                isGraveyard: graveyardTileKeys.find(key => key === `${i} ${j}`)
              }}
            />
          );
        }
      }
    }
    setTiles(_tiles);
  }
};
export const updateTileState = (
  playerData,
  setTileStatuses,
  incrementPlayerLives,
  width,
  height,
  scale
) => {
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
                      // "isElectrified",
                      // "isOnFire",
                      // "isGhosted",
                      // "isWooded",
                      // "isCold"
                      "isMonster"
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
                      ) {
                        direction = dirs;
                      } else if (k === "isGhosted" || k === "isWooded") {
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
                      } else if (k === "isMonster") {
                        const targetIndex = getClosestPlayerFromTile(
                          { i, j },
                          playerData,
                          scale
                        );
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
export const isTileOnGameBoard = tile => {
  return PENINSULA_TILE_LOOKUP
    ? Object.keys(PENINSULA_TILE_LOOKUP).includes(`${tile.i} ${tile.j}`)
    : false;
};
export const getClosestPerimeterTileFromLocation = ({ x, y, scale }) => {
  let closest = { distance: Number.MAX_SAFE_INTEGER, tile: { i: 0, j: 0 } };
  Object.values(PERIMETER_TILES).forEach(({ i, j }) => {
    const distance = getDistance(getCharXAndY({ i, j, scale }), { x, y });
    if (closest.distance > distance) closest = { distance, tile: { i, j } };
  });
  return closest.tile;
};
export const getClosestPlayerFromTile = (currTile, playerData, scale) => {
  let closest = { distance: Number.MAX_SAFE_INTEGER, playerIndex: 0 };
  playerData.forEach(({ tile }, i) => {
    const distance = getDistance(
      getCharXAndY({ ...tile, scale }),
      getCharXAndY({ ...currTile, scale })
    );
    if (closest.distance > distance) closest = { distance, playerIndex: i };
  });
  return closest.playerIndex;
};
export const respawnPlayers = (
  setPlayerData,
  graveyardData,
  setGraveyardData,
  setWinner,
  scale
) => {
  setPlayerData(_players => {
    return _players.map((p, k) => {
      if (p.lives < 1) {
        const enemyPlayer = k === 0 ? _players[1] : _players[0];
        if (Array.isArray(graveyardData) && graveyardData.length) {
          const distances = graveyardData.map(g =>
            getDistance(
              getCharXAndY({ ...g.tile, scale }),
              enemyPlayer.charLocation
            )
          );
          const farthestGraveyard = distances.reduce(
            (acc, distance, j) =>
              distance > acc.distance
                ? { j, tile: graveyardData[j].tile, distance }
                : acc,
            { j: 0, tile: graveyardData[0].tile, distance: distances[0] }
          );
          if (farthestGraveyard) {
            const { tile } = farthestGraveyard;
            const location = getCharXAndY({ ...tile, scale });
            setGraveyardData(graveyards =>
              farthestGraveyard
                ? graveyards.filter((g, j) => j !== farthestGraveyard.j)
                : graveyards
            );
            return {
              ...p,
              lives: 1,
              moveToTiles: [],
              tile: farthestGraveyard.tile,
              charLocation: location,
              moveToLocation: location,
              moveFromLocation: location,
              isThere: true
            };
          } else {
            return p;
          }
        } else {
          setWinner(enemyPlayer);
          return p;
        }
      } else {
        return p;
      }
    });
  });
};
export const shootPower = ({
  setPlayerData,
  setTileStatuses,
  scale,
  count,
  statusKey,
  numTiles,
  sideEffectObject,
  playerIndex
}) => {
  setPlayerData(_players => {
    _players.forEach(p => {
      if (playerIndex === p.i) {
        const playerTile = p.tile;
        const enemyIndex = p.i === 0 ? 1 : 0;
        const enemyTile =
          _players.length - 1 >= enemyIndex
            ? _players[enemyIndex].tile
            : { i: 0, j: 0 };
        if (playerTile && enemyTile) {
          const [manaPoolCount, manaPoolNumTiles] = p.isInManaPool
            ? statusKey === "isShielded"
              ? [3, 5]
              : statusKey === "isWooded"
              ? [20, 3]
              : statusKey === "isOnFire"
              ? [30, 3]
              : // : statusKey === "isElectrified"
              // ? [60, 5]
              statusKey === "isGhosted"
              ? [60, 3]
              : statusKey === "isBubble"
              ? [7, 6]
              : [null, null]
            : [null, null];
          // console.log(
          //   p.isInManaPool,
          //   statusKey,
          //   manaPoolCount,
          //   manaPoolNumTiles
          // );
          const [tile, dirs] = getAdjacentTilesFromTile(
            playerTile,
            enemyTile,
            scale,
            manaPoolNumTiles ? manaPoolNumTiles : numTiles
          );
          setTileWithStatus(
            setTileStatuses,
            statusKey,
            tile,
            dirs,
            manaPoolCount ? manaPoolCount : count,
            playerIndex,
            p.isInManaPool
          );
        }
      }
    });
    return _players.map(p =>
      playerIndex === p.i ? { ...p, ...sideEffectObject } : p
    );
  });
};
export const shootKaijuPower = ({
  setKaijuData,
  setTileStatuses,
  scale,
  count,
  statusKey,
  numTiles,
  dir,
  index
}) => {
  setKaijuData(_kaiju => {
    // {
    //   setKaijuData,
    //   setTileStatuses,
    //   scale,
    //   count: 30,
    //   statusKey: "isMonster",
    //   numTiles: 1,
    //   index: i,
    //   dir
    // }

    _kaiju.forEach(
      (k, i) =>
        index === i &&
        setTileWithStatus(
          setTileStatuses,
          statusKey,
          k.tile,
          dir,
          count,
          i,
          false
        )
    );
    return _kaiju;
  });
};
export const setTileWithStatus = (
  setTileStatuses,
  statusName,
  currTile,
  dirs,
  count,
  playerIndex,
  isInManaPool
) => {
  setTileStatuses(_tiles => {
    _tiles[currTile.i][currTile.j] = {
      ..._tiles[currTile.i][currTile.j],
      [statusName]: {
        dirs,
        count,
        playerIndex,
        startCount: count,
        isInManaPool
      }
    };
    return _tiles;
  });
};
export const solveForStatus = tile => {
  if (tile.isGraveyard) {
    return {
      isGraveyard: tile.isGraveyard
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isBubble) {
    return {
      isBubble: tile.isBubble
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isGhosted) {
    return {
      isGhosted: tile.isGhosted
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isShielded) {
    return {
      isShielded: tile.isShielded
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isElectrified) {
    return {
      isElectrified: tile.isElectrified
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isCold) {
    return {
      isCold: tile.isCold
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isOnFire) {
    return {
      isOnFire: tile.isOnFire
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isWooded) {
    return {
      isWooded: tile.isWooded
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else if (tile.isMonster) {
    return {
      isMonster: tile.isMonster
      // count: tile.count,
      // playerIndex: tile.playerIndex
    };
  } else {
    return tile;
  }
};
export const getRandBool = () => {
  return Math.random() > 0.5;
};
export const getAdjacentTilesFromTile = (
  currTile,
  destTile,
  scale,
  numTiles
) => {
  const normVec = getNormVecFromTiles(currTile, destTile, scale);
  return getAdjacentTilesFromNormVec(currTile, normVec, scale, numTiles);
};
export const getTileDiff = (currTile, destTile) => {
  return {
    x: destTile.i - currTile.i,
    y: destTile.j - currTile.j
  };
};
export const getNormVecFromTiles = (currTile, destTile, scale) => {
  const currXY = getCharXAndY({ ...currTile, scale });
  const destXY = getCharXAndY({ ...destTile, scale });
  const distance = getDistance(currXY, destXY);
  return (
    distance && {
      x: (destXY.x - currXY.x) / distance,
      y: (destXY.y - currXY.y) / distance
    }
  );
};
export const getTileOffsetFromDir = (dir, currTile) => {
  switch (dir) {
    case "up":
      return { i: 0, j: -1 }; // up
      break;
    case "up right":
      return { i: 1, j: currTile.i % 2 ? 0 : -1 }; // up right
      break;
    case "down right":
      return { i: 1, j: currTile.i % 2 ? 1 : 0 }; // down right
      break;
    case "down":
      return { i: 0, j: 1 }; // down
      break;
    case "down left":
      return { i: -1, j: currTile.i % 2 ? 1 : 0 }; // down left
      break;
    case "up left":
      return { i: -1, j: currTile.i % 2 ? 0 : -1 }; // up left
      break;
    default:
      return { i: 0, j: 0 };
  }
};
export const getAdjacentTilesFromNormVec = (
  currTile,
  normVec,
  scale,
  numTiles
) => {
  const directionMapping = [
    { x: 0, y: -1 },
    { x: 0.868, y: -0.496 },
    { x: 0.868, y: 0.496 },
    { x: 0, y: 1 },
    { x: -0.868, y: 0.496 },
    { x: -0.868, y: -0.496 }
  ];
  const tileIndexMapping = [
    { i: 0, j: -1 }, // up
    { i: 1, j: currTile.i % 2 ? 0 : -1 }, // up right
    { i: 1, j: currTile.i % 2 ? 1 : 0 }, // down right
    { i: 0, j: 1 }, // down
    { i: -1, j: currTile.i % 2 ? 1 : 0 }, // down left
    { i: -1, j: currTile.i % 2 ? 0 : -1 } // up left
  ];
  const distance = getDistance(directionMapping[0], normVec);
  const closest = directionMapping.reduce(
    (acc, item, i) => {
      const distance = getDistance(item, normVec);
      return distance < acc.distance ? { i, coords: item, distance } : acc;
    },
    { i: 0, coords: directionMapping[0], distance: distance }
  );
  const tileDirMapping = [
    "up",
    "up right",
    "down right",
    "down",
    "down left",
    "up left"
  ];
  const i = closest.i;
  const spawnPowerTile = {
    i: currTile.i + tileIndexMapping[i].i,
    j: currTile.j + tileIndexMapping[i].j
  };
  if (numTiles >= 6) {
    return [spawnPowerTile, tileDirMapping];
  } else if (numTiles) {
    const dirs = [tileDirMapping[i]];
    for (let k = 1; k < numTiles - 1; k++) {
      const l = i - k < 0 ? 6 - i - k : i - k;
      const m = i + k > 5 ? -1 * (6 - k - i) : i + k;
      dirs.push(tileDirMapping[l]);
      dirs.push(tileDirMapping[m]);
    }
    return [spawnPowerTile, dirs];
  } else {
    return [spawnPowerTile, []];
  }
};
export const returnNotNaN = (num, fallback) => {
  return num && !Number.isNaN(num) ? num : fallback ? fallback : 0;
};
export const getRandomIntInRange = ({ min = 0, max }) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max + 1);
  const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
  return randomInt;
};
export const getTileXAndY = ({ i, j, scale }) => {
  const x = (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale;
  return { x, y };
};
export const getRandAdjacentTile = ({ i, j }) => {
  let newTile = { i: -1, j: -1 };
  while (!PENINSULA_TILE_LOOKUP[`${newTile.i} ${newTile.j}`])
    newTile = {
      i: Math.random() > 0.66 ? i + 1 : Math.random() > 0.33 ? i : i - 1,
      j: Math.random() > 0.66 ? j + 1 : Math.random() > 0.33 ? j : j - 1
    };
  return newTile;
};
export const getRandomAdjacentLocation = (location, scale) => {
  const tile = getTileIAndJFromCharXAndY(location.x, location.y, scale);
  if (tile) {
    const highlightedTiles = Object.values(PENINSULA_TILE_LOOKUP)
      .map(v => (isAdjacent(tile, { i: v.i, j: v.j }) ? v : null))
      .filter(v => v !== null);
    const randInt = getRandomIntInRange({
      max: highlightedTiles.length - 1
    });
    const { i, j } = highlightedTiles[randInt];
    return getCharXAndY({ i, j, scale });
  }
};
// x and y shifted to position character on tile.
export const getCharXAndY = ({ i, j, scale }) => {
  const x =
    (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * scale + 52.5 * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale + 42.5 * scale;
  return { x, y };
};
// Canvas has a different x and y scale
export const getManaWellXAndY = ({ i, j, scale }) => {
  return { x: (i * 42 + 20) * scale, y: (j * 15 - 5) * scale };
};
export const getIAndJFromManaWellXAndY = ({ x, y, scale }) => {
  return { i: (x / scale - 20) / 42, j: (y / scale + 5) / 15 };
};
export const getTileIAndJFromCharXAndY = (xToFind, yToFind, scale) => {
  return Object.values(PENINSULA_TILE_LOOKUP).find(tile => {
    const { i, j } = tile;
    const { x, y } = getCharXAndY({ i, j, scale });
    return x === xToFind && y === yToFind;
  });
};
const getDistance = (to, from) => {
  return Math.sqrt(
    (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
  );
};
export const movePiece = (
  data,
  setData,
  powerUpData,
  setPowerUpData,
  setTileStatuses,
  graveyardTileKeys,
  scale,
  accTime
) =>
  setData(_data => {
    for (let i = 0; i < _data.length; i++) {
      // set logic for enemy player
      if (i === 1) {
        if (powerUpData && powerUpData.length) {
          // find the closest kaiju
          const closetPowerUp = powerUpData.reduce(
            (acc, powerUp, j) => {
              const distToPowerUp = getDistance(
                getCharXAndY({ ...powerUp.tile, scale }),
                getCharXAndY({ ..._data[1].tile, scale })
              );
              if (acc.distance && distToPowerUp < acc.distance) {
                return {
                  distance: distToPowerUp,
                  tile: powerUp.tile
                };
              } else return acc;
            },
            { distance: Number.MAX_SAFE_INTEGER }
          );
          // get path
          const moveToTiles =
            _data[1].tile &&
            closetPowerUp.tile &&
            findPath(
              _data[1].tile,
              closetPowerUp.tile,
              scale,
              graveyardTileKeys
            );
          _data[i].moveToTiles = moveToTiles;
        }
        // use powers
        if (_data[1].abilities.length) {
          const numTilesFromPlayer =
            _data[1].tile &&
            _data[0].tile &&
            findPath(_data[1].tile, _data[0].tile, scale, graveyardTileKeys)
              .length;
          if (numTilesFromPlayer !== undefined) {
            const powersToFire = _data[1].abilities.forEach((a, j) => {
              if (
                a.type === "offensive" &&
                a.count >= numTilesFromPlayer &&
                Math.abs(accTime - a.accTime) >= a.cooldownTime
              ) {
                _data[1].abilities[j].accTime = accTime;
                a.activateActive(1, setData, setTileStatuses, scale);
              }
            });
          }
        }
      }
      // - - - - - - - - - - -
      if (
        _data[i].charLocation &&
        _data[i].moveFromLocation &&
        _data[i].moveToLocation &&
        (!_data[i].isThere || _data[i].moveToTiles.length)
      ) {
        const { newLocation, hasArrived } = moveTo({
          currentLocation: _data[i].charLocation,
          moveFromLocation: _data[i].moveFromLocation,
          moveToLocation: _data[i].moveToLocation,
          moveSpeed: _data[i].moveSpeed
        });
        _data[i].charLocation = newLocation;
        _data[i].isThere = hasArrived;
        // check tile for powerups
        if (powerUpData) {
          const powerup = powerUpData.find(
            ({ tile }) =>
              tile.i === _data[i].tile.i && tile.j === _data[i].tile.j
          );
          if (powerup) {
            if (!_data[i].abilities.find(a => a.element === powerup.element))
              _data[i].abilities.push(PLAYER_ABILITIES[powerup.element]);
            setPowerUpData(_powerups => _powerups.filter(k => k !== powerup));
          }
        }
        // - - - - - - - - - - -
        // if Kaiju, and at the tile, cast power.
        if (
          _data[i].isKaiju &&
          _data[i].isThere &&
          !_data[i].moveToTiles.length
        ) {
          _data[i].abilities[0]();
        }
        // - - - - - - - - - - -
        if (_data[i].isThere && _data[i].moveToTiles.length) {
          const [nextTile, ...tiles] = _data[i].moveToTiles;
          if (!tiles.length) {
            _data[i].moveToLocation =
              getCharXAndY({
                ...nextTile,
                scale
              }) || _data[i].moveToLocation;
            _data[i].tile = nextTile;
            _data[i].moveFromLocation = _data[i].charLocation;
            _data[i].moveToTiles = [];
            _data[i].isThere = false;
          } else {
            _data[i].tile = nextTile;
            _data[i].moveToTiles = tiles;
            _data[i].moveFromLocation = newLocation;
            _data[i].moveToLocation = getCharXAndY({
              ...nextTile,
              scale
            });
          }
        }
      }
    }
    return _data;
  });
export const moveTo = ({
  currentLocation,
  moveFromLocation,
  moveToLocation,
  moveSpeed
}) => {
  const distanceFromStart = getDistance(moveFromLocation, currentLocation);
  const distanceToFinish = getDistance(moveToLocation, currentLocation);
  const totalDistance = getDistance(moveFromLocation, moveToLocation);
  const x_To = moveToLocation.x;
  const y_To = moveToLocation.y;
  const { x, y } = currentLocation;
  const x_dir = distanceToFinish
    ? (moveToLocation.x - x) / distanceToFinish
    : 0;
  const y_dir = distanceToFinish
    ? (moveToLocation.y - y) / distanceToFinish
    : 0;
  const hasArrived =
    distanceToFinish < moveSpeed || distanceFromStart > totalDistance;
  return {
    newLocation: {
      x: x + x_dir * moveSpeed,
      y: y + y_dir * moveSpeed
    },
    hasArrived
  };
};
// https://overreacted.io/making-setinterval-declarative-with-react-hooks/
export const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};
export const useHover = () => {
  const [value, setValue] = useState(null);
  const handleMouseOver = key => setValue(key);
  const handleMouseOut = () => setValue(null);
  const ref = useRef({}).current;
  const saveRef = key => r => {
    ref[key] = r;
    r && r.addEventListener("mouseover", () => handleMouseOver(key));
    r && r.addEventListener("mouseout", handleMouseOut);
  };
  useEffect(() => {
    if (ref && ref.current) {
      return () =>
        Object.values(ref.current).forEach(i => {
          ref.current[i].removeEventListener("mouseover", handleMouseOver);
          ref.current[i].removeEventListener("mouseout", handleMouseOut);
        });
    }
  }, [ref.current]);
  return [saveRef, value];
};
export const useKeyPress = (callback, keyCodes, state) => {
  const handler = ({ code }) => {
    if (Array.isArray(keyCodes) && keyCodes.includes(code)) {
      state ? callback(code, state) : callback(code);
    } else if (keyCodes === code) {
      state ? callback(code, state) : callback(code);
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);
};
export const getFlattenedArrayIndex = (i, j, ROW_LENGTH = 33) => {
  return ROW_LENGTH * i + j;
};
export const getIndicesFromFlattenedArrayIndex = (k, ROW_LENGTH = 33) => {
  const i = Math.floor(k / ROW_LENGTH);
  const j = k % ROW_LENGTH;
  return { i, j };
};
export const isAdjacent = (tile1, tile2) => {
  const key1 = `${tile1.i} ${tile1.j}`;
  const key2 = `${tile2.i} ${tile2.j}`;
  return PENINSULA_TILE_LOOKUP[key1] !== undefined &&
    PENINSULA_TILE_LOOKUP[key2] !== undefined
    ? tile1.i % 2
      ? Math.abs(tile1.i - tile2.i) < 2 &&
        Math.abs(tile1.j - tile2.j) < 2 &&
        !(tile1.i - 1 === tile2.i && tile1.j - 1 === tile2.j) &&
        !(tile1.i + 1 === tile2.i && tile1.j - 1 === tile2.j)
      : Math.abs(tile1.i - tile2.i) < 2 &&
        Math.abs(tile1.j - tile2.j) < 2 &&
        !(tile1.i - 1 === tile2.i && tile1.j + 1 === tile2.j) &&
        !(tile1.i + 1 === tile2.i && tile1.j + 1 === tile2.j)
    : false;
};
export const getRandomCharacterLocation = scale => {
  const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
  const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
  const { i, j } = tileIndices[randomInt];
  const { x, y } = getCharXAndY({ i, j, scale });
  return { x, y };
};
export const checkIsInManaPool = ({
  setPlayerData,
  kaiju2Data,
  kaiju1Data
}) => {
  setPlayerData(_playerData =>
    _playerData.map((p, i) => {
      return {
        ...p,
        isInManaPool: isLocatonInsidePolygon(
          i
            ? kaiju2Data.map(k => k.charLocation)
            : kaiju1Data.map(k => k.charLocation),
          p.charLocation
        )
      };
    })
  );
};
export const isLocatonInsidePolygon = (polygon, p) => {
  var isInside = false;
  var minX = polygon[0].x,
    maxX = polygon[0].x;
  var minY = polygon[0].y,
    maxY = polygon[0].y;
  for (var n = 1; n < polygon.length; n++) {
    var q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }
  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
    return false;
  }
  var i = 0,
    j = polygon.length - 1;
  for (i, j; i < polygon.length; j = i++) {
    if (
      polygon[i].y > p.y != polygon[j].y > p.y &&
      p.x <
        ((polygon[j].x - polygon[i].x) * (p.y - polygon[i].y)) /
          (polygon[j].y - polygon[i].y) +
          polygon[i].x
    ) {
      isInside = !isInside;
    }
  }
  return isInside;
};
export const getAdjacentTiles = tile => {
  return [
    { i: 0, j: -1 },
    { i: 1, j: tile.i % 2 ? 0 : -1 },
    { i: 1, j: tile.i % 2 ? 1 : 0 },
    { i: 0, j: 1 },
    { i: -1, j: tile.i % 2 ? 1 : 0 },
    { i: -1, j: tile.i % 2 ? 0 : -1 }
  ]
    .map(t => {
      return { i: t.i + tile.i, j: t.j + tile.j };
    })
    .filter(t => PENINSULA_TILE_LOOKUP[`${t.i} ${t.j}`]);
};
export const findPath = (start, goal, scale, graveyardTileKeys) => {
  let count = 0;
  // const duplicateLookup = {};
  return recur(start, [], count);
  // .filter(t => {
  //   if (!duplicateLookup[`${t.i} ${t.j}`]) {
  //     duplicateLookup[`${t.i} ${t.j}`] = t;
  //     return t;
  //   }
  // });
  function recur(currTile, arr, count) {
    if ((currTile.i === goal.i && currTile.j === goal.j) || count > 400)
      return arr;
    // produce all possible adjacent tile indices to currTile
    const adjacentTiles = getAdjacentTiles(currTile);
    // get all charXAndY for each confirmed adjacent tile
    const goalXY = getCharXAndY({ ...goal, scale });
    const test = getCharXAndY({ ...adjacentTiles[0], scale });
    const shortest = {
      tile: adjacentTiles[0],
      distance: getDistance(test, goalXY)
    };
    adjacentTiles.forEach(t => {
      const adjXY = getCharXAndY({ ...t, scale });
      const distance = getDistance(adjXY, goalXY);
      if (distance < shortest.distance) {
        shortest.tile = t;
        shortest.distance = distance;
      }
    });
    if (
      (shortest.tile.i === currTile.i && shortest.tile.j === currTile.j) ||
      graveyardTileKeys.includes(`${shortest.tile.i} ${shortest.tile.j}`)
    ) {
      // const randTile = getRandAdjacentTile(currTile);
      const keyedArr = arr.map(({ i, j }) => `${i} ${j}`);
      const remainingTiles = adjacentTiles.filter(
        ({ i, j }) => !keyedArr.includes(`${i} ${j}`)
      );
      const randInt = getRandomIntInRange({ max: remainingTiles.length - 1 });
      const randTile = remainingTiles[randInt];
      const _arr = [...arr, randTile];
      return recur(randTile, _arr, count + 1);
    } else {
      const _arr = [...arr, shortest.tile];
      return recur(shortest.tile, _arr, count + 1);
    }
  }
};
