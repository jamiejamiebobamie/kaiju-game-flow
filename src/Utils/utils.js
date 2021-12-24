import { useState, useEffect, useRef } from "react";
import {
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PLAYER_ABILITIES,
  PERIMETER_TILES
} from "./gameState";
import { HexagonTile } from "../GameBoard/Tile/HexagonTile";
export const spawnPowerUp = (
  powerUpData,
  setPowerUpData,
  elementPickUps,
  setElementPickUps,
  playerData,
  scale
) => {
  if (powerUpData.length < 1 && getRandBool()) {
    const freeTiles = Object.entries(PENINSULA_TILE_LOOKUP).filter((k, v) =>
      playerData.every(
        ({ tile }) =>
          `${tile.i} ${tile.j}` !== k &&
          playerData.every(({ tile }) =>
            getAdjacentTiles(tile).every(t => `${t.i} ${t.j}` !== k)
          )
      )
    );
    const randInt = getRandomIntInRange({ max: freeTiles.length - 1 });
    const [k, v] = freeTiles[randInt];
    const location = getCharXAndY({ ...v, scale });
    setPowerUpData(_powerUps => {
      return [
        ..._powerUps,
        {
          charLocation: location,
          key: k,
          tile: v,
          color: "white"
        }
      ];
    });
  }
};
export const spawnKaiju = (kaijuData, playerData, scale) => {
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
  return {
    key,
    charLocation: location,
    moveFromLocation: location,
    moveToLocation: location,
    moveToTiles: [kaijuTile],
    tile: kaijuTile,
    color: "purple",
    isThere: false,
    lives: 5,
    moveSpeed: 4,
    lastDmg: 0,
    abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
    isKaiju: true,
    isOnTiles: false,
    i: kaijuData.length
  };
};
export const updateHighlightedTiles = (
  setHighlightedTiles,
  playerData,
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
      } else {
        const _path = findPath(
          playerData[0].tile,
          { i: Number(i), j: Number(j) },
          scale
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
  kaijuData,
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
                  playerData.find(
                    ({ tile, lives }) => lives && tile.i === i && tile.j === j
                  ) &&
                  playerData.find(({ tile }) => tile.i === i && tile.j === j).i,
                isKaiju: kaijuData
                  .filter(k => k.isOnTiles && k.lives)
                  .find(({ tile }) => tile.i === i && tile.j === j)
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
  kaijuData,
  setDmgArray,
  setTileStatuses,
  incrementPlayerLives,
  width,
  height,
  scale,
  accTime
) => {
  setTileStatuses(_statuses => {
    if (_statuses) {
      const rowLength = Math.ceil(width / (70 * scale));
      const colLength = Math.ceil(height / (75 * scale));
      const updateKey = Math.random();
      const newDmg = [];
      for (let i = 0; i < rowLength; i++) {
        for (let j = 0; j < colLength; j++) {
          // 1. solve what should be on the tile
          if (_statuses[i][j].updateKey !== updateKey) {
            let tileStatus = solveForStatus(_statuses[i][j]);
            const entry = Object.entries(tileStatus).find(([_k, _v]) => _v);
            if (entry) {
              const entityOnTileStatus =
                playerData.find(({ tile }) => tile.i === i && tile.j === j) ||
                kaijuData.find(({ tile }) => tile.i === i && tile.j === j);
              const playerKaijuConflictKey =
                playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
                kaijuData.find(
                  ({ tile, lives }) => tile.i === i && tile.j === j && lives
                ) &&
                playerData.find(({ tile }) => tile.i === i && tile.j === j).key;
              const [k, data] = entry;
              const {
                dirs,
                count,
                targetIndex,
                isKaiju,
                startCount,
                isInManaPool
              } = data;
              const deathTiles = [
                "isElectrified",
                "isOnFire",
                "isGhosted",
                "isWooded",
                "isCold"
              ];
              const healthTiles = ["isHealing"];
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
                      } else if (
                        k === "isGhosted" ||
                        k === "isWooded" ||
                        k === "isHealing"
                      ) {
                        const targetTile = isKaiju
                          ? playerData[targetIndex] &&
                            playerData[targetIndex].tile
                          : kaijuData[targetIndex] &&
                            kaijuData[targetIndex].tile;
                        const [_, targetDirection] = getAdjacentTilesFromTile(
                          nextTile,
                          targetTile || { i: 0, j: 0 },
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
                        targetIndex,
                        startCount,
                        isInManaPool,
                        isKaiju
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
                    _statuses[i][j][k] =
                      !doNotErase.includes(k) ||
                      (k === "isWooded" && count === startCount) ||
                      (k === "isOnFire" && count === startCount) ||
                      entityOnTileStatus
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
                    const doNotErase = ["isShielded", "isWooded"];
                    _statuses[i][j][k] =
                      !doNotErase.includes(k) || entityOnTileStatus
                        ? undefined
                        : {
                            ...tileStatus[k],
                            count: 0
                          };
                  });
              }
              if (deathTiles.includes(k) || healthTiles.includes(k)) {
                const entityOnTile = isKaiju
                  ? playerData.find(({ tile }) => tile.i === i && tile.j === j)
                  : kaijuData.find(({ tile }) => tile.i === i && tile.j === j);
                if (entityOnTile) {
                  const dmgObj = {
                    isKaiju: !isKaiju, // to determine correct state array
                    key: entityOnTile.key, // to determine correct entity in array
                    lifeDecrement: deathTiles.includes(k) ? 1 : -1, //lives + or - // possible healing ability...
                    accTime // to remove stale data from the dmgArray
                  };
                  newDmg.push(dmgObj);
                }
              }
              if (playerKaijuConflictKey) {
                const dmgObj = {
                  isKaiju: false, // to determine correct state array
                  key: playerKaijuConflictKey, // to determine correct entity in array
                  lifeDecrement: 1, //lives + or - // possible healing ability...
                  accTime // to remove stale data from the dmgArray
                };
                newDmg.push(dmgObj);
              }
            }
            _statuses[i][j].updateKey = updateKey;
          }
        }
      }
      setDmgArray(newDmg);
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
export const shootPower = ({
  data,
  dataIndex,
  targetData,
  scale,
  count,
  statusKey,
  numTiles,
  setTileStatuses
}) => {
  data.forEach(d => {
    if (dataIndex === d.i) {
      const originTile = d.tile;
      const [targetTile, targetIndex] =
        statusKey === "isHealing"
          ? [data[dataIndex === 0 ? 1 : 0].tile, dataIndex === 0 ? 1 : 0]
          : getClosestEntityFromTile(targetData, originTile, scale);
      if (originTile && targetTile) {
        const [manaPoolCount, manaPoolNumTiles] = d.isInManaPool
          ? statusKey === "isShielded"
            ? [4, 6]
            : statusKey === "isWooded"
            ? [20, 3]
            : statusKey === "isOnFire"
            ? [30, 3]
            : statusKey === "isGhosted"
            ? [60, 3]
            : statusKey === "isBubble"
            ? [7, 6]
            : statusKey === "isHealing"
            ? [30, 6]
            : [null, null]
          : [null, null];
        const [tile, dirs] = getAdjacentTilesFromTile(
          originTile,
          targetTile,
          scale,
          manaPoolNumTiles ? manaPoolNumTiles : numTiles
        );
        setTileStatuses(_tiles => {
          _tiles[tile.i][tile.j] = {
            ..._tiles[tile.i][tile.j],
            [statusKey]: {
              dirs,
              count: manaPoolCount ? manaPoolCount : count,
              targetIndex,
              isKaiju: d.isKaiju || statusKey === "isHealing",
              startCount: count,
              isInManaPool: d.isInManaPool
            }
          };
          return _tiles;
        });
      }
    }
  });
};
export const solveForStatus = tile => {
  if (tile.isHealing) {
    return { isHealing: tile.isHealing };
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
const getClosestEntityFromTile = (entityData, tile, scale) => {
  const index = entityData
    .map(entity =>
      entity.lives > 0 && entity.isOnTiles
        ? getDistance(getCharXAndY({ ...tile, scale }), entity.charLocation)
        : null
    )
    .reduce(
      (maxDistanceData, distance, j) => {
        return distance && maxDistanceData.distance > distance
          ? { j, distance }
          : maxDistanceData;
      },
      { j: -1, distance: Number.MAX_SAFE_INTEGER }
    ).j;
  return index !== -1 ? [entityData[index].tile, index] : [{ i: 0, j: 0 }, 0];
};
export const movePiece = (
  data,
  setData,
  powerUpData,
  setPowerUpData,
  tileStatuses,
  setTileStatuses,
  scale,
  accTime,
  enemyData,
  dmgArray,
  teleportData,
  setTeleportData
) =>
  setData(_data => {
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].lives) {
        // set logic for enemy player
        if (i === 1) {
          if (powerUpData) {
            // find the closest kaiju
            const [targetTile, _] = getClosestEntityFromTile(
              enemyData,
              _data[i].tile,
              scale
            );
            if (targetTile.i !== 0) {
              const attackPowersCount = _data[i].abilities.filter(
                ({ type }) => type === "offensive"
              ).length;
              const attackPowersRangeAcc = _data[i].abilities
                .filter(({ type }) => type === "offensive")
                .map(({ range }) => range)
                .reduce((acc, item) => acc + item, 0);
              const powerRangeAvg = Math.trunc(
                attackPowersRangeAcc / attackPowersCount
              );
              // get path
              const moveToTiles =
                _data[1].tile &&
                targetTile &&
                findPath(_data[1].tile, targetTile, scale);
              _data[i].moveToTiles =
                moveToTiles.length > powerRangeAvg
                  ? moveToTiles.slice(0, moveToTiles.length - powerRangeAvg)
                  : getRandomTileOnBoard(scale);
            }
          }
        }
        // use powers
        if (
          ((powerUpData && i === 1) ||
            (_data[i].isKaiju && _data[i].isOnTiles)) &&
          _data[i].abilities.length
        ) {
          const [targetTile, _] = getClosestEntityFromTile(
            enemyData,
            _data[i].tile,
            scale
          );
          // const numTilesFromPlayer =
          //   _data[1].tile &&
          //   _data[0].tile &&
          //   findPath(_data[1].tile, _data[0].tile, scale).length;
          const numTilesFromTarget =
            _data[i].tile &&
            targetTile &&
            findPath(_data[i].tile, targetTile, scale).length;
          if (numTilesFromTarget !== undefined) {
            const powersToFire = _data[i].abilities.forEach((a, j) => {
              if (
                (a.type === "offensive" &&
                  a.range >= numTilesFromTarget &&
                  accTime - a.accTime >= a.cooldownTime) ||
                accTime < a.accTime
              ) {
                _data[i].abilities[j].accTime = accTime;
                a.activateActive(
                  i,
                  data,
                  setTeleportData,
                  enemyData,
                  setTileStatuses,
                  scale
                );
              }
            });
          }
        }

        // - - - - - - - - - - -
        // if Kaiju, and just spawned set isOnTiles to true when they reach the tiles
        if (
          _data[i].isKaiju &&
          !_data[i].isOnTiles &&
          _data[i].isThere &&
          !_data[i].moveToTiles.length
        ) {
          _data[i].isOnTiles = true;
        }
        // - - - - - - - - - - -
        // if Kaiju and on tiles, move toward the closest player.
        if (_data[i].isKaiju && _data[i].isOnTiles) {
          const [targetTile, _] = getClosestEntityFromTile(
            enemyData,
            _data[i].tile,
            scale
          );
          const moveToTiles = findPath(_data[i].tile, targetTile, scale);
          _data[i].moveToTiles = moveToTiles;
        }
        // - - - - - - - - - - -
        if (
          _data[i].charLocation &&
          _data[i].moveFromLocation &&
          _data[i].moveToLocation &&
          (!_data[i].isThere || _data[i].moveToTiles.length)
        ) {
          const shouldTeleport = !!(teleportData && teleportData.includes(i));
          powerUpData && console.log(shouldTeleport, teleportData, i);
          if (shouldTeleport) {
            const tile = _data[i].moveToTiles.length
              ? _data[i].moveToTiles[_data[i].moveToTiles.length - 1]
              : _data[i].tile;
            const location = getCharXAndY({ ...tile, scale });
            _data[i].tile = tile;
            _data[i].charLocation = location; // || _data[i].moveToLocation;
            _data[i].moveToLocation = location; // || _data[i].moveToLocation;
            _data[i].moveFromLocation = location; // || _data[i].charLocation;
            _data[i].moveToTiles = [];
            _data[i].isThere = false;
          } else {
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
                _data[i].isInManaPool = true;
                _data[i].isInManaPoolAccTime = accTime;
                setPowerUpData(_powerups =>
                  _powerups.filter(k => k !== powerup)
                );
              }
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
        if (
          _data[i].isInManaPool &&
          5000 < accTime - _data[i].isInManaPoolAccTime
        )
          _data[i].isInManaPool = false;
        dmgArray
          .filter(({ isKaiju }) => !!isKaiju === _data[i].isKaiju)
          .forEach(dmg => {
            if (
              _data[i].key === dmg.key &&
              _data[i].lives &&
              ((_data[i].isKaiju && _data[i].isOnTiles) ||
                (!_data[i].isKaiju &&
                  (accTime - _data[i].lastDmg > 1000 ||
                    accTime - _data[i].lastDmg < 0)))
            ) {
              // can only get damaged once every 1 second.
              // also accTime might reset to zero, so check for that.
              _data[i].lastDmg = accTime;
              _data[i].lives -= dmg.lifeDecrement;
            }
          });
      }
    }
    teleportData && teleportData.length && setTeleportData([]);
    const newKaiju =
      !powerUpData &&
      data.length < 10 &&
      accTime &&
      !(accTime % 5000) &&
      spawnKaiju(data, enemyData, scale);
    return newKaiju ? [..._data, newKaiju] : _data;
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
export const getRandomTileOnBoard = scale => {
  const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
  const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
  return tileIndices[randomInt];
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
export const findPath = (start, goal, scale) => {
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
    if (shortest.tile.i === currTile.i && shortest.tile.j === currTile.j) {
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
