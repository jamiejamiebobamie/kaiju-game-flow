import { useState, useEffect, useRef } from "react";
import {
  PENINSULA_TILE_LOOKUP,
  PENINSULA_TILE_LOOKUP_VALS,
  NOT_BRIDGE_TILES_VALS,
  PLAYER_ABILITIES,
  PERIMETER_TILES_VALS,
  DEATH_TILE_STATUSES,
  PLAYER_CLASSES
} from "./gameState";
import { HexagonTile } from "../Game/GameBoard/Tile/HexagonTile";

export const getFlattenedArrayIndex = tile => {
  const { i, j } = tile;
  // 25, 10
  const rowLength = 24; // Math.ceil(width / (70 * scale));
  const colLength = 10; // Math.ceil(height / (75 * scale));
  return i !== undefined && j !== undefined ? rowLength * j + i : 0;
};

const getRandomAbilities = () => {
  const chosen = [];
  const possibilities = [
    "Ice",
    "Fire",
    "Wood",
    "Lightning",
    "Death",
    "Bubble",
    "Metal",
    "Glass",
    "Heart"
  ];
  for (let i = 0; i < 3; i++) {
    const currLastIndex = possibilities.length - i - 1;
    const randIndex = getRandomIntInRange({ max: currLastIndex });
    chosen.push(possibilities[randIndex]);
    const savedOption = possibilities[randIndex];
    possibilities[randIndex] = possibilities[currLastIndex];
    possibilities[currLastIndex] = savedOption;
  }
  return chosen.sort((a1, a2) => a1.localeCompare(a2));
};

