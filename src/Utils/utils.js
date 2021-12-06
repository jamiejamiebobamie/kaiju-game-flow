import React, { useState, useEffect, useRef } from "react";
import { PENINSULA_TILE_LOOKUP } from "./gameState";

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
  return { x: Math.trunc(x), y: Math.trunc(y) };
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
export const movePiece = (data, setData, scale, isKaiju) => {
  const _data = [...data];
  const canvas = [];
  for (let i = 0; i < _data.length; i++) {
    if (
      _data[i].charLocation &&
      _data[i].moveFromLocation &&
      _data[i].moveToLocation
    ) {
      const { newLocation, hasArrived } = moveTo({
        currentLocation: _data[i].charLocation,
        moveFromLocation: _data[i].moveFromLocation,
        moveToLocation: _data[i].moveToLocation,
        moveSpeed: 7
      });
      _data[i].charLocation = newLocation;
      _data[i].isThere = hasArrived;
      if (hasArrived) {
        _data[i].moveFromLocation = _data[i].charLocation;
        _data[i].tile = getRandAdjacentTile({
          i: _data[i].tile.i,
          j: _data[i].tile.j
        });
        _data[i].moveToLocation = getCharXAndY({
          ..._data[i].tile,
          scale
        });
      }
    }
  }
  setData(
    isKaiju
      ? _data.sort(
          (item1, item2) => item1.charLocation.x - item2.charLocation.x
        )
      : _data
  );
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
  const x_dir = (x_To - x) / distanceToFinish;
  const y_dir = (y_To - y) / distanceToFinish;
  return {
    newLocation: {
      x: Math.trunc(x + x_dir * moveSpeed),
      y: Math.trunc(y + y_dir * moveSpeed)
    },
    hasArrived: distanceToFinish < 5 || distanceFromStart > totalDistance
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
// Hook
export const useHover = (numRefs = 0) => {
  const [value, setValue] = useState(false);
  // const [_ref, setRef] = useState(null);
  const ref = useRef();
  const handleMouseOver = () => setValue(true);
  const handleMouseOut = () => setValue(false);
  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener("mouseover", handleMouseOver);
      node.addEventListener("mouseout", handleMouseOut);
      return () => {
        node.removeEventListener("mouseover", handleMouseOver);
        node.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [ref.current]);
  return [ref, value];
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
// https://www.algorithms-and-technologies.com/a_star/javascript
export const aStar = (start, goal) => {
  const ADJACENCY_MATRIX_LENGTH = 33 * 33 + 33 + 1;
  const adjacencyMatrix = [];
  for (let i = 0; i < ADJACENCY_MATRIX_LENGTH + 1; i++) {
    adjacencyMatrix.push([]);
    for (let j = 0; j < ADJACENCY_MATRIX_LENGTH + 1; j++) {
      adjacencyMatrix[i].push(isAdjacent({ j, i }, { i, j }) ? 1 : 0);
    }
  }
  console.log(adjacencyMatrix);
  //This contains the distances from the start node to all other nodes
  const distances = [];
  //Initializing with a distance of "Infinity"
  for (let i = 0; i < ADJACENCY_MATRIX_LENGTH; i++)
    distances[i] = Number.MAX_VALUE;
  //The distance from the start node to itself is of course 0
  distances[start] = 0;
  //This contains the priorities with which to visit the nodes, calculated using the heuristic.
  const priorities = [];
  //Initializing with a priority of "Infinity"
  for (let i = 0; i < ADJACENCY_MATRIX_LENGTH; i++)
    priorities[i] = Number.MAX_VALUE;
  //start node has a priority equal to straight line distance to goal. It will be the first to be expanded.
  const startXY = getTileXAndY({ i: start.i, j: start.j });
  const goalXY = getTileXAndY({ i: goal.i, j: goal.j });
  const distance = getDistance(startXY, goalXY);

  priorities[start] = distance;
  //This contains whether a node was already visited
  const visited = [];
  //While there are nodes left to visit...
  while (true) {
    // ... find the node with the currently lowest priority...
    let lowestPriority = Number.MAX_VALUE;
    let lowestPriorityIndex = -1;
    for (let i = 0; i < priorities.length; i++) {
      //... by going through all nodes that haven't been visited yet
      if (priorities[i] < lowestPriority && !visited[i]) {
        lowestPriority = priorities[i];
        lowestPriorityIndex = i;
      }
    }
    if (lowestPriorityIndex === -1) {
      // There was no node not yet visited --> Node not found
      return -1;
    } else if (lowestPriorityIndex === goal) {
      // Goal node found
      // console.log("Goal node found!");
      return distances[lowestPriorityIndex];
    }
    // console.log("Visiting node " + lowestPriorityIndex + " with currently lowest priority of " + lowestPriority);
    //...then, for all neighboring nodes that haven't been visited yet....
    for (let i = 0; i < ADJACENCY_MATRIX_LENGTH; i++) {
      if (adjacencyMatrix[lowestPriorityIndex][i] !== 0 && !visited[i]) {
        //...if the path over this edge is shorter...
        if (
          distances[lowestPriorityIndex] +
            adjacencyMatrix[lowestPriorityIndex][i] <
          distances[i]
        ) {
          //...save this path as new shortest path
          distances[i] =
            distances[lowestPriorityIndex] +
            adjacencyMatrix[lowestPriorityIndex][i];
          //...and set the priority with which we should continue with this node
          const tile = getIndicesFromFlattenedArrayIndex(
            i,
            ADJACENCY_MATRIX_LENGTH
          );
          const startXY = getTileXAndY({ i: tile.i, j: tile.j });
          const goalXY = getTileXAndY({ i: goal.i, j: goal.j });
          const distance = getDistance(startXY, goalXY);
          priorities[i] = distances[i] + distance;
          // console.log("Updating distance of node " + i + " to " + distances[i] + " and priority to " + priorities[i]);
        }
      }
    }
    // Lastly, note that we are finished with this node.
    visited[lowestPriorityIndex] = true;
    //console.log("Visited nodes: " + visited);
    //console.log("Currently lowest distances: " + distances);
  }
};
