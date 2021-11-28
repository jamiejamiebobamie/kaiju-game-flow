import React, { useState, useEffect, useRef } from "react";
import { PENINSULA_TILE_LOOKUP } from "./gameState";

export const IS_NAN = NaN; // not working?

export const getRandomIntInRange = ({ min = 0, max }) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max + 1);
  const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
  return randomInt;
};
export const getTileXAndY = ({ i, j, scale }) => {
  const x =
    (i === 0
      ? i * 45 - 25
      : i % 2
      ? i * 45 + 25 * (i - 1)
      : i * 45 + 25 * (i - 1)) * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale;
  return { x, y };
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
    (i === 0
      ? i * 45 - 25
      : i % 2
      ? i * 45 + 25 * (i - 1)
      : i * 45 + 25 * (i - 1)) *
      scale +
    52.5 * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale + 42.5 * scale;
  return { x, y };
};
// Canvas has a different x and y scale
export const getManaWellXAndY = ({ i, j, scale }) => {
  return { x: (i * 42 + 20) * scale, y: (j * 15 - 5) * scale };
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
export const moveTo = ({
  currentLocation,
  moveFromLocation,
  moveToLocation,
  moveSpeed,
  setLocation,
  setHasArrived
}) => {
  const distanceFromStart = getDistance(moveFromLocation, currentLocation);
  const distanceToFinish = getDistance(moveToLocation, currentLocation);
  const totalDistance = getDistance(moveFromLocation, moveToLocation);
  if (distanceToFinish < 5 || distanceFromStart > totalDistance)
    setHasArrived(true);
  const x_To = moveToLocation.x;
  const y_To = moveToLocation.y;
  const { x, y } = currentLocation;
  const x_dir = (x_To - x) / distanceToFinish;
  const y_dir = (y_To - y) / distanceToFinish;
  setLocation(({ x, y }) => {
    return {
      x: x + x_dir * moveSpeed,
      y: y + y_dir * moveSpeed
    };
  });
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
export const getRandomCharacterLocation = scale => {
  const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
  const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
  const { i, j } = tileIndices[randomInt];
  const { x, y } = getCharXAndY({ i, j, scale });
  return { x, y };
};