export const setPassives = (pickedAbilities, setPlayerData) => {
  const classLookup =
    pickedAbilities.length === 3 &&
    pickedAbilities
      .slice(0, 3)
      .reduce(
        (acc, element, i) => (acc ? acc + "," + element : acc + element),
        ""
      );
  const playerClassObj =
    pickedAbilities.length === 3 &&
    PLAYER_CLASSES.find(pc => pc.elems === classLookup);
  const abilities = pickedAbilities.map(
    ability => PLAYER_ABILITIES[ability.toLowerCase()]
  );
  if (setPlayerData) {
    setPlayerData(_players => {
      return _players.map((p, i) => {
        const newPlayer = {
          ...p,
          ...abilities.reduce((acc, ability) => ability.activatePassive(acc), p)
        };
        return {
          ...newPlayer,
          abilities: i === 0 ? abilities : []
        };
      });
    });
  } else
    return [
      {
        playerClass: playerClassObj && playerClassObj.class_name,
        playerClassDescription:
          playerClassObj && playerClassObj.player_class_description,
        elements: classLookup,
        abilities
      },
      {
        playerClass: playerClassObj && playerClassObj.class_name,
        playerClassDescription:
          playerClassObj && playerClassObj.player_class_description,
        elements: classLookup,
        abilities
      }
    ];
};
export const initializeTutorialGameBoard = (
  playerData,
  setPlayerData,
  kaijuData,
  setKaijuData,
  width,
  height,
  scale,
  setTiles,
  setClickedTile,
  setHoverRef,
  tileStatuses,
  setTileStatuses,
  playerSpawnPositions,
  kaijuSpawnPositions,
  abilities,
  kaijuMoveSpeed
) => {
  // PLAYERS - - - - - - - - - - - -
  const _players = [];
  for (let k = 0; k < playerSpawnPositions.length; k++) {
    const location = getCharXAndY({ ...playerSpawnPositions[k], scale });
    const _player = {
      key: Math.random(),
      isInManaPool: false,
      isHealed: false,
      isTeleported: false,
      color: k ? "salmon" : "blue",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [playerSpawnPositions[k]],
      tile: playerSpawnPositions[k],
      dir: "idle",
      i: k,
      isThere: true,
      moveSpeed: 5,
      lives: Number.MAX_SAFE_INTEGER,
      isOnTiles: true,
      isKaiju: false,
      lastDmg: 0,
      isInManaPoolAccTime: 0,
      abilities: abilities && k === 1 ? abilities : [],
      abilityCooldowns: [],
      numTilesModifier: 0,
      tileCountModifier: 0,
      playerClass: "",
      playerClassDescription: "",
      elements: ""
    };
    _players.push(_player);
  }
  setPlayerData(_players);
  // PLAYERS    - - - - - - - - - -
  // TILES      - - - - - - - - - -
  const isTutorial = true;
  redrawTiles(
    [],
    setHoverRef,
    setClickedTile,
    setTiles,
    playerData,
    kaijuData,
    tileStatuses,
    setTileStatuses,
    width,
    height,
    scale,
    isTutorial
  );
  const status = [];
  const rowLength = 24;
  const colLength = 10;
  for (let i = 0; i < rowLength; i++) {
    const _status = [];
    for (let j = 0; j < colLength; j++) {
      _status.push({
        updateKey: Math.random(),
        isPlayer:
          playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
          playerData.find(({ tile }) => tile.i === i && tile.j === j).i,
        isKaiju: kaijuData
          .filter(k => k.isOnTiles)
          .find(key => key === `${i} ${j}`)
      });
    }
    status.push(_status);
  }
  setTileStatuses(status);
  // TILES      - - - - - - - - - -
  // KAIJU      - - - - - - - - - -
  const kaijuDataArr = [];
  for (let k = 0; k < kaijuSpawnPositions.length; k++) {
    const location = getCharXAndY({ ...kaijuSpawnPositions[k], scale });
    const key = Math.random();
    const data = {
      key,
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [],
      tile: kaijuSpawnPositions[k],
      dir: "idle",
      color: "purple",
      isThere: true,
      lives: 3,
      moveSpeed: kaijuMoveSpeed !== undefined ? kaijuMoveSpeed : 2,
      lastDmg: 0,
      abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
      isKaiju: true,
      isOnTiles: true,
      i: k,
      numTilesModifier: 0,
      tileCountModifier: 0,
      isHealed: false,
      isTeleported: false
    };
    kaijuDataArr.push(data);
  }
  setKaijuData(kaijuDataArr);
  // KAIJU      - - - - - - - - - -
};
export const initializeGameBoard = (
  playerData,
  setPlayerData,
  pickedAbilities,
  kaijuData,
  width,
  height,
  scale,
  setTiles,
  setClickedTile,
  setHoverRef,
  tileStatuses,
  setTileStatuses,
  isTeammate
) => {
  const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
  // PLAYERS - - - - - - - - - - - -
  const _players = [];
  const teammateAbilities = getRandomAbilities();
  const numPlayers = isTeammate ? 2 : 1;
  for (let k = 0; k < numPlayers; k++) {
    const classDetails = setPassives(
      k === 0 ? pickedAbilities : teammateAbilities
    );
    const randomInt = getRandomIntInRange({
      max: tileIndices.length - 1
    });
    const { i, j } = tileIndices[randomInt];
    const storeItem = tileIndices.length - k;
    tileIndices[tileIndices.length - k] = tileIndices[randomInt];
    tileIndices[randomInt] = storeItem;
    const location = getCharXAndY({ i, j, scale });
    const baseStats = {
      key: Math.random(),
      isInManaPool: false,
      isHealed: false,
      isTeleported: false,
      color: k ? "salmon" : "blue",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [],
      tile: { i, j },
      dir: "idle",
      i: k,
      isThere: true,
      moveSpeed: 6,
      lives: 4,
      isOnTiles: true,
      isKaiju: false,
      lastDmg: 0,
      isInManaPoolAccTime: 0,
      abilityCooldowns: [],
      numTilesModifier: 0,
      tileCountModifier: 0,
      ...classDetails[k]
    };
    const newPlayer = {
      ...baseStats,
      ...baseStats.abilities.reduce(
        (acc, ability) => ability.activatePassive(acc),
        baseStats
      )
    };
    _players.push(newPlayer);
  }
  setPlayerData(_players);
  // PLAYERS    - - - - - - - - - -
  // TILES      - - - - - - - - - -
  redrawTiles(
    [],
    setHoverRef,
    setClickedTile,
    setTiles,
    playerData,
    kaijuData,
    tileStatuses,
    setTileStatuses,
    width,
    height,
    scale
  );
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
        isKaiju: kaijuData
          .filter(k => k.isOnTiles)
          .find(key => key === `${i} ${j}`)
      });
    }
    status.push(_status);
  }
  setTileStatuses(status);
  // TILES      - - - - - - - - - -
};
export const spawnKaiju = (
  kaijuData,
  playerData,
  scale,
  isRespawn,
  isTutorial
) => {
  const minX = 0;
  const minY = 30;
  const maxX = 490;
  const maxY = 800;
  const randIntX = getRandomIntInRange({ min: minX, max: maxX });
  const randIntY = getRandomIntInRange({ min: minY, max: maxY });
  const randBool1 = Math.random() > 0.5;
  const randBool2 = Math.random() > 0.5;
  const location = isTutorial
    ? getCharXAndY({ ...kaijuData[0].tile, scale })
    : randBool1
    ? { x: randIntX, y: randBool2 ? minY : maxY }
    : { x: randBool2 ? minX : maxX, y: randIntY };
  const kaijuTile = isTutorial
    ? kaijuData[0].tile
    : getClosestPerimeterTileFromLocation({
        ...location,
        scale
      });
  const key = Math.random();
  return isRespawn
    ? {
        key,
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [kaijuTile],
        tile: kaijuTile,
        isThere: false,
        lives: 3,
        isOnTiles: false,
        moveSpeed: kaijuData[0]
          ? kaijuData[0].moveSpeed && kaijuData[0].moveSpeed < 4
            ? kaijuData[0].moveSpeed + 1
            : 4
          : 1
      }
    : {
        key,
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [kaijuTile],
        tile: kaijuTile,
        color: "purple",
        isThere: false,
        lives: 3,
        moveSpeed: kaijuData[0]
          ? kaijuData[0].moveSpeed && kaijuData[0].moveSpeed < 4
            ? kaijuData[0].moveSpeed + 1
            : 4
          : 1,
        lastDmg: 0,
        abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
        isKaiju: true,
        isOnTiles: false,
        i: kaijuData.length,
        numTilesModifier: 0,
        tileCountModifier: 0,
        isHealed: false,
        isTeleported: false
      };
};
export const updateHighlightedTiles = (
  setHighlightedTiles,
  playerData,
  hoverLookupString,
  path,
  setPath,
  scale,
  isTutorial
) => {
  let _highlightedTiles = [];
  if (hoverLookupString) {
    const [i, j] = hoverLookupString.split(" ");
    const lastTile =
      Array.isArray(path) && path[path.length - 1]
        ? path[path.length - 1]
        : { i: -1, j: -1 };
    if (playerData && playerData[0]) {
      if (
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
          scale,
          isTutorial
        );
        _highlightedTiles = _path.map(t => {
          return { h_i: t.i, h_j: t.j };
        });
        setPath(_path);
      }
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
  setHighlightedTiles(_highlightedTiles);
};
export const redrawTiles = (
  highlightedTiles0,
  setHoverRef,
  setClickedTile,
  setTiles,
  playerData,
  kaijuData,
  tileStatuses,
  setTileStatuses,
  width,
  height,
  scale,
  isTutorial
) => {
  if (tileStatuses) {
    const rowLength = 24;
    const colLength = isTutorial ? 10 : 36;
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        const key = `${i} ${j}`;
        if (PENINSULA_TILE_LOOKUP[key] || isTutorial) {
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
              isHighlighted0={highlightedTiles0.some(
                ({ h_i, h_j }) => h_i === i && h_j === j
              )}
              status={{
                ...tileStatuses[i][j],
                isPlayer:
                  playerData.find(
                    ({ tile, lives }) =>
                      tile && lives && tile.i === i && tile.j === j
                  ) &&
                  playerData.find(
                    ({ tile }) => tile && tile.i === i && tile.j === j
                  ).i,
                isKaiju: kaijuData
                  .filter(k => k.isOnTiles && k.lives)
                  .find(({ tile }) => tile && tile.i === i && tile.j === j)
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
  width,
  height,
  scale,
  accTime,
  isTutorial
) => {
  setTileStatuses(_statuses => {
    if (_statuses) {
      const rowLength = isTutorial ? 24 : Math.ceil(width / (70 * scale));
      const colLength = isTutorial ? 10 : Math.ceil(height / (75 * scale));
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
                playerData.find(
                  ({ tile }) => tile && tile.i === i && tile.j === j
                ) ||
                kaijuData.find(
                  ({ tile }) => tile && tile.i === i && tile.j === j
                );
              const playerKaijuConflictKey =
                playerData.find(
                  ({ tile }) => tile && tile.i === i && tile.j === j
                ) &&
                kaijuData
                  .filter(k => k.isOnTiles)
                  .find(
                    ({ tile, lives }) =>
                      tile && tile.i === i && tile.j === j && lives
                  ) &&
                playerData.find(
                  ({ tile }) => tile && tile.i === i && tile.j === j
                ).key;
              const [k, data] = entry;
              const {
                dirs,
                count,
                targetIndex,
                isKaiju,
                startCount,
                isInManaPool,
                playerIndex
              } = data;
              const healthTiles = ["isHealing"];
              if (count) {
                Array.isArray(dirs) &&
                  dirs.forEach((d, l) => {
                    // 2. move the status based on the direction
                    const offset = getTileOffsetFromDir(d, { i, j });
                    const nextTile = { i: i + offset.i, j: j + offset.j };
                    const tileDirMapping = [
                      "up",
                      "up right",
                      "down right",
                      "down",
                      "down left",
                      "up left"
                    ];
                    let direction = [d];
                    if (
                      (isTutorial &&
                        isTileOnGameBoardTutorial({
                          i: nextTile.i,
                          j: nextTile.j
                        })) ||
                      (!isTutorial &&
                        isTileOnGameBoard({
                          i: nextTile.i,
                          j: nextTile.j
                        }))
                    ) {
                      if (count < startCount && k === "isCold") {
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
                        k === "isOnKaijuFire" ||
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
                          k === "isWooded" &&
                          dirs.length > 1 &&
                          l > 0 &&
                          nextTileCount < _count - 1
                            ? _count - 1
                            : count - 1,
                        targetIndex,
                        startCount,
                        isInManaPool,
                        isKaiju,
                        playerIndex
                      };
                      const nextTilesStatus = solveForStatus(
                        _statuses[nextTile.i][nextTile.j]
                      );
                      _statuses[nextTile.i][nextTile.j] = nextTilesStatus;
                      _statuses[nextTile.i][nextTile.j].updateKey = updateKey;
                    } else if (k === "isElectrified") {
                      const dirMapIndex = tileDirMapping.indexOf(d);
                      const newDirMapIndex =
                        dirMapIndex > 2 ? dirMapIndex - 2 : dirMapIndex + 2;
                      const newDir = tileDirMapping[newDirMapIndex];
                      const nextTileOffsetFromCurrTile = getTileOffsetFromDir(
                        newDir,
                        { i, j }
                      );
                      const nextTileForLightning = {
                        i: i + nextTileOffsetFromCurrTile.i,
                        j: j + nextTileOffsetFromCurrTile.j
                      };
                      if (
                        (isTutorial &&
                          isTileOnGameBoardTutorial({
                            i: nextTileForLightning.i,
                            j: nextTileForLightning.j
                          })) ||
                        (!isTutorial &&
                          isTileOnGameBoard({
                            i: nextTileForLightning.i,
                            j: nextTileForLightning.j
                          }))
                      ) {
                        _statuses[nextTileForLightning.i][
                          nextTileForLightning.j
                        ][k] = {
                          dirs: [newDir],
                          count: count > 8 ? 8 : count - 1,
                          targetIndex,
                          startCount,
                          isInManaPool,
                          isKaiju,
                          playerIndex
                        };
                        const nextTilesStatus = solveForStatus(
                          _statuses[nextTileForLightning.i][
                            nextTileForLightning.j
                          ]
                        );
                        _statuses[nextTileForLightning.i][
                          nextTileForLightning.j
                        ] = nextTilesStatus;
                        _statuses[nextTileForLightning.i][
                          nextTileForLightning.j
                        ].updateKey = updateKey;
                      }
                    }
                    // 3. erase current tile's state
                    const doNotErase = [
                      "isElectrified",
                      "isShielded",
                      "isWooded"
                    ];
                    _statuses[i][j][k] =
                      !doNotErase.includes(k) ||
                      (k === "isWooded" && count === startCount) ||
                      (k === "isOnFire" && count === startCount) ||
                      (k === "isOnKaijuFire" && count === startCount) ||
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
              if (DEATH_TILE_STATUSES.includes(k) || healthTiles.includes(k)) {
                const entityOnTile = isKaiju
                  ? playerData.find(({ tile }) => tile.i === i && tile.j === j)
                  : kaijuData.find(({ tile }) => tile.i === i && tile.j === j);
                if (entityOnTile) {
                  const dmgObj = {
                    isKaiju: !isKaiju, // to determine correct state array
                    key: entityOnTile.key, // to determine correct entity in array
                    lifeDecrement: DEATH_TILE_STATUSES.includes(k) ? 1 : -1, // lives + or -
                    accTime, // to remove stale data from the dmgArray
                    playerIndex // to determine who killed the Kaiju.
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
const isTileOnGameBoardTutorial = tile => {
  return !!(0 <= tile.i && tile.i < 24 && 0 <= tile.j && tile.j < 10);
};
const isTileOnGameBoard = tile => {
  return PENINSULA_TILE_LOOKUP
    ? !!PENINSULA_TILE_LOOKUP[`${tile.i} ${tile.j}`]
    : false;
};
const getClosestPerimeterTileFromLocation = ({ x, y, scale }) => {
  let closest = { distance: Number.MAX_SAFE_INTEGER, tile: { i: 0, j: 0 } };
  PERIMETER_TILES_VALS.forEach(({ i, j }) => {
    const distance = getDistance(getCharXAndY({ i, j, scale }), { x, y });
    if (closest.distance > distance) closest = { distance, tile: { i, j } };
  });
  return closest.tile;
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
          ? data.length < 2 || data[0].lives < data[1].lives
            ? [data[0].tile, 0]
            : [data[1].tile, 1]
          : getClosestEntityFromTile(targetData, originTile, scale);
      if (originTile && targetTile) {
        const tileStatusesCountModifier = ["isWooded", "isOnFire", "isHealing"];
        const tileStatusesNumTilesModifier = [
          "isWooded",
          "isGhosted",
          "isHealing"
        ];
        const [tile, dirs] = getAdjacentTilesFromTile(
          originTile,
          targetTile,
          scale,
          data[dataIndex].numTilesModifier &&
            tileStatusesNumTilesModifier.includes(statusKey)
            ? numTiles + data[dataIndex].numTilesModifier
            : numTiles
        );
        setTileStatuses(_tiles => {
          _tiles[tile.i][tile.j] = {
            ..._tiles[tile.i][tile.j],
            [statusKey]: {
              dirs,
              count:
                data[dataIndex].tileCountModifier &&
                tileStatusesCountModifier.includes(statusKey)
                  ? count + data[dataIndex].tileCountModifier
                  : count,
              targetIndex,
              isKaiju: d.isKaiju || statusKey === "isHealing",
              startCount: count,
              isInManaPool: d.isInManaPool,
              playerIndex: d.isKaiju ? undefined : dataIndex
            }
          };
          return _tiles;
        });
      }
    }
  });
};
const solveForStatus = tile => {
  if (tile.isHealing) return { isHealing: tile.isHealing };
  else if (tile.isBubble)
    return {
      isBubble: tile.isBubble
    };
  else if (tile.isGhosted)
    return {
      isGhosted: tile.isGhosted
    };
  else if (tile.isElectrified)
    return {
      isElectrified: tile.isElectrified
    };
  else if (tile.isCold)
    return {
      isCold: tile.isCold
    };
  else if (tile.isShielded)
    return {
      isShielded: tile.isShielded
    };
  else if (tile.isOnFire && tile.isOnKaijuFire)
    return getRandBool()
      ? {
          isOnFire: tile.isOnFire
        }
      : {
          isOnKaijuFire: tile.isOnKaijuFire
        };
  else if (tile.isOnFire)
    return {
      isOnFire: tile.isOnFire
    };
  else if (tile.isOnKaijuFire)
    return {
      isOnKaijuFire: tile.isOnKaijuFire
    };
  else if (tile.isWooded)
    return {
      isWooded: tile.isWooded
    };
  else return tile;
};
const getRandBool = () => {
  return Math.random() > 0.5;
};
const getAdjacentTilesFromTile = (currTile, destTile, scale, numTiles) => {
  const normVec = getNormVecFromTiles(currTile, destTile, scale);
  return getAdjacentTilesFromNormVec(currTile, normVec, scale, numTiles);
};
const getNormVecFromTiles = (currTile, destTile, scale) => {
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
const getTileOffsetFromDir = (dir, currTile) => {
  switch (dir) {
    case "up":
      return { i: 0, j: -1 }; // up
    case "up right":
      return { i: 1, j: currTile.i % 2 ? 0 : -1 }; // up right
    case "down right":
      return { i: 1, j: currTile.i % 2 ? 1 : 0 }; // down right
    case "down":
      return { i: 0, j: 1 }; // down
    case "down left":
      return { i: -1, j: currTile.i % 2 ? 1 : 0 }; // down left
    case "up left":
      return { i: -1, j: currTile.i % 2 ? 0 : -1 }; // up left
    default:
      return { i: 0, j: 0 };
  }
};
const getDirFromTiles = (currTile, nextTile) => {
  const offset = { i: nextTile.i - currTile.i, j: nextTile.j - currTile.j };
  const lookup_key = `${offset.i} ${offset.j} ${currTile.i % 2}`;
  const lookup = {
    "0 -1 0": "up",
    "0 -1 1": "up",
    "0 1 1": "down",
    "0 1 0": "down",
    "0 0 0": "idle",
    "0 0 1": "idle",
    "1 0 1": "upRight",
    "1 -1 0": "upRight",
    "1 1 1": "downRight",
    "1 0 0": "downRight",
    "-1 1 1": "downLeft",
    "-1 0 0": "downLeft",
    "-1 0 1": "upLeft",
    "-1 -1 0": "upLeft"
  };
  const dir = lookup[lookup_key];
  return dir;
};
const getAdjacentTilesFromNormVec = (currTile, normVec, scale, numTiles) => {
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
export const getRandomIntInRange = ({ min = 0, max }) => {
  const _min = Math.ceil(min);
  const _max = Math.floor(max + 1);
  const randomInt = Math.floor(Math.random() * (_max - _min) + _min);
  return randomInt;
};
const getTileXAndY = ({ i, j, scale }) => {
  const x = (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale;
  return { x, y };
};
const getRandAdjacentTile = ({ i, j }) => {
  let newTile = { i: -1, j: -1 };
  while (!PENINSULA_TILE_LOOKUP[`${newTile.i} ${newTile.j}`])
    newTile = {
      i: Math.random() > 0.66 ? i + 1 : Math.random() > 0.33 ? i : i - 1,
      j: Math.random() > 0.66 ? j + 1 : Math.random() > 0.33 ? j : j - 1
    };
  return newTile;
};
const getCharXAndY = ({ i, j, scale }) => {
  const x =
    (i === 0 ? i * 45 - 25 : i * 45 + 25 * (i - 1)) * scale + 52.5 * scale;
  const y = (i % 2 ? j * 80 + 40 : j * 80) * scale + 42.5 * scale;
  return { x, y };
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
export const movePlayerPieces = (
  data,
  setData,
  tileStatuses,
  setTileStatuses,
  scale,
  accTime,
  enemyData,
  dmgArray,
  setPlayerKillCount,
  teleportData,
  setTeleportData,
  isTutorial,
  winner
) =>
  setData(_data => {
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].lives) {
        // set logic for teammate
        if (i === 1) {
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
            // teammate should do his own thing and attack kaiju
            if (attackPowersCount) {
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
                findPath(_data[1].tile, targetTile, scale, isTutorial);
              _data[i].moveToTiles =
                moveToTiles.length < powerRangeAvg - 1
                  ? findPath(
                      _data[1].tile,
                      getSafeTile(enemyData, tileStatuses, scale),
                      scale
                    )
                  : moveToTiles.length > powerRangeAvg + 10
                  ? moveToTiles.slice(0, moveToTiles.length - powerRangeAvg)
                  : findPath(
                      _data[1].tile,
                      getSafeTile(enemyData, tileStatuses, scale),
                      scale,
                      isTutorial
                    );
            }
          } else {
            // teammate should stay by player to protect him.
            // get path
            const moveToTiles =
              _data[1].tile &&
              _data[0].tile &&
              findPath(_data[1].tile, _data[0].tile, scale, isTutorial);
            _data[i].moveToTiles =
              moveToTiles.length > 3
                ? moveToTiles.slice(0, moveToTiles.length - 3)
                : [];
          }
          // use powers
          _data[i].abilities.forEach((a, j) => {
            const isCooldownOver =
              accTime - a.accTime >= a.cooldownTimeAI || accTime < a.accTime;
            if (isCooldownOver) {
              const [targetTile, _] = getClosestEntityFromTile(
                enemyData,
                _data[i].tile,
                scale
              );
              const numTilesFromTarget =
                _data[i].tile &&
                targetTile &&
                findPath(_data[i].tile, targetTile, scale, isTutorial).length;
              const adj_tiles = isTutorial
                ? getAdjacentTilesTutorial(_data[i].tile)
                : getAdjacentTiles(_data[i].tile);
              const surroundingTiles = [_data[i].tile, ...adj_tiles];
              const isInDanger =
                tileStatuses &&
                surroundingTiles &&
                surroundingTiles.some(
                  t =>
                    t &&
                    tileStatuses[t.i] &&
                    tileStatuses[t.i][t.j] &&
                    Object.keys(tileStatuses[t.i][t.j]).includes(
                      "isOnKaijuFire"
                    )
                );
              const isOffensivePowerAndTargetInRange =
                a.type === "offensive" &&
                numTilesFromTarget &&
                a.range >= numTilesFromTarget;
              const isDefensivePowerAndIsInDanger =
                a.type === "defensive" && isInDanger;
              const isEscapePowerAndIsInDanger =
                a.type === "escape" && numTilesFromTarget <= 2;
              const isHealPowerAndIsTeammateHealthLow =
                a.type === "heal" &&
                ((!!data[0].lives && data[0].lives < 4) ||
                  (!!data[1].lives && data[1].lives < 4));
              if (
                isOffensivePowerAndTargetInRange ||
                isDefensivePowerAndIsInDanger ||
                isEscapePowerAndIsInDanger ||
                isHealPowerAndIsTeammateHealthLow
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
            }
          });
        }
        if (
          _data[i].charLocation &&
          _data[i].moveFromLocation &&
          _data[i].moveToLocation &&
          (!_data[i].isThere ||
            _data[i].moveToTiles.length ||
            (teleportData && teleportData.length))
        ) {
          const shouldTeleport = !!(teleportData && teleportData.includes(i));
          if (shouldTeleport) {
            _data[i].isTeleported = !_data[i].isTeleported;
            const _path = findPath(
              _data[i].tile,
              getSafeTile(enemyData, tileStatuses, scale),
              scale,
              isTutorial
            );
            const tile = _path[_path.length - 1];
            const location = getCharXAndY({ ...tile, scale });
            _data[i].tile = tile || _data[i].tile;
            _data[i].charLocation = tile ? location : _data[i].charLocation;
            _data[i].moveToLocation = tile ? location : _data[i].moveToLocation;
            _data[i].moveFromLocation = tile
              ? location
              : _data[i].moveFromLocation;
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
            if (_data[i].isThere && _data[i].moveToTiles.length) {
              const [nextTile, ...tiles] = _data[i].moveToTiles;
              const playerDirection = getDirFromTiles(_data[i].tile, nextTile);
              _data[i].dir = playerDirection;
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
        } else if (
          _data[i].isThere &&
          !_data[i].moveToTiles.length &&
          _data[i].dir !== "idle"
        ) {
          _data[i].dir = "idle";
        }
        dmgArray
          .filter(({ isKaiju }) => !!isKaiju === _data[i].isKaiju) // what does this do...
          .forEach(dmg => {
            if (_data[i].key === dmg.key && _data[i].lives) {
              if (
                accTime - _data[i].lastDmg > 20 ||
                accTime - _data[i].lastDmg < 0
              ) {
                // can only get damaged once every 1 second.
                // also accTime might reset to zero, so check for that.
                _data[i].lastDmg = accTime;
                _data[i].lives =
                  dmg.lifeDecrement > 0 ||
                  _data[i].lives - dmg.lifeDecrement < 5
                    ? _data[i].lives - dmg.lifeDecrement
                    : _data[i].lives;
                if (dmg.lifeDecrement < 0)
                  _data[i].isHealed = !_data[i].isHealed;
              }
              if (!_data[i].lives) setPlayerKillCount(count => count + 1);
            }
          });
      }
    }
    teleportData && teleportData.length && setTeleportData([]);
    return _data;
  });
export const moveKaijuPieces = (
  data,
  setData,
  tileStatuses,
  setTileStatuses,
  scale,
  accTime,
  enemyData,
  dmgArray,
  setKaijuKillCount,
  isTutorial,
  winner
) =>
  setData(_data => {
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].lives) {
        // use powers
        if (_data[i].isOnTiles && _data[i].abilities.length) {
          _data[i].abilities.forEach((a, j) => {
            const isCooldownOver =
              accTime - a.accTime >= a.cooldownTimeAI || accTime < a.accTime;
            if (isCooldownOver) {
              const [targetTile, _] = getClosestEntityFromTile(
                enemyData,
                _data[i].tile,
                scale
              );
              const numTilesFromTarget =
                _data[i].tile &&
                targetTile &&
                findPath(_data[i].tile, targetTile, scale, isTutorial).length;
              const isOffensivePowerAndTargetInRange =
                a.type === "offensive" &&
                numTilesFromTarget &&
                a.range >= numTilesFromTarget;
              if (isOffensivePowerAndTargetInRange) {
                _data[i].abilities[j].accTime = accTime;
                a.activateActive(
                  i,
                  data,
                  () => {},
                  enemyData,
                  setTileStatuses,
                  scale
                );
              }
            }
          });
        }
        // - - - - - - - - - - -
        // if Kaiju, and just spawned set isOnTiles to true when they reach the tiles
        if (
          _data[i].isKaiju &&
          !_data[i].isOnTiles &&
          _data[i].isThere &&
          !_data[i].moveToTiles.length
        )
          _data[i].isOnTiles = true;
        // - - - - - - - - - - -
        // if Kaiju and on tiles, move toward the closest player.
        if (_data[i].isKaiju && _data[i].isOnTiles) {
          if (enemyData.length) {
            const [targetTile, _] = getClosestEntityFromTile(
              enemyData,
              _data[i].tile,
              scale
            );
            const moveToTiles = findPath(
              _data[i].tile,
              targetTile,
              scale,
              isTutorial
            );
            _data[i].moveToTiles = moveToTiles;
          } else if (_data[i].isThere) {
            const moveToTiles = findPath(
              _data[i].tile,
              getRandAdjacentTile(_data[i].tile),
              scale,
              isTutorial
            );
            _data[i].moveToTiles = moveToTiles;
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
          // - - - - - - - - - - -
          if (_data[i].isThere && _data[i].moveToTiles.length) {
            const [nextTile, ...tiles] = _data[i].moveToTiles;
            const playerDirection = getDirFromTiles(_data[i].tile, nextTile);
            _data[i].dir = playerDirection;
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
        if (
          _data[i].isThere &&
          !_data[i].moveToTiles.length &&
          _data[i].dir !== "idle"
        ) {
          _data[i].dir = "idle";
        }
        dmgArray
          .filter(({ isKaiju }) => !!isKaiju === _data[i].isKaiju)
          .forEach(dmg => {
            if (
              _data[i].key === dmg.key &&
              _data[i].lives &&
              _data[i].isOnTiles
            ) {
              if (
                accTime - _data[i].lastDmg > 5 ||
                accTime - _data[i].lastDmg < 0
              ) {
                // can only get damaged once every 1 second.
                // also accTime might reset to zero, so check for that.
                _data[i].lastDmg = accTime;
                _data[i].lives =
                  dmg.lifeDecrement > 0 ||
                  _data[i].lives - dmg.lifeDecrement < 5
                    ? _data[i].lives - dmg.lifeDecrement
                    : _data[i].lives;
                if (dmg.lifeDecrement < 0)
                  _data[i].isHealed = !_data[i].isHealed;
                if (!_data[i].lives) {
                  setKaijuKillCount(kc => [...kc, dmg.playerIndex]);
                }
              }
            }
          });
      }
    }
    const newKaiju =
      !isTutorial &&
      (winner === null) & (_data.length < 4) &&
      accTime &&
      !(accTime % 100) &&
      spawnKaiju(_data, enemyData, scale);
    const newKaijuData =
      !newKaiju &&
      accTime &&
      !(accTime % 3) &&
      _data.map(k =>
        winner === null && !k.lives
          ? {
              ...k,
              ...spawnKaiju(_data, enemyData, scale, true, isTutorial)
            }
          : k
      );
    return newKaiju
      ? [..._data, newKaiju]
      : newKaijuData
      ? newKaijuData
      : _data;
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
const getRandomTileOnBoard = (scale, isTutorial) => {
  if (isTutorial) {
    return {
      i: getRandomIntInRange({ max: 23 }),
      j: getRandomIntInRange({ max: 9 })
    };
  } else {
    const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
    const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
    return tileIndices[randomInt];
  }
};
const getSafeTile = (kaijuData, tileStatuses, scale) => {
  const kaijuLocations = kaijuData
    .filter(({ lives }) => lives)
    .map(({ charLocation }) => charLocation);
  const allTiles = NOT_BRIDGE_TILES_VALS;
  let safeTileObj = {
    distance: Number.MIN_SAFE_INTEGER,
    index: getRandomTileOnBoard(scale)
  };
  kaijuData.length &&
    allTiles.forEach(currTile => {
      const currTileXY = getCharXAndY({ ...currTile, scale });
      const testSafeTileObj = kaijuLocations.reduce(
        (acc, kaijuLocation) => {
          const testDist = getDistance(currTileXY, kaijuLocation);
          return acc.distance < testDist &&
            tileStatuses &&
            tileStatuses[currTile.i] &&
            tileStatuses[currTile.i][currTile.j] &&
            Object.keys(tileStatuses[currTile.i][currTile.j]).every(
              k => !DEATH_TILE_STATUSES.includes(k)
            )
            ? { distance: testDist, index: currTile }
            : acc;
        },
        {
          distance: Number.MIN_SAFE_INTEGER,
          index: getRandomTileOnBoard(scale)
        }
      );
      if (safeTileObj.distance < testSafeTileObj.distance)
        safeTileObj = testSafeTileObj;
    });
  return safeTileObj.index;
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
export const areTilesAdjacent = (tile1, tile2) => {
  return [
    { i: 0, j: -1 },
    { i: 1, j: tile1.i % 2 ? 0 : -1 },
    { i: 1, j: tile1.i % 2 ? 1 : 0 },
    { i: 0, j: 1 },
    { i: -1, j: tile1.i % 2 ? 1 : 0 },
    { i: -1, j: tile1.i % 2 ? 0 : -1 }
  ]
    .map(t => {
      return { i: t.i + tile1.i, j: t.j + tile1.j };
    })
    .some(t => tile2.i === t.i && tile2.j === t.j);
};
export const getAdjacentTilesTutorial = tile => {
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
    .filter(t => isTileOnGameBoardTutorial(t));
};
const findPath = (start, goal, scale, isTutorial) => {
  let count = 0;
  return recur(start, [], count);
  function recur(currTile, arr, count) {
    if ((currTile.i === goal.i && currTile.j === goal.j) || count > 400)
      return arr;
    // produce all possible adjacent tile indices to currTile
    const adjacentTiles = isTutorial
      ? getAdjacentTilesTutorial(currTile)
      : getAdjacentTiles(currTile);
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
      shortest.tile &&
      shortest.tile.i === currTile.i &&
      shortest.tile.j === currTile.j
    ) {
      const keyedArr = arr.map(({ i, j }) => `${i} ${j}`);
      const remainingTiles = adjacentTiles.filter(
        ({ i, j }) => !keyedArr.includes(`${i} ${j}`)
      );
      const randInt = getRandomIntInRange({ max: remainingTiles.length - 1 });
      const randTile = remainingTiles[randInt];
      const _arr = [...arr, randTile];
      return recur(randTile, _arr, count + 1);
    } else if (shortest.tile) {
      const _arr = [...arr, shortest.tile];
      return recur(shortest.tile, _arr, count + 1);
    } else {
      return [];
    }
  }
};
