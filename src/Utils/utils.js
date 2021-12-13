import { useState, useEffect, useRef } from "react";
import { PENINSULA_TILE_LOOKUP } from "./gameState";

export const isTileOnGameBoard = tile => {
  return PENINSULA_TILE_LOOKUP
    ? Object.keys(PENINSULA_TILE_LOOKUP).includes(`${tile.i} ${tile.j}`)
    : false;
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
        const enemyTile = _players[enemyIndex].tile;
        if (playerTile && enemyTile) {
          const [tile, dirs] = getAdjacentTilesFromTile(
            playerTile,
            enemyTile,
            scale,
            numTiles
          );
          setTileWithStatus(
            setTileStatuses,
            statusKey,
            tile,
            dirs,
            count,
            playerIndex
          );
        }
      }
    });
    return _players.map(p =>
      playerIndex === p.i ? { ...p, ...sideEffectObject } : p
    );
  });
};
export const setTileWithStatus = (
  setTileStatuses,
  statusName,
  currTile,
  dirs,
  count,
  playerIndex
) => {
  setTileStatuses(_tiles => {
    _tiles[currTile.i][currTile.j] = {
      ..._tiles[currTile.i][currTile.j],
      [statusName]: { dirs, count, playerIndex }
    };
    return _tiles;
  });
};
export const solveForStatus = tile => {
  if (tile.isGraveyard) {
    return {
      isGraveyard: tile.isGraveyard,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isBubble) {
    return {
      isBubble: tile.isBubble,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isGhosted) {
    return {
      isGhosted: tile.isGhosted,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isShielded) {
    return {
      isShielded: tile.isShielded,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isElectrified) {
    return {
      isElectrified: tile.isElectrified,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isOnFire) {
    return {
      isOnFire: tile.isOnFire,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else if (tile.isWooded) {
    return {
      isWooded: tile.isWooded,
      count: tile.count,
      playerIndex: tile.playerIndex
    };
  } else {
    return {};
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
export const movePiece = (data, setData, scale) => {
  const _data = [...data];
  for (let i = 0; i < _data.length; i++) {
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
  setData(_data);
};
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
export const useKeyPress = (callback, keyCode) => {
  const handler = ({ code }) => {
    if (keyCode === code) {
      callback();
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
const getAdjacentTiles = tile => {
  return Object.values(PENINSULA_TILE_LOOKUP).filter(t => isAdjacent(t, tile));
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
