import { useState, useEffect, useRef } from "react";
import {
  PENINSULA_TILE_LOOKUP,
  PENINSULA_TILE_LOOKUP_VALS,
  BRIDGE_TILES,
  NOT_BRIDGE_TILES,
  NOT_BRIDGE_TILES_VALS,
  PLAYER_ABILITIES,
  PERIMETER_TILES,
  PERIMETER_TILES_VALS,
  DEATH_TILE_STATUSES,
  PLAYER_CLASSES
} from "./gameState";
import { HexagonTile } from "../Game/MainGame/GameBoard/Tile/HexagonTile";

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
  setTileStatuses
) => {
  // PLAYERS - - - - - - - - - - - -
  const _players = [];
  for (let k = 0; k < 2; k++) {
    const tile = k === 0 ? { i: 11, j: 7 } : { i: 3, j: 3 };
    const location = getCharXAndY({ ...tile, scale });
    const _player = {
      key: Math.random(),
      isInManaPool: false,
      isHealed: false,
      isTeleported: false,
      color: k ? "salmon" : "blue",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [],
      tile,
      dir: "idle",
      i: k,
      isThere: true,
      moveSpeed: 6,
      lives: Number.MAX_SAFE_INTEGER,
      isOnTiles: true,
      isKaiju: false,
      lastDmg: 0,
      isInManaPoolAccTime: 0,
      abilities: [],
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
  // KAIJU      - - - - - - - - - -
  const kaijuTile = { i: 19, j: 3 };
  // const tile = k === 0 ? { i: 10, j: 5 } : { i: 3, j: 8 };
  const location = getCharXAndY({ ...kaijuTile, scale });
  setKaijuData([
    {
      key: "apple",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [kaijuTile],
      tile: kaijuTile,
      dir: "idle",
      color: "purple",
      isThere: false,
      lives: 5,
      moveSpeed: 0,
      lastDmg: 0,
      abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
      isKaiju: true,
      isOnTiles: true,
      i: 0,
      tileCountModifier: 0,
      tileCountModifier: 0,
      isHealed: false,
      isTeleported: false
    }
  ]);

  // KAIJU      - - - - - - - - - -
};
export const initializeGameBoard = (
  playerData,
  setPlayerData,
  kaijuData,
  width,
  height,
  scale,
  setTiles,
  setClickedTile,
  setHoverRef,
  tileStatuses,
  setTileStatuses
) => {
  const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
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
    const abilityOptions = [
      PLAYER_ABILITIES["metal"],
      PLAYER_ABILITIES["glass"],
      PLAYER_ABILITIES["heart"],
      PLAYER_ABILITIES["ice"],
      PLAYER_ABILITIES["fire"],
      PLAYER_ABILITIES["wood"],
      PLAYER_ABILITIES["lightning"],
      PLAYER_ABILITIES["bubble"],
      PLAYER_ABILITIES["death"]
    ];
    let count = 0;
    while (count < 3) {
      const lastIndex = abilityOptions.length - count - 1;
      const randInt = getRandomIntInRange({ max: lastIndex });
      const savedAbility = abilityOptions[randInt];
      abilityOptions[randInt] = abilityOptions[lastIndex];
      abilityOptions[lastIndex] = savedAbility;
      count++;
    }
    const abilities = [
      abilityOptions[abilityOptions.length - 1],
      abilityOptions[abilityOptions.length - 2],
      abilityOptions[abilityOptions.length - 3]
    ].sort((item1, item2) => item1.element.localeCompare(item2.element));
    const classLookUpKey = [
      abilities[0].Element,
      abilities[1].Element,
      abilities[2].Element
    ].join(",");
    const playerClassObj = PLAYER_CLASSES.find(
      pc => pc.elems === classLookUpKey
    );
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
      abilities,
      abilityCooldowns: [],
      numTilesModifier: 0,
      tileCountModifier: 0,
      playerClass: playerClassObj && playerClassObj.class_name,
      playerClassDescription:
        playerClassObj && playerClassObj.player_class_description,
      elements: classLookUpKey
    };
    console.log(k, abilities, baseStats);
    const newPlayer = {
      ...baseStats,
      ...abilities.reduce(
        (acc, ability) => ability.activatePassive(acc),
        baseStats
      )
    };
    console.log(k, newPlayer);
    _players.push(newPlayer);
  }
  setPlayerData(_players);
  // PLAYERS    - - - - - - - - - -
  // TILES      - - - - - - - - - -
  redrawTiles(
    [],
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
export const spawnPowerUp = (
  powerUpData,
  setPowerUpData,
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
export const spawnKaiju = (kaijuData, playerData, scale, isRespawn) => {
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
  return isRespawn
    ? {
        key,
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [kaijuTile],
        tile: kaijuTile,
        isThere: false,
        lives: 5,
        isOnTiles: false
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
        lives: 5,
        moveSpeed: 4,
        lastDmg: 0,
        abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
        isKaiju: true,
        isOnTiles: false,
        i: kaijuData.length,
        tileCountModifier: 0,
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
  i,
  isTutorial
) => {
  let _highlightedTiles = [];
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
        scale,
        isTutorial
      );
      _highlightedTiles = _path.map(t => {
        return { h_i: t.i, h_j: t.j };
      });
      setPath(_path);
    }
  } else if (
    playerData &&
    playerData[i] &&
    playerData[i].moveToTiles.length > 0
  ) {
    _highlightedTiles = playerData[i].moveToTiles.map(t => {
      return { h_i: t.i, h_j: t.j };
    });
  }
  setHighlightedTiles(_highlightedTiles);
};
export const redrawTiles = (
  highlightedTiles0,
  highlightedTiles1,
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
    const rowLength = isTutorial ? 24 : Math.ceil(width / (70 * scale));
    const colLength = isTutorial ? 10 : Math.ceil(height / (75 * scale));
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
              isHighlighted1={highlightedTiles1.some(
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
                      isTileOnGameBoard({
                        i: nextTile.i,
                        j: nextTile.j
                      })
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
                          k === "isWooded" && // this is broken nextTile
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
                      // if at the end of the board and isElectrified
                      // "ricochet" of the end of the board and reflect / bounce back.
                      // 1. find next new tile that is ob board from current direction and current tile.
                      // 1a. find new direction
                      // 1b. from new direction find tile.
                      // 1c. determine if tile is on board.
                      // 1d. if on board update that new tile with status
                      // const tileDirMapping = [
                      //   "up",
                      //   "up right",
                      //   "down right",
                      //   "down",
                      //   "down left",
                      //   "up left"
                      // ];
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
                        isTileOnGameBoard({
                          i: nextTileForLightning.i,
                          j: nextTileForLightning.j
                        })
                      ) {
                        _statuses[nextTileForLightning.i][
                          nextTileForLightning.j
                        ][k] = {
                          dirs: [newDir],
                          count: count - 1,
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
                    lifeDecrement: DEATH_TILE_STATUSES.includes(k) ? 1 : -1, //lives + or - // possible healing ability...
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
export const isTileOnGameBoardTutorial = tile => {
  return !!(0 <= tile.i && tile.i < 25 && tile.j <= 0 && tile.j < 11);
};
export const isTileOnGameBoard = tile => {
  return PENINSULA_TILE_LOOKUP
    ? !!PENINSULA_TILE_LOOKUP[`${tile.i} ${tile.j}`]
    : false;
};
export const getClosestPerimeterTileFromLocation = ({ x, y, scale }) => {
  let closest = { distance: Number.MAX_SAFE_INTEGER, tile: { i: 0, j: 0 } };
  PERIMETER_TILES_VALS.forEach(({ i, j }) => {
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
        const tileStatusesCountModifier = [
          "isWooded",
          "isOnFire",
          "isShielded",
          "isHealing"
        ];
        const tileStatusesNumTilesModifier = [
          "isWooded",
          "isGhosted",
          "isShielded",
          "isHealing"
        ];
        const [tile, dirs] = getAdjacentTilesFromTile(
          originTile,
          targetTile,
          scale,
          manaPoolNumTiles
            ? manaPoolNumTiles
            : data[dataIndex].numTilesModifier &&
              tileStatusesNumTilesModifier.includes(statusKey)
            ? numTiles + data[dataIndex].numTilesModifier
            : numTiles
        );
        setTileStatuses(_tiles => {
          _tiles[tile.i][tile.j] = {
            ..._tiles[tile.i][tile.j],
            [statusKey]: {
              dirs,
              count: manaPoolCount
                ? manaPoolCount
                : data[dataIndex].tileCountModifier &&
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
export const solveForStatus = tile => {
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

/*

    0
0       0
0       0
    0

*/
export const getDirFromTiles = (currTile, nextTile) => {
  const offset = { i: nextTile.i - currTile.i, j: nextTile.j - currTile.j };
  const lookup_key = `${offset.i} ${offset.j} ${currTile.i % 2}`;
  const lookup = {
    "0 -1 0": "up",
    "0 -1 1": "up",
    "0 1 1": "down",
    "0 1 0": "down",
    "0 0 0": "idle",
    "0 0 1": "idle",
    "1 0 1": "up right",
    "1 -1 0": "up right",
    "1 1 1": "down right",
    "1 0 0": "down right",
    "-1 1 1": "down left",
    "-1 0 0": "down left",
    "-1 0 1": "up left",
    "-1 -1 0": "up left"
  };
  const dir = lookup[lookup_key];
  return dir;
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
    const highlightedTiles = PENINSULA_TILE_LOOKUP_VALS.map(v =>
      isAdjacent(tile, { i: v.i, j: v.j }) ? v : null
    ).filter(v => v !== null);
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
  return PENINSULA_TILE_LOOKUP_VALS.find(tile => {
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
export const movePieceTutorial = (
  data,
  setData,
  powerUpData,
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
        // use powers
        if (_data[i].isKaiju) {
          const powersToFire = _data[i].abilities.forEach((a, j) => {
            const isCooldownOver =
              accTime - a.accTime >= a.cooldownTimeAI || accTime < a.accTime;
            if (isCooldownOver) {
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
        // - - - - - - - - - - -
        if (
          _data[i].charLocation &&
          _data[i].moveFromLocation &&
          _data[i].moveToLocation &&
          (!_data[i].isThere ||
            _data[i].moveToTiles.length ||
            (teleportData && teleportData.length))
        ) {
          const shouldTeleport = !!(teleportData && teleportData.includes(i));
          const isTutorial = true;
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
        dmgArray
          .filter(({ isKaiju }) => !!isKaiju === _data[i].isKaiju)
          .forEach(dmg => {
            if (
              _data[i].key === dmg.key &&
              _data[i].lives &&
              ((_data[i].isKaiju && _data[i].isOnTiles) ||
                (!_data[i].isKaiju &&
                  (accTime - _data[i].lastDmg > 20 ||
                    accTime - _data[i].lastDmg < 0)))
            ) {
              // can only get damaged once every 1 second.
              // also accTime might reset to zero, so check for that.
              _data[i].lastDmg = accTime;
              _data[i].lives =
                dmg.lifeDecrement > 0 || _data[i].lives - dmg.lifeDecrement < 5
                  ? _data[i].lives - dmg.lifeDecrement
                  : _data[i].lives;
              if (dmg.lifeDecrement < 0) _data[i].isHealed = !_data[i].isHealed;
            }
          });
      }
    }
    teleportData && teleportData.length && setTeleportData([]);
    let isRespawn = true;
    const newKaijuData =
      !powerUpData &&
      accTime &&
      !(accTime % 3) &&
      _data.map(k => (!k.lives ? { ...k, lives: 5 } : k));
    return newKaijuData ? newKaijuData : _data;
  });
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
  setTeleportData,
  setKaijuKillCount
) =>
  setData(_data => {
    for (let i = 0; i < _data.length; i++) {
      if (_data[i].lives) {
        // set logic for teammate
        if (powerUpData && i === 1) {
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
                findPath(_data[1].tile, targetTile, scale);
              _data[i].moveToTiles =
                // !_data[i].moveToTiles.length
                //   ?
                moveToTiles.length < powerRangeAvg - 1
                  ? // findPath(_data[1].tile, getRandomTileOnBoard(scale, scale)
                    findPath(
                      _data[1].tile,
                      getSafeTile(enemyData, tileStatuses, scale),
                      scale
                    )
                  : moveToTiles.length > powerRangeAvg + 10
                  ? moveToTiles.slice(0, moveToTiles.length - powerRangeAvg)
                  : findPath(
                      _data[1].tile,
                      getSafeTile(enemyData, tileStatuses, scale),
                      scale
                    );
              // : _data[i].moveToTiles;
            } else {
              // teammate should stay by player to protect him.
              // get path
              const moveToTiles =
                _data[1].tile &&
                _data[0].tile &&
                findPath(_data[1].tile, _data[0].tile, scale);
              _data[i].moveToTiles =
                moveToTiles.length > 3
                  ? moveToTiles.slice(0, moveToTiles.length - 3)
                  : [];
            }
          }
        }
        // use powers
        if (
          ((powerUpData && i === 1) ||
            (_data[i].isKaiju && _data[i].isOnTiles)) &&
          _data[i].abilities.length
        ) {
          const powersToFire = _data[i].abilities.forEach((a, j) => {
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
                findPath(_data[i].tile, targetTile, scale).length;
              const surroundingTiles = [
                _data[i].tile,
                ...getAdjacentTiles(_data[i].tile)
              ];
              const isInDanger = surroundingTiles.some(
                t =>
                  tileStatuses[t.i] &&
                  tileStatuses[t.i][t.j] &&
                  Object.keys(tileStatuses[t.i][t.j]).includes("isOnKaijuFire")
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
                a.type === "heal" && powerUpData && data[0].lives <= 2;
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
          (!_data[i].isThere ||
            _data[i].moveToTiles.length ||
            (teleportData && teleportData.length))
        ) {
          const shouldTeleport = !!(teleportData && teleportData.includes(i));
          if (shouldTeleport) {
            _data[i].isTeleported = !_data[i].isTeleported;
            console.log(_data[i].isTeleported);
            const _path = findPath(
              _data[i].tile,
              getSafeTile(enemyData, tileStatuses, scale),
              scale
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
                  (accTime - _data[i].lastDmg > 20 ||
                    accTime - _data[i].lastDmg < 0)))
            ) {
              // can only get damaged once every 1 second.
              // also accTime might reset to zero, so check for that.
              _data[i].lastDmg = accTime;
              _data[i].lives =
                dmg.lifeDecrement > 0 || _data[i].lives - dmg.lifeDecrement < 5
                  ? _data[i].lives - dmg.lifeDecrement
                  : _data[i].lives;
              if (dmg.lifeDecrement < 0) _data[i].isHealed = !_data[i].isHealed;
              if (_data[i].isKaiju && !_data[i].lives) {
                setKaijuKillCount(kc => [...kc, dmg.playerIndex]);
              }
            }
          });
      }
    }
    teleportData && teleportData.length && setTeleportData([]);
    const newKaiju =
      !powerUpData &&
      data.length < 3 &&
      accTime &&
      !(accTime % 3) &&
      spawnKaiju(data, enemyData, scale);
    let isKaijuRespawned = false;
    let isRespawn = true;
    const newKaijuData =
      !powerUpData &&
      !newKaiju &&
      accTime &&
      !(accTime % 3) &&
      _data.map(k =>
        !isKaijuRespawned && !k.lives
          ? { ...k, ...spawnKaiju(data, enemyData, scale, isRespawn) }
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
  const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
  const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
  const { i, j } = tileIndices[randomInt];
  const { x, y } = getCharXAndY({ i, j, scale });
  return { x, y };
};
export const getRandomTileOnBoard = scale => {
  const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
  const randomInt = getRandomIntInRange({ max: tileIndices.length - 1 });
  return tileIndices[randomInt];
};
export const getSafeTile = (kaijuData, tileStatuses, scale) => {
  const kaijuLocations = kaijuData.map(({ charLocation }) => charLocation);
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
export const getAdjacentTiles = (tile, isTutorial) => {
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
    .filter(t =>
      isTutorial
        ? isTileOnGameBoardTutorial(t)
        : PENINSULA_TILE_LOOKUP[`${t.i} ${t.j}`]
    );
};
export const findPath = (start, goal, scale, isTutorial) => {
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
    const adjacentTiles = getAdjacentTiles(currTile, isTutorial);
    // console.log("lol", adjacentTiles);
    // get all charXAndY for each confirmed adjacent tile
    const goalXY = getCharXAndY({ ...goal, scale });
    const test = getCharXAndY({ ...adjacentTiles[0], scale });
    const shortest = {
      tile: adjacentTiles[0] || { i: 0, j: 0 },
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
