import { useState, useEffect, useRef } from "react";
import {
  PENINSULA_TILE_LOOKUP,
  PENINSULA_TILE_LOOKUP_VALS,
  NOT_BRIDGE_TILES_VALS,
  PLAYER_ABILITIES,
  PERIMETER_TILES_VALS,
  DEATH_TILE_STATUSES,
  PLAYER_CLASSES,
  TUTORIAL_GAMEBOARD_CORNER_TILE_INDICES,
  BASE_PLAYER_STATS,
  MAX_ROWS,
  MAX_COLS,
  TILE_DIRS,
  TILE_DIR_NORM_VECS,
  TILE_DIR_ROTATIONS_IN_DEGREES,
  TILE_STATUSES
} from "./gameState";
import { HexagonTile } from "../Game/GameBoard/Tile/HexagonTile";
import { StyledIcon } from "Tutorial/Components/StyledComponents";
import { Difficulty } from "Home";


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
    "Water",
    "Wood",
    "Lightning",
    "Death",
    "Bubble",
    "Metal",
    "Glass",
    "Love"
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

export const setAbilities = (pickedAbilities, setPlayerData) => {
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
    ability => ({ ...PLAYER_ABILITIES[ability.toLowerCase()] })
  );
  if (setPlayerData) {
    setPlayerData(_players => {
      return _players.map((p, i) => {
        // const newPlayer = {
        //   ...p,
        //   ...abilities.reduce((acc, ability) => ability.activatePassive(acc), p)
        // };
        return {
          ...p,
          // ...newPlayer,
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
export const initializeTutorialGameBoard = ({
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
  selectedAvatar
}) => {
  // PLAYERS - - - - - - - - - - - -
  const _players = [];
  for (let k = 0; k < playerSpawnPositions.length; k++) {
    const location = getCharXAndY({ ...playerSpawnPositions[k], scale });
    const _player = {
      ...BASE_PLAYER_STATS,
      key: Math.random(),
      color: selectedAvatar == 'girl' && k == 0 || selectedAvatar == 'guy' && k == 1 ? "salmon" : "#55AAff",
      gender: selectedAvatar == 'girl' && k == 0 || selectedAvatar == 'guy' && k == 1 ? "girl" : "guy",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [playerSpawnPositions[k]],
      tile: playerSpawnPositions[k],
      i: k,
      abilities: abilities ? abilities : [],
      lives: Number.MAX_SAFE_INTEGER,
    };
    _players.push(_player);
  }
  setPlayerData(_players);
  // PLAYERS    - - - - - - - - - -
  // TILES      - - - - - - - - - -
  const isTutorial = true;
  redrawTiles({
    highlightedTiles0: [],
    setHoverRef,
    setClickedTile,
    setTiles,
    playerData,
    kaijuData,
    tileStatuses,
    setTileStatuses,
    scale,
    isTutorial,
  });
  const status = [];
  const rowLength = 24;
  const colLength = 10;
  for (let i = 0; i < rowLength; i++) {
    const _status = [];
    for (let j = 0; j < colLength; j++) {
      _status.push({
        playerGender:
          playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
          playerData.find(({ tile }) => tile.i === i && tile.j === j).gender,
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
      moveSpeed: 2,
      moveSpeedModifier: 0,
      lastDmg: 0,
      abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
      isKaiju: true,
      isOnTiles: true,
      i: k,
      numTilesModifier: 0,
      tileCountModifier: 0,
      isHealed: false,
      isTeleported: false,
      isGoingToSpewFire: false
    };
    kaijuDataArr.push(data);
  }
  setKaijuData(kaijuDataArr);
  // KAIJU      - - - - - - - - - -
};
export const initializeGameBoard = ({
  playerData,
  setPlayerData,
  pickedAbilities,
  kaijuData,
  scale,
  setTiles,
  setClickedTile,
  tileStatuses,
  setTileStatuses,
  isTeammate,
  selectedAvatar,
  isMap,
  ROW_LENGTH,
  COL_LENGTH,
  ROW_OFFSET,
  COL_OFFSET,
  isRenderTiles
}) => {
  const tileIndices = PENINSULA_TILE_LOOKUP_VALS;
  // PLAYERS - - - - - - - - - - - -
  const _players = [];
  const teammateAbilities = getRandomAbilities();
  const numPlayers = isTeammate ? 2 : 1;
  for (let k = 0; k < numPlayers; k++) {
    const classDetails = setAbilities(
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
    const player = {
      ...BASE_PLAYER_STATS,
      key: Math.random(),
      color: selectedAvatar == 'girl' && k == 0 || selectedAvatar == 'guy' && k == 1 ? "salmon" : "#55AAff",
      gender: selectedAvatar == 'girl' && k == 0 || selectedAvatar == 'guy' && k == 1 ? "girl" : "guy",
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [],
      tile: { i, j },
      i: k,
      ...classDetails[k]
    };
    _players.push(player);
  }
  setPlayerData(_players);
  // PLAYERS    - - - - - - - - - -
  // TILES      - - - - - - - - - -
  const _tileStatuses = [];
  for (let i = 0; i < COL_LENGTH; i++) {
    const status = [];
    for (let j = 0; j < ROW_LENGTH; j++) {
      status.push({
        playerGender:
          playerData.find(({ tile }) => tile.i === i && tile.j === j) &&
          playerData.find(({ tile }) => tile.i === i && tile.j === j).gender,
        isKaiju: kaijuData
          .filter(k => k.isOnTiles)
          .find(key => key === `${i} ${j}`)
      });
    }
    _tileStatuses.push(status);
  }
  setTileStatuses(_tileStatuses);

  redrawTiles({
    highlightedTiles0: [],
    setClickedTile,
    setTiles,
    playerData,
    kaijuData,
    tileStatuses,
    setTileStatuses,
    scale,
    isTutorial: false,
    rowLength: ROW_LENGTH,
    colLength: COL_LENGTH,
    rowOffset: ROW_OFFSET,
    colOffset: COL_OFFSET,
    isMap,
    isRenderTiles
  });
  // TILES      - - - - - - - - - -
};
export const spawnKaiju = (
  kaijuData,
  playerData,
  scale,
  isRespawn,
  isTutorial,
  difficulty
) => {
  const minX = 0;
  const minY = 30;
  const maxX = 490;
  const maxY = 800;
  const randIntX = getRandomIntInRange({ min: minX, max: maxX });
  const randIntY = getRandomIntInRange({ min: minY, max: maxY });
  const randBool1 = Math.random() > 0.5;
  const randBool2 = Math.random() > 0.5;

  const randomCornerTile = Math.floor(4 * Math.random());

  const location = isTutorial
    ? getCharXAndY({ ...TUTORIAL_GAMEBOARD_CORNER_TILE_INDICES[randomCornerTile], scale })//getCharXAndY({ ...kaijuData[0].tile, scale })
    : randBool1
      // ? { x: randIntX, y: randBool2 ? minY : maxY }
      ? { x: randIntX, y: minY }
      : { x: randBool2 ? minX : maxX, y: randIntY };
  const kaijuTile = isTutorial
    ? TUTORIAL_GAMEBOARD_CORNER_TILE_INDICES[randomCornerTile]//kaijuData[0].tile
    : getClosestPerimeterTileFromLocation({
      ...location,
      scale
    });
  const kaijuTileLocation = getTileXAndY({
    i: kaijuTile.i,
    j: kaijuTile.j,
    scale
  });
  const distance = getDistance(kaijuTileLocation, location);
  const normVec = distance && {
    x: (kaijuTileLocation.x - location.x) / distance,
    y: (kaijuTileLocation.y - location.y) / distance
  };
  const dir = getMonsterSwimAnimDirFromNormVec(normVec);
  const key = Math.random();
  const { KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED } = determineKaijuQuantity(difficulty);
  return isRespawn
    ? {
      key,
      charLocation: location,
      moveFromLocation: location,
      moveToLocation: location,
      moveToTiles: [kaijuTile],
      tile: kaijuTile,
      isThere: false,
      lives: KAIJU_MAX_HEALTH,
      isOnTiles: false,
      dir,
      moveSpeed: KAIJU_MAX_SPEED,
      moveSpeedModifier: 0,
      isGoingToSpewFire: false,
      abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }]
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
      lives: KAIJU_MAX_HEALTH,
      moveSpeed: KAIJU_MAX_SPEED,
      lastDmg: 0,
      abilities: [{ ...PLAYER_ABILITIES["kaijuFire"] }],
      isKaiju: true,
      isOnTiles: false,
      i: kaijuData.length,
      moveSpeedModifier: 0,
      numTilesModifier: 0,
      tileCountModifier: 0,
      isHealed: false,
      isTeleported: false,
      isGoingToSpewFire: true,
      dir
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

const isTileVisible = ({ i, j, key, rowOffset, rowLength, colOffset, colLength, isMap }) => {
  const isVisible = j > rowOffset && j < rowLength && i > colOffset && i < colLength && (!isMap || PENINSULA_TILE_LOOKUP[key]);
  return isVisible;
}

export const redrawTiles = ({
  highlightedTiles0,
  setClickedTile,
  setTiles,
  playerData,
  kaijuData,
  tileStatuses,
  scale,
  isMap,
  rowLength = MAX_ROWS,
  colLength = MAX_COLS,
  rowOffset = 0,
  colOffset = 0,
  isRenderTiles = true
}) => {
  if (tileStatuses) {
    const _tiles = [];
    for (let i = 0; i < MAX_COLS; i++) {
      for (let j = 0; j < MAX_ROWS; j++) {
        const key = `${i} ${j}`;
        const tileLocation = getTileXAndY({ i, j, scale });
        const playerOnTile = playerData.find(
          ({ tile, isDead }) =>
            !isDead && !!tile && tile.i === i && tile.j === j
        )
        const playerGender = !!playerOnTile ? playerOnTile.gender : undefined;
        const isKaiju = kaijuData
          .filter(k => k.isOnTiles && k.lives)
          .find(({ tile }) => tile && tile.i === i && tile.j === j);
        const isVisible = isTileVisible({ i, j, key, rowOffset, rowLength, colOffset, colLength, isMap });
        const tileStatus = {
          ...tileStatuses[i][j],
          playerGender,
          isKaiju
        }
        _tiles.push(
          <HexagonTile
            key={key}
            isVisible={isRenderTiles && isVisible}
            tileLocation={tileLocation}
            rowLength={rowLength}
            scale={scale}
            i={i}
            j={j}
            setClickedIndex={isVisible ? setClickedTile : () => { }}
            isHighlighted0={isVisible && !tileStatus.isTeleportTile && highlightedTiles0.some(
              ({ h_i, h_j }) => h_i === i && h_j === j
            )}
            status={isVisible ? tileStatus : {}}
          />
        );
      }
    }
    setTiles(_tiles);
  }
};

const determineTileState = ({
  updateKey,
  _statuses,
  newDmg,
  start_i = 0,
  start_j = 0,
  isNotEndConditionI = i => i < MAX_COLS,
  isNotEndConditionJ = j => j < MAX_ROWS,
  increment = i => ++i,
  playerData,
  kaijuData,
  scale,
  accTime,
  teleportTile,
  rowLength = MAX_ROWS,
  colLength = MAX_COLS,
  rowOffset = 0,
  colOffset = 0,
  isMap = true
}) => {

  for (let i = start_i; isNotEndConditionI(i); i = increment(i)) {
    for (let j = start_j; isNotEndConditionJ(j); j = increment(j)) {

      const key = `${i} ${j}`;
      const isVisible = isTileVisible({ i, j, key, rowOffset, rowLength, colOffset, colLength, isMap });
      if (!isVisible) {
        _statuses[i][j] = {};
      }

      // 1. solve what should be on the tile
      else if (teleportTile.i == i && teleportTile.j == j) {
        // "isTeleportTile" = safe tile
        _statuses[i][j] = { isTeleportTile: {}, updateKey };
      } else if (_statuses[i][j].updateKey !== updateKey) {
        let tileStatus = solveForStatus(_statuses[i][j]);
        const entry = Object.entries(tileStatus).find(([_, v]) => v);
        if (entry) {
          const playerOnTile = playerData.find(
            ({ tile, isDead }) => !isDead && (tile && tile.i === i && tile.j === j)
          );
          const kaijuOnTile = kaijuData
            .filter(({ isOnTiles, lives }) => isOnTiles && lives)
            .find(
              ({ tile, isDead }) => !isDead && (tile && tile.i === i && tile.j === j)
            );
          const entityOnTileStatus = playerOnTile || kaijuOnTile;
          const playerKaijuConflictKey = playerOnTile && kaijuOnTile ? playerOnTile.key : undefined;
          const [k, data] = entry;
          const {
            dirs,
            count,
            targetIndex,
            isKaiju,
            startCount,
            playerIndex,
            bounceCount
          } = data;

          if (!count) {
            // 2. erase winning tile status if out of counts, unless status is "persistent"
            solveForStatusWithNoCounts({ i, j, k, _statuses, entityOnTileStatus, tileStatus });
          } else {
            Array.isArray(dirs) &&
              dirs.forEach((d, dirIndexInDirsArr) => {
                // 3. move the status based on the directions
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

                const isNextTileVisible = isTileVisible({ i: nextTile.i, j: nextTile.j, key: `${nextTile.i} ${nextTile.j}`, rowOffset, rowLength, colOffset, colLength, isMap });
                if (isNextTileVisible) {
                  solveForNextTile({
                    i,
                    j,
                    k,
                    dirIndexInDirsArr,
                    count,
                    startCount,
                    _statuses,
                    nextTile,
                    tileDirMapping,
                    scale,
                    playerData,
                    kaijuData,
                    direction,
                    dirs,
                    targetIndex,
                    startCount,
                    isKaiju,
                    playerIndex,
                    updateKey,
                    bounceCount
                  });
                  // nextTile is not visible. edge has been reached. solve for "bouncy" tile statuses to bounce-off edge.
                } else if (k === "isElectrified" || k === "isWooded" || k == 'isHealing' || k == 'isGhosted' || k === "isCold" || k === "isWet" || k === "isOnFire" || k === "isOnKaijuFire") {
                  solveForWallReflectionStatus({
                    k, d, i, j,
                    tileDirMapping,
                    _statuses,
                    count,
                    targetIndex,
                    startCount,
                    isKaiju,
                    playerIndex,
                    updateKey,
                    bounceCount,
                    rowOffset, rowLength, colOffset, colLength, isMap
                  });
                }

                solveForCurrentTile({
                  i,
                  j,
                  k,
                  _statuses,
                  tileStatus,
                  entityOnTileStatus,
                  updateKey
                })
              });
          }

          const healthTiles = ["isHealing"];
          if (DEATH_TILE_STATUSES.includes(k) || healthTiles.includes(k)) {
            const entityOnTile = isKaiju
              ? playerOnTile
              : kaijuOnTile;

            if (entityOnTile) {
              const dmgObj = {
                isKaiju: !isKaiju, // to determine correct state array
                key: entityOnTile.key, // to determine correct entity in array
                lifeDecrement: DEATH_TILE_STATUSES.includes(k) ? 1 : -1, // lives + or -
                accTime, // to remove stale data from the dmgArray
                playerIndex, // to determine who killed the Kaiju.
                i, j
              };
              newDmg.push(dmgObj);
            }
          }

          if (playerKaijuConflictKey) {
            const dmgObj = {
              isKaiju: false, // to determine correct state array
              key: playerKaijuConflictKey, // to determine correct entity in array
              lifeDecrement: 1, //lives + or - // possible healing ability...
              accTime, // to remove stale data from the dmgArray
              i, j
            };
            newDmg.push(dmgObj);
          }
        }
        _statuses[i][j].updateKey = updateKey;
      }
    }
  }
}
export const updateTileState = ({
  playerData,
  kaijuData,
  setDmgArray,
  setTileStatuses,
  scale,
  accTime,
  teleportTile,
  rowLength = MAX_ROWS,
  colLength = MAX_COLS,
  rowOffset = 0,
  colOffset = 0,
  isMap = true
}) => {
  setTileStatuses(_statuses => {
    if (!_statuses) return _statuses;
    const updateKey = Math.random() * 100;
    const newDmg = [];

    /*
      iterate over gameboard tiles twice,
      then save tile statuses that are shared.

      fixes a bug that duplicates "isOnFire" / "isOnKaijuFire" / "isWet" statuses 
        when they are traveling in the opposite direction as the update loops (ie. the nested for-loops iterating over the tiles).
    */

    // iterate from top-left
    const statuses1 = structuredClone(_statuses);
    determineTileState({
      updateKey,
      _statuses: statuses1,
      newDmg,
      start_i: 0,
      start_j: 0,
      isNotEndConditionI: i => i < MAX_COLS,
      isNotEndConditionJ: j => j < MAX_ROWS,
      increment: k => ++k,
      playerData,
      kaijuData,
      scale,
      accTime,
      teleportTile,
      rowLength, colLength, rowOffset, colOffset, isMap
    });
    // iterate from bottom-right
    const statuses2 = structuredClone(_statuses);
    determineTileState({
      updateKey,
      _statuses: statuses2,
      newDmg,
      start_i: MAX_COLS - 1,
      start_j: MAX_ROWS - 1,
      isNotEndConditionI: i => i > -1,
      isNotEndConditionJ: j => j > -1,
      increment: i => --i,
      playerData,
      kaijuData,
      scale,
      accTime,
      teleportTile,
      rowLength, colLength, rowOffset, colOffset, isMap
    });
    for (let i = 0; i < MAX_COLS; i++) {
      for (let j = 0; j < MAX_ROWS; j++) {
        // if (!!statuses1[i][j] && Object.values(statuses1[i][j]).filter(v => !!v).length) {
        //   console.log(statuses1[i][j])
        // }

        const activeStatuses1 = Object.entries(statuses1[i][j]).filter(([k, v]) => TILE_STATUSES.includes(k) && typeof v == 'object');
        const activeStatuses2 = Object.entries(statuses2[i][j]).filter(([k, v]) => TILE_STATUSES.includes(k) && typeof v == 'object');
        /* comparing status keys, eg. "isWet" */
        const matchingStatuses = activeStatuses1.length == 1 && !!activeStatuses2.length == 1 && !!activeStatuses1[0][0] && activeStatuses1[0][0] == activeStatuses2[0][0];
        if (!matchingStatuses) {
          _statuses[i][j] = {};
        } else {
          const k = activeStatuses1[0][0];
          const v = activeStatuses1[0][1];
          _statuses[i][j] = { [k]: v };
        }
      }
    }
    setDmgArray(Object.values(newDmg.reduce((acc, item) => {
      const key = `${item.i} ${item.j}`;
      acc[key] = item;
      return acc;
    }, {})));
    return _statuses;
  });
};
const solveForCurrentTile = ({
  i,
  j,
  k, // object tile status key, eg. 'isWet'
  _statuses,
  tileStatus,
  entityOnTileStatus,
  updateKey
}) => {

  // leave status on current tile until next update
  // this helps ensure dmg is registered
  const DO_NOT_PERSIST = ['isHealing', 'isGhosted', 'isCold', 'isBubble'];
  const ERASE = undefined;

  _statuses[i][j][k] = DO_NOT_PERSIST.includes(k) || entityOnTileStatus
    ? ERASE
    : {
      ...tileStatus[k],
      count: 0
    };

  _statuses[i][j].updateKey = updateKey;

  if (_statuses[i][j][k] == undefined)
    delete _statuses[i][j][k];
}

const solveForNextTile = ({
  i,
  j,
  k, // string key (eg. "isWet"), not index...
  dirIndexInDirsArr,
  count,
  startCount,
  _statuses,
  nextTile,
  tileDirMapping,
  scale,
  playerData,
  kaijuData,
  direction,
  dirs,
  targetIndex,
  isKaiju,
  playerIndex,
  updateKey,
  bounceCount
}) => {
  // solve for statuses with rotating directions
  if (
    k === "isCold" && // tick 1 and 2 = spread in single direction
    (count < (startCount - 0) && count > (startCount - 8)) // tick 1-7
  ) {
    direction = solveForRotatingDirectionStatus({ tileDirMapping, count })
  }

  // handle multiply with delay
  else if (
    k === "isElectrified" &&
    count == (startCount - 3)
  ) {
    const [_, newDirs] = getAdjacentTilesFromTile(
      { i, j },
      nextTile,
      scale,
      3
    );
    direction = newDirs;
  }

  // maintain dirs for some statuses
  else if (
    k === "isOnKaijuFire" ||
    k === "isOnFire" ||
    k === "isWet" ||
    (k === "isBubble" && count >= startCount) ||
    k === "isShielded" ||
    (k === "isWooded" && count == startCount)
  ) {
    direction = dirs;
  }

  // solve for statuses with tracking directions
  else if (
    k === "isGhosted" ||
    k === "isHealing" ||
    (k == "isCold" && count < (startCount - 7)) || // tick 8+
    (k === "isWooded" && count <= (startCount - 2)) // ticks 3+, track
  ) {
    direction = solveForTrackingStatusDirection({
      isKaiju,
      playerData,
      kaijuData,
      targetIndex,
      nextTile,
      scale
    });
  }

  setNextTileStatus({
    k,
    dirIndexInDirsArr,
    count,
    _statuses,
    nextTile,
    direction,
    dirs,
    targetIndex,
    startCount,
    isKaiju,
    playerIndex,
    updateKey,
    bounceCount
  });
}
const solveForRotatingDirectionStatus = ({ tileDirMapping, count }) => {
  const newDir =
    tileDirMapping[count % tileDirMapping.length];
  return [newDir];
}
const solveForTrackingStatusDirection = ({
  isKaiju,
  playerData,
  kaijuData,
  targetIndex,
  nextTile,
  scale,
  numTiles = 1
}) => {
  const targetTile = isKaiju
    ? playerData[targetIndex] &&
    playerData[targetIndex].tile
    : kaijuData[targetIndex] &&
    kaijuData[targetIndex].tile;
  const [_, targetDirection] = getAdjacentTilesFromTile(
    nextTile,
    targetTile || { i: 0, j: 0 },
    scale,
    numTiles
  );
  return targetDirection;
}
const setNextTileStatus = ({
  k,
  dirIndexInDirsArr,
  count,
  _statuses,
  nextTile,
  direction,
  dirs,
  targetIndex,
  startCount,
  isKaiju,
  playerIndex,
  updateKey,
  bounceCount
}) => {
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
        dirIndexInDirsArr > 0 &&
        nextTileCount < _count - 1
        ? _count - 1
        : count - 1,
    targetIndex,
    startCount,
    isKaiju,
    playerIndex,
    bounceCount
  };
  const nextTilesStatus = solveForStatus(
    _statuses[nextTile.i][nextTile.j]
  );
  _statuses[nextTile.i][nextTile.j] = nextTilesStatus;
  _statuses[nextTile.i][nextTile.j].updateKey = updateKey;
}

const solveForWallReflectionStatus = ({
  k, d, i, j,
  tileDirMapping,
  _statuses,
  count,
  targetIndex,
  bounceCount,
  startCount,
  isKaiju,
  playerIndex,
  updateKey,
  rowOffset, rowLength, colOffset, colLength, isMap
}) => {

  const dirMapIndex = tileDirMapping.indexOf(d);

  const newDirMapIndex =
    dirMapIndex > 2 ? dirMapIndex - 2 : dirMapIndex + 2;

  const newDir = tileDirMapping[newDirMapIndex];

  const nextTileOffsetFromCurrTile = getTileOffsetFromDir(
    newDir,
    { i, j }
  );

  const nextTile = {
    i: i + nextTileOffsetFromCurrTile.i,
    j: j + nextTileOffsetFromCurrTile.j
  };

  const isNextTileVisible = isTileVisible({ i: nextTile.i, j: nextTile.j, key: `${nextTile.i} ${nextTile.j}`, rowOffset, rowLength, colOffset, colLength, isMap });
  if (isNextTileVisible) {

    _statuses[nextTile.i][
      nextTile.j
    ][k] = {
      dirs: [newDir],
      count: count > bounceCount ? bounceCount : count - 1,
      targetIndex,
      startCount,
      isKaiju,
      playerIndex,
      bounceCount
    };

    const nextTilesStatus = solveForStatus(_statuses[nextTile.i][nextTile.j]);
    _statuses[nextTile.i][nextTile.j] = { ...nextTilesStatus, updateKey };
  }
};
const solveForStatusWithNoCounts = ({ i, j, k, _statuses, entityOnTileStatus, tileStatus }) => {
  const persistent = ["isShielded", "isWooded"];
  _statuses[i][j][k] =
    !persistent.includes(k) || entityOnTileStatus
      ? undefined
      : {
        ...tileStatus[k],
        count: 0
      };
}
const getMonsterSwimAnimDirFromNormVec = normVec => {
  const xDir = normVec.x > 0 ? "Right" : "Left"; // go right
  const yDir = normVec.y > 0 ? "down" : "up"; // go up
  return `${yDir}${xDir}`;
};
const isTileOnGameBoardTutorial = tile => {
  return !!(0 <= tile.i && tile.i < 24 && 0 <= tile.j && tile.j < 10);
};
export const isTileOnGameBoard = tile => {
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
  bounceCount = 8,
  statusKey,
  numTiles,
  setTileStatuses
}) => {
  data.forEach(d => {
    if (dataIndex === d.i) {
      const originTile = d.tile;
      let [targetTile, targetIndex] =
        statusKey === "isHealing"
          ? data.length < 2 || !!data[1].isDead || ((data[0].lives <= data[1].lives) && !data[0].isDead)
            ? [data[0].tile, 0]
            : [data[1].tile, 1]
          : getClosestEntityTileAndIndexFromOriginTile(targetData, originTile, scale);

      const isNoTarget = targetTile.i == 0 && targetTile.j == 0;
      if (isNoTarget) {
        // shoot power in direction player is facing
        const tileOffset = getTileOffsetFromDir(d.dir, originTile);;
        targetTile.x = tileOffset.x + originTile.x;
        targetTile.y = tileOffset.y + originTile.y;
      }

      if (originTile && targetTile) {
        const excludeStatusesForTileStatusesCountModifier = [
          "isBubble"
        ];
        const [spawnPowerTile, dirs] = getAdjacentTilesFromTile(
          originTile,
          targetTile,
          scale,
          data[dataIndex].numTilesModifier
            ? Math.max(numTiles + data[dataIndex].numTilesModifier, 1)
            : numTiles
        );
        const tileCount = data[dataIndex].tileCountModifier
          && !excludeStatusesForTileStatusesCountModifier.includes(statusKey) // don't apply tileCountModifier to bubble
          ?
          count + data[dataIndex].tileCountModifier
          : count

        setTileStatuses(_tiles => {
          if (!!spawnPowerTile && !!_tiles && !!_tiles[spawnPowerTile.i] && !!_tiles[spawnPowerTile.i][spawnPowerTile.j]) {
            _tiles[spawnPowerTile.i][spawnPowerTile.j] = {
              ..._tiles[spawnPowerTile.i][spawnPowerTile.j],
              [statusKey]: {
                dirs,
                count: tileCount, //Math.max(tileCount - countReductionForNumTilesModifierStatus, 0),
                targetIndex,
                isKaiju: d.isKaiju || statusKey === "isHealing",
                startCount: count, //Math.max(countReductionForNumTilesModifierStatus ? tileCount - countReductionForNumTilesModifierStatus : count, 0),
                playerIndex: d.isKaiju ? undefined : dataIndex,
                bounceCount
              }
            };
          }
          return _tiles;
        });
      }
    }
  });
};
const solveForStatus = tile => {
  switch (true) {
    case !!tile.isTeleportTile:
      return { isTeleportTile: tile.isTeleportTile }
    case !!tile.isHealing:
      return { isHealing: tile.isHealing }
    case !!tile.isBubble:
      return {
        isBubble: tile.isBubble
      };
    case !!tile.isGhosted:
      return {
        isGhosted: tile.isGhosted
      };
    case !!tile.isElectrified:
      return {
        isElectrified: tile.isElectrified
      };
    case !!tile.isCold:
      return {
        isCold: tile.isCold
      };
    case !!tile.isShielded:
      return {
        isShielded: tile.isShielded
      };
    case (!!tile.isOnFire && !!tile.isOnKaijuFire):
      return getRandBool()
        ? {
          isOnFire: tile.isOnFire
        }
        : {
          isOnKaijuFire: tile.isOnKaijuFire
        };
    case !!tile.isOnFire:
      return {
        isOnFire: tile.isOnFire
      };
    case !!tile.isOnKaijuFire:
      return {
        isOnKaijuFire: tile.isOnKaijuFire
      };
    case !!tile.isWet:
      return {
        isWet: tile.isWet
      };
    case !!tile.isWooded:
      return {
        isWooded: tile.isWooded
      };
    default:
      return tile;
  }
}
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
export const getTileOffsetFromDir = (dir, currTile) => {
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
export const getAngleOfRotationFromTileDirs = dirs => {
  const normVecs = dirs.map(d => {
    const i = TILE_DIRS.indexOf(d)
    if (i != -1) {
      return TILE_DIR_NORM_VECS[i];
    } else {
      return null;
    }
  });
  const accNormVec = normVecs.filter(v => !!v).reduce((acc, item) => {
    acc.x += item.x;
    acc.y += item.y;
    return acc;
  }, { x: 0, y: 0 });

  const avgNormVec = { x: accNormVec.x / dirs.length, y: accNormVec.y / dirs.length };

  // Math.cos(avgNormVec.x) // faster way to determine angle from norm vec: x/y?
  // Math.sin(avgNormVec.y)
  const indexOfClosestDir = TILE_DIR_NORM_VECS.reduce((acc, item, i) => {
    const dot = (item.x * avgNormVec.x) + (item.y * avgNormVec.y) / 2
    if (dot > acc.largestDot)
      return { largestDot: dot, i };
    return acc;
  }, { largestDot: -1, i: -1 }).i;

  if (indexOfClosestDir != -1)
    return TILE_DIR_ROTATIONS_IN_DEGREES[indexOfClosestDir]
  else
    return 0;

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
export const getDistance = (to, from) => {
  return Math.sqrt(
    (to.x - from.x) * (to.x - from.x) + (to.y - from.y) * (to.y - from.y)
  );
};
const getClosestEntityTileAndIndexFromOriginTile = (entityData, originTile, scale) => {
  const index = entityData
    .map(entity =>
      entity.lives > 0 && entity.isOnTiles
        ? getDistance(getCharXAndY({ ...originTile, scale }), entity.charLocation)
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
  resetHightlightedTiles
) =>
  setData(_data => {
    const enemiesOnTiles = enemyData.filter(({ isOnTiles }) => !!isOnTiles);
    for (let i = 0; i < _data.length; i++) {
      if (!_data[i].isDead) {
        // set logic for teammate
        if (i === 1) {

          let isEnemy = false;
          let powersCount = 3;
          let targetTile = { i: 0, j: 0 };

          const isEnemiesOnTiles = !!enemiesOnTiles.length;
          if (isEnemiesOnTiles) {
            // find the closest kaiju
            const [_targetTile, _] = getClosestEntityTileAndIndexFromOriginTile(
              enemiesOnTiles,
              _data[i].tile,
              scale
            );
            targetTile = _targetTile;
            isEnemy = targetTile.i !== 0;
            powersCount = _data[i].abilities.length;
          }
          // teammate should do his own thing and attack kaiju
          if (isEnemy) {
            const powersRangeAcc = _data[i].abilities
              .map(({ range }) => range)
              .reduce((acc, item) => acc + item, 0);
            const powerRangeAvg = Math.trunc(
              powersRangeAcc / powersCount
            );
            // avoid enemy tiles if possible
            const enemyTiles = enemiesOnTiles.map(({ tile }) => tile);
            const moveToEnemyTilePath =
              _data[1].tile &&
              targetTile &&
              findPath(_data[1].tile, targetTile, scale, isTutorial);
            const isEnemyTooFar = moveToEnemyTilePath.length > powerRangeAvg + 5;
            const isEnemyTooClose = moveToEnemyTilePath.length <= powerRangeAvg;
            if (isEnemyTooFar) {
              const idealTileDistanceFromEnemyWithGivenTeammatePowers = moveToEnemyTilePath.length - powerRangeAvg;
              const moveToEnemy = idealTileDistanceFromEnemyWithGivenTeammatePowers > 0 ? moveToEnemyTilePath.slice(0, idealTileDistanceFromEnemyWithGivenTeammatePowers) : moveToEnemyTilePath;
              _data[1].moveToTiles = moveToEnemy;
            } else if (isEnemyTooClose) {
              _data[1].lastAccTimeForFindPath = accTime;
              const safeTile = getSafeTile({ enemyData: enemiesOnTiles, tileStatuses, isMap: true, scale });
              const toSafeTilePath = findPath(
                _data[1].tile,
                safeTile,
                scale,
                isTutorial,
                enemyTiles
              );
              const idealTileDistanceFromEnemyWithGivenTeammatePowers = toSafeTilePath.length - powerRangeAvg;
              const moveAwayFromEnemy = idealTileDistanceFromEnemyWithGivenTeammatePowers > 0 ? toSafeTilePath.slice(0, idealTileDistanceFromEnemyWithGivenTeammatePowers) : toSafeTilePath;
              _data[1].moveToTiles = moveAwayFromEnemy;
            }

            // use powers
            let hasUsedOnePower = _data[i].abilities.some(v => (accTime - v.accTime) < 500);
            !hasUsedOnePower && _data[i].abilities.forEach((a, j) => {

              /*
                BUG: sometimes negative diff now...
                     consider resetting ability accTime
                     if larger than accTime as hacky fix (for the moment).
              */
              const AI_accTimeDelay = 750;
              const diff = accTime - a.accTime;
              const isCooldownOver = (diff > (a.cooldownTimeAI + AI_accTimeDelay)) || (accTime < a.accTime);

              if (isCooldownOver && !hasUsedOnePower) {

                const numTilesFromTarget = moveToEnemyTilePath.length;
                const surroundingTiles = isTutorial
                  ? getAdjacentAdjacentTilesTutorial(_data[i].tile)
                  : getAdjacentAdjacentTiles(_data[i].tile);

                const isInDanger =
                  !!tileStatuses &&
                  !!surroundingTiles &&
                  surroundingTiles.some(
                    t =>
                      !!t &&
                      !!tileStatuses[t.i] &&
                      !!tileStatuses[t.i][t.j] &&
                      !!tileStatuses[t.i][t.j]["isOnKaijuFire"]
                  );

                const isOffensivePowerAndTargetInRange =
                  a.type.includes("offensive") &&
                  numTilesFromTarget &&
                  a.range >= numTilesFromTarget;
                const isDefensivePowerAndIsInDanger =
                  a.type.includes("defensive") && isInDanger;
                const isEscapePowerAndIsInDanger =
                  a.type.includes("escape") &&
                  a.range > numTilesFromTarget || isInDanger;
                const isHealPowerAndIsTeammateHealthLow =
                  a.type.includes("heal") &&
                  ((!!data[0].lives && data[0].lives < 4) ||
                    (!!data[1].lives && data[1].lives < 4));

                if (
                  isOffensivePowerAndTargetInRange ||
                  isDefensivePowerAndIsInDanger ||
                  isEscapePowerAndIsInDanger ||
                  isHealPowerAndIsTeammateHealthLow
                ) {

                  hasUsedOnePower = true;

                  // teleport passive is called after teleport
                  _data[i].storedPassive = useAbility({
                    a,
                    data,
                    setData,
                    _data,
                    i,
                    j,
                    accTime,
                    setTeleportData,
                    enemiesOnTiles,
                    setTileStatuses,
                    scale,
                    isTriggerPassiveImmediately: a.element != "glass"
                  });

                }
              }
            });
          } else {
            // no enemy ...have teammate stay by player.
            const moveToTiles =
              _data[1].tile &&
              _data[0].tile &&
              findPath(_data[1].tile, _data[0].tile, scale, isTutorial);
            _data[i].moveToTiles =
              moveToTiles.length > 3
                ? moveToTiles.slice(0, moveToTiles.length - 3)
                : [];
          }
        }

        const isPlayer = i == 0;
        if (
          _data[i].charLocation &&
          _data[i].moveFromLocation &&
          _data[i].moveToLocation &&
          (!_data[i].isThere ||
            _data[i].moveToTiles.length ||
            (teleportData && teleportData.length && teleportData.includes(i) && (!isPlayer || _data[i].moveToTiles.length)))
        ) {
          const shouldTeleport = !!(teleportData && teleportData.includes(i));
          if (shouldTeleport) {
            _data[i].isTeleported = !_data[i].isTeleported;
            const teleportTile = isPlayer ? _data[i].moveToTiles[_data[i].moveToTiles.length - 1] : getSafeTile({ enemyData, tileStatuses, isMap: true, scale });
            if (teleportTile) {
              const teleportLocation = getCharXAndY({ ...teleportTile, scale });
              _data[i].tile = teleportTile
              _data[i].charLocation = teleportLocation;
              _data[i].moveToLocation = teleportLocation;
              _data[i].moveFromLocation = teleportLocation;
              _data[i].moveToTiles = [];
              _data[i].isThere = true;
              setTeleportData(td => td.filter(_i => _i != i));
              isPlayer && resetHightlightedTiles();
              !!_data[i].storedPassive && _data[i].storedPassive();
            }
          } else {
            const { newLocation, hasArrived } = moveTo({
              currentLocation: _data[i].charLocation,
              moveFromLocation: _data[i].moveFromLocation,
              moveToLocation: _data[i].moveToLocation,
              moveSpeed: _data[i].moveSpeed + _data[i].moveSpeedModifier
            });
            _data[i].charLocation = newLocation;
            _data[i].isThere = hasArrived;
            if (_data[i].isThere && _data[i].moveToTiles.length) {
              const [nextTile, ...tiles] = _data[i].moveToTiles;
              let playerDirection = getDirFromTiles(_data[i].tile, nextTile);

              // small issue with highlighted tiles not being connected to current player's path.
              // find playerDirection using: "getMonsterSwimAnimDirFromNormVec" method
              if (playerDirection == undefined) {
                const currTileLocation = getTileXAndY({
                  i: _data[i].tile.i,
                  j: _data[i].tile.j,
                  scale
                });
                const nextTileLocation = getTileXAndY({
                  i: nextTile.i,
                  j: nextTile.j,
                  scale
                });
                const distance = getDistance(nextTileLocation, currTileLocation);
                const normVec = distance && {
                  x: (nextTileLocation.x - currTileLocation.x) / distance,
                  y: (nextTileLocation.y - currTileLocation.y) / distance
                };
                playerDirection = getMonsterSwimAnimDirFromNormVec(normVec);
              }

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
            if (_data[i].key === dmg.key && !_data[i].isDead) {
              if (
                accTime - _data[i].lastDmg > 1000 ||
                accTime - _data[i].lastDmg < 0
              ) {

                // can only get damaged once every 1 second.
                // also accTime might reset to zero, so check for that.
                _data[i].lastDmg = accTime;

                if (_data[i].livesModifier > 0 && dmg.lifeDecrement > 0) {
                  // decrement from extra lives (positive "livesModifier") before decrementing from health ("lives")
                  const remainingDmg = dmg.lifeDecrement - _data[i].livesModifier;
                  dmg.lifeDecrement = remainingDmg > 0 ? remainingDmg : 0;
                  _data[i].livesModifier = remainingDmg < 0 ? remainingDmg * -1 : 0;

                  // only wood ability gives: positive "livesModifier." clearTimeout as passive has been toggled-off by decrementing extra lives
                  const woodAbility = _data[i].abilities.find(({ element, toggleOffPassiveTimeoutRef }) => element == 'wood' && !!toggleOffPassiveTimeoutRef);
                  if (woodAbility) {
                    clearTimeout(woodAbility.toggleOffPassiveTimeoutRef);
                    woodAbility.toggleOffPassiveTimeoutRef = undefined;
                  }
                  // } else if (_data[i].livesModifier < 0 && dmg.lifeDecrement < 0) {
                  //   // allow heals (negative "lifeDecrement") to remove (negative "livesModifier")
                  //   const remainingHeal = _data[i].livesModifier - dmg.lifeDecrement;
                  //   dmg.lifeDecrement = remainingHeal > 0 ? remainingHeal * -1 : 0;
                  //   _data[i].livesModifier = remainingHeal < 0 ? remainingHeal : 0;

                  //   // only death ability gives: negative "livesModifier." clearTimeout as passive has been "toggled-off"
                  //   const deathAbility = _data[i].abilities.find(({ element, toggleOffPassiveTimeoutRef }) => element == 'death' && !!toggleOffPassiveTimeoutRef);


                  //   if (deathAbility) {
                  //     clearTimeout(deathAbility.toggleOffPassiveTimeoutRef);
                  //   }
                }

                const MAX_LIVES = 4;
                const livesNewVal = _data[i].lives - dmg.lifeDecrement;
                _data[i].lives = Math.min(MAX_LIVES, livesNewVal);
                // dmg.lifeDecrement > 0 ||
                //   (_data[i].lives - dmg.lifeDecrement) < 5
                //   ? _data[i].lives - dmg.lifeDecrement
                //   : _data[i].lives;
                if (dmg.lifeDecrement < 0)
                  _data[i].isHealed = !_data[i].isHealed;

                const lives = _data[i].lives + _data[i].livesModifier;

                console.log({ _data, i }, "isDead outside");
                if (!_data[i].isDead && lives < 1) {
                  console.log({ _data, i }, "isDead");
                  _data[i].isDead = true;
                  setPlayerKillCount(count => count + 1);
                }
              }
            }
          });
      }
    }
    return _data;
  });
export const useAbility = ({
  a,
  data,
  _data,
  setData,
  i,
  j,
  accTime,
  setTeleportData,
  enemiesOnTiles,
  setTileStatuses,
  scale,
  isTriggerPassiveImmediately = true
}) => {
  // update accTime
  _data[i].abilities[j].accTime = accTime;

  // activate teammate active ability
  a.activateActive(
    i,
    data,
    setTeleportData,
    enemiesOnTiles,
    setTileStatuses,
    scale
  );

  const triggerPassive = () => {
    // toggle-on teammate passive ability
    if (!!_data[i]) {
      _data[i] = a.togglePassive(_data[i]);
    }

    const delay = a.passiveDurationTime ? a.passiveDurationTime : a.cooldownTimeAI;

    // toggle-off teammate passive ability
    const timeoutRef = setTimeout(() => setData(d => {
      if (!!d[i]) {
        const toggleOff = true;
        d[i] = a.togglePassive(d[i], toggleOff);
        d[i].abilities[j].toggleOffPassiveTimeoutRef = timeoutRef;
      }
      return d;
    }), delay);
  }

  if (isTriggerPassiveImmediately) {
    triggerPassive();
  } else {
    return triggerPassive;
  }
}
export const moveKaijuPieces = ({
  data,
  setData,
  tileStatuses,
  setTileStatuses,
  scale,
  accTime,
  enemyData, // playerData
  setEnemyData, // setPlayerData
  dmgArray,
  kaijuKillCount,
  setKaijuKillCount,
  isTutorial,
  winner,
  setDeadKaijuLocations,
  difficulty
}) =>
  setData(_data => {
    const { MAX_AT_ONCE, MAX_TO_WIN, KAIJU_COOL_DOWN } = determineKaijuQuantity(difficulty);
    let remainingNeeded;
    let currKillCount = kaijuKillCount.length;

    for (let i = 0; i < _data.length; i++) {
      if (!!_data[i].lives) {
        // use powers
        !!_data[i].abilities.length && _data[i].abilities.forEach((a, j) => {
          // AI triggers power immediately so delay next activation to let UI state catch-up
          const isCooldownOver = _data[i].isOnTiles &&
            (((accTime - a.accTime) >= KAIJU_COOL_DOWN)/*a.cooldownTimeAI)*/ || (accTime < a.accTime));
          if (isCooldownOver) {
            const [targetTile, _] = getClosestEntityTileAndIndexFromOriginTile(
              enemyData.filter(({ isDead }) => !isDead),
              _data[i].tile,
              scale
            );
            const numTilesFromTarget =
              _data[i].tile &&
              targetTile &&
              findPath(_data[i].tile, targetTile, scale, isTutorial).length;
            const isOffensivePowerAndTargetInRange =
              a.type.includes("offensive") &&
              numTilesFromTarget &&
              a.range >= numTilesFromTarget;
            if (isOffensivePowerAndTargetInRange) {
              _data[i].abilities[j].accTime = accTime;
              a.activateActive(
                i,
                data,
                () => { },
                enemyData,
                setTileStatuses,
                scale
              );
            }
          } else {
            // update dropShadowSize to show how close a Kaiju is to shooting fire.
            // const diff = accTime - a.accTime;
            // const HIGH = 20;
            // const LOW = 0;
            // const dropShadowSize = (HIGH - LOW) * diff / /*a.cooldownTimeAI*/ KAIJU_COOL_DOWN + LOW;
            // _data[i].dropShadowSize = dropShadowSize;
            // // update the Kaiju sprite sheet if close to spewing fire  
            const showFireTime = a.accTime // last game time the fire was spewed
              + KAIJU_COOL_DOWN // a.cooldownTimeAI // fire spew cooldown (12 seconds)
              * 0.75; // show the fire after 3/4 of the cooldown time (9 seconds) 
            _data[i].isGoingToSpewFire = !a.accTime || accTime > showFireTime;
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

        // also, reset the kaiju ability accTimes
        // _data[i].abilities.forEach(a => { a.accTime = accTime; });
      }

      // - - - - - - - - - - -
      // if Kaiju and on tiles, move toward the closest player.
      if (_data[i].isKaiju && _data[i].isOnTiles) {
        if (enemyData.length) {
          const [targetTile, _] = getClosestEntityTileAndIndexFromOriginTile(
            enemyData.filter(({ isDead }) => !isDead),
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
          moveSpeed: _data[i].moveSpeed + _data[i].moveSpeedModifier
        });
        _data[i].charLocation = newLocation;
        _data[i].isThere = hasArrived;
        // - - - - - - - - - - -
        if (_data[i].isThere && _data[i].moveToTiles.length) {
          const [nextTile, ...tiles] = _data[i].moveToTiles;
          const playerDirection = _data[i].isOnTiles
            ? getDirFromTiles(_data[i].tile, nextTile)
            : _data[i].dir;
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
        _data[i].isOnTiles &&
        _data[i].isThere &&
        !_data[i].moveToTiles.length &&
        _data[i].dir !== "idle"
      ) {
        _data[i].dir = "idle";
      }
      // const playerHealthBonusFromKaijuDeath = [0, 0]; // [player, teammate]
      dmgArray
        .filter(({ isKaiju }) => !!isKaiju === _data[i].isKaiju)
        .forEach(dmg => {
          if (
            _data[i].key === dmg.key &&
            !!_data[i].lives &&
            _data[i].isOnTiles
          ) {
            if (
              accTime - _data[i].lastDmg > 400 ||
              accTime - _data[i].lastDmg < 0
            ) {
              // can only get damaged once every 400 milliseconds.
              // also accTime might reset to zero, so check for that.
              _data[i].lastDmg = accTime;


              // if (_data[i].livesModifier > 0 && dmg.lifeDecrement > 0) {
              //   // decrement from extra lives (positive "livesModifier") before decrementing from health ("lives")
              //   const remainingDmg = dmg.lifeDecrement - _data[i].livesModifier;
              //   dmg.lifeDecrement = remainingDmg > 0 ? remainingDmg : 0;
              //   _data[i].livesModifier = remainingDmg < 0 ? remainingDmg * -1 : 0;
              // }
              // else if (_data[i].livesModifier < 0 && dmg.lifeDecrement < 0) {
              //   // allow heals (negative "lifeDecrement") to remove (negative "livesModifier")
              //   const remainingHeal = _data[i].livesModifier - dmg.lifeDecrement;
              //   dmg.lifeDecrement = remainingHeal > 0 ? remainingHeal * -1 : 0;
              //   _data[i].livesModifier = remainingHeal < 0 ? remainingHeal : 0;
              // }

              _data[i].lives =
                dmg.lifeDecrement > 0 ||
                  (_data[i].lives - dmg.lifeDecrement) < 5 // cap max health at 4... negative "lifeDecrement" is a heal
                  ? _data[i].lives - dmg.lifeDecrement
                  : _data[i].lives;
              if (dmg.lifeDecrement < 0)
                _data[i].isHealed = !_data[i].isHealed;
              if (!_data[i].lives) {
                setKaijuKillCount(kc => [...kc, dmg.playerIndex]);
                setDeadKaijuLocations(deadKaijuLocations => [...deadKaijuLocations, { charLocation: _data[i].charLocation, color: _data[i].color, tile: _data[i].tile }]);
              }
            }
          }
        });
    }

    const numAlive = _data.filter(({ lives }) => lives > 0).length;
    remainingNeeded = MAX_TO_WIN - (currKillCount + numAlive);

    const newKaiju =
      !isTutorial &&
      shouldUpdate(accTime, 10000) &&
      _data.length < MAX_AT_ONCE &&
      spawnKaiju(_data, enemyData, scale, false, isTutorial, difficulty);

    const respawnedKaijuData =
      !newKaiju &&
      shouldUpdate(accTime, 3000) &&
      remainingNeeded > 0 &&
      _data.map(k => {
        if (!k.lives && remainingNeeded > 0) {
          remainingNeeded -= 1;
          return {
            ...k,
            ...spawnKaiju(_data, enemyData, scale, true, isTutorial, difficulty)
          };
        }
        return k;
      });

    return !!newKaiju ?
      [..._data, newKaiju]
      : !!respawnedKaijuData ?
        respawnedKaijuData
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
export const useKeyPress = ({ keyCodes, keyDownCallback, keyUpCallback, isCharacterDead }) => {
  useEffect(() => {
    const handler = ({ code, repeat }, callback) => {
      // Exit immediately if the key is just being held down
      if (repeat) return;

      if (Array.isArray(keyCodes) && keyCodes.includes(code)) {
        callback(code);
      } else if (keyCodes === code) {
        callback(code);
      }
    };
    keyDownCallback && window.addEventListener("keydown", isCharacterDead ? () => { } : e => handler(e, keyDownCallback));
    keyUpCallback && window.addEventListener("keyup", isCharacterDead ? () => { } : e => handler(e, keyUpCallback));
    return () => {
      keyDownCallback && window.removeEventListener("keydown", isCharacterDead ? () => { } : e => handler(e, keyDownCallback));
      keyUpCallback && window.removeEventListener("keyup", isCharacterDead ? () => { } : e => handler(e, keyUpCallback));
    };
  }, [isCharacterDead]);
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
export const getSafeTile = ({ enemyData, tileStatuses, isMap, scale }) => {
  let safeTileObj = {
    distance: Number.MIN_SAFE_INTEGER,
    index: getRandomTileOnBoard(scale)
  };

  if (!enemyData.length) {
    return safeTileObj
  }

  const accKaijuAvgLocations = enemyData
    .filter(({ lives }) => !!lives)
    .map(({ tile }) => getCharXAndY({ ...tile, scale }))
    .reduce((acc, item) => { acc.x += item.x; acc.y += item.y; return acc }, { x: 0, y: 0 });

  const kaijuAvgLocation = { x: accKaijuAvgLocations.x / enemyData.length, y: accKaijuAvgLocations.y / enemyData.length };

  const allTiles = isMap ? NOT_BRIDGE_TILES_VALS : []; // TO-DO: make method that generates all {i,j} for current board
  allTiles.forEach(tile => {
    const currTileXY = getCharXAndY({ ...tile, scale });
    const testDist = getDistance(currTileXY, kaijuAvgLocation);
    if (testDist > safeTileObj.distance) {
      const isSafe = tileStatuses &&
        tileStatuses[tile.i] &&
        tileStatuses[tile.i][tile.j] &&
        Object.entries(tileStatuses[tile.i][tile.j]).filter(([_, v]) => !v).every(([k, _]) => !DEATH_TILE_STATUSES.includes(k))
      if (isSafe) {
        safeTileObj = {
          distance: testDist,
          index: tile
        };
      }
    }
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
export const getAdjacentAdjacentTiles = tile => {
  return [
    // ADJACENT TILES
    { i: 0, j: -1 },
    { i: 1, j: tile.i % 2 ? 0 : -1 },
    { i: 1, j: tile.i % 2 ? 1 : 0 },
    { i: 0, j: 1 },
    { i: -1, j: tile.i % 2 ? 1 : 0 },
    { i: -1, j: tile.i % 2 ? 0 : -1 },

    // TILES THAT ARE TWO ADJACENT
    { i: 0, j: 2 }, // up two
    { i: 0, j: -2 }, // down two
    { i: -2, j: -1 }, // up left two
    { i: 2, j: -1 }, // up right two
    { i: -2, j: 1 }, // down left two
    { i: 2, j: 1 }, // down right two
    { i: -1, j: tile.i % 2 ? -1 : -2 }, // top left two
    { i: 1, j: tile.i % 2 ? -1 : -2 }, // top right two
    { i: -2, j: 0 }, // left two
    { i: 2, j: 0 }, // right two
    { i: -1, j: tile.i % 2 ? 2 : 1 }, // bottom left two
    { i: 1, j: tile.i % 2 ? 2 : 1 }, // bottom right two
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
export const getAdjacentAdjacentTilesTutorial = tile => {
  return [
    // ADJACENT TILES
    { i: 0, j: -1 },
    { i: 1, j: tile.i % 2 ? 0 : -1 },
    { i: 1, j: tile.i % 2 ? 1 : 0 },
    { i: 0, j: 1 },
    { i: -1, j: tile.i % 2 ? 1 : 0 },
    { i: -1, j: tile.i % 2 ? 0 : -1 },

    // TILES THAT ARE TWO ADJACENT
    { i: 0, j: 2 }, // up two
    { i: 0, j: -2 }, // down two
    { i: -2, j: -1 }, // up left two
    { i: 2, j: -1 }, // up right two
    { i: -2, j: 1 }, // down left two
    { i: 2, j: 1 }, // down right two
    { i: -1, j: tile.i % 2 ? -1 : -2 }, // top left two
    { i: 1, j: tile.i % 2 ? -1 : -2 }, // top right two
    { i: -2, j: 0 }, // left two
    { i: 2, j: 0 }, // right two
    { i: -1, j: tile.i % 2 ? 2 : 1 }, // bottom left two
    { i: 1, j: tile.i % 2 ? 2 : 1 }, // bottom right two
  ]
    .map(t => {
      return { i: t.i + tile.i, j: t.j + tile.j };
    })
    .filter(t => isTileOnGameBoardTutorial(t));
};

export const findPath = (start, goal, scale, isTutorial, enemyTiles = undefined) => { // enemyTiles <- only used for the teammate pathing
  let count = 0;
  return recur(start, [], count).reduce((acc, tile) => {
    if (!!tile && !acc.lookup[`${tile.i} ${tile.j}`]) {
      acc.lookup[`${tile.i} ${tile.j}`] = true;
      acc.result.push(tile);
    }
    return acc;
  }, { lookup: {}, result: [] }
  ).result;
  function recur(currTile, arr, count) {
    if ((currTile.i === goal.i && currTile.j === goal.j) || count > 400)
      return arr;

    // produce all possible adjacent tile indices to currTile
    let adjacentTiles = isTutorial
      ? getAdjacentTilesTutorial(currTile)
      : getAdjacentTiles(currTile);

    if (!!enemyTiles) {
      const tilesWithEnemyTilesRemoved = adjacentTiles.filter(t => {
        // filter-out adjacent tiles that have Kaiju on them
        if (enemyTiles.some(e => e.i === t.i && e.j === t.j)) return false;

        // // filter-out adjacent tiles that have adjacent tiles with Kaiju on them
        const adjAdjTiles = isTutorial ? getAdjacentTilesTutorial(t).flat() : getAdjacentTiles(t).flat();
        return adjAdjTiles.every(at => !enemyTiles.some(e => e.i === at.i && e.j === at.j));
      });

      // do not allow teammate to run through enemies (if possible...)
      if (!!tilesWithEnemyTilesRemoved.length) {
        adjacentTiles = tilesWithEnemyTilesRemoved;
      }
    }

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

// not working
const findPath2 = ({
  numTiles,
  currTile,
  pathLookup,
  goalTile,
  goalLocation,
  scale,
  isTutorial,
  enemyData
}) => {

  // update values
  numTiles += 1
  const path = { ...pathLookup.path };
  path[numTiles] = currTile;

  const { i, j } = currTile;

  // if currTile is goalTile, return pathLookup object
  if (goalTile.i === i && goalTile.j === j) {
    return pathLookup
  }

  /*
    compute path weight:
    new accumulated weight = distance of current tile from goalTile
        + enemy on currTile + 75 + accumulated weight
  */
  const enemyTileKeys = enemyData.filter(({ lives }) => !!lives).map(
    ({ i, j }) => `${i} ${j}`);
  // if enemy is on tile add 50 to the weight (tile size = ~27)
  const enemyOnTileCost = enemyTileKeys.some(
    key => key === `${i} ${j}`) ? 50 : 0;
  const currTileLocation = getCharXAndY({ ...currTile, scale });
  const distance = getDistance(currTileLocation, goalLocation);
  const weight = Math.trunc(distance) + enemyOnTileCost + pathLookup.weight

  // getAdjacentTiles, do not duplicate tiles in path
  const currTileKeysInPathLookup = Object.values(pathLookup.path).reduce(
    (acc, tile) => { acc[`${tile.i} ${tile.j}`] = true; return acc; }, [])
  const getAdjTiles = isTutorial ?
    getAdjacentTilesTutorial : getAdjacentTiles;
  const adjacentTiles = getAdjTiles(currTile).filter(
    tile => !currTileKeysInPathLookup[`${tile.i} ${tile.j}`]);

  // return path with lowest accumulated weight
  return !!adjacentTiles.length ?
    adjacentTiles.map(tile => {
      return findPath2({
        numTiles,
        currTile: tile,
        pathLookup: { weight, path },
        goalTile,
        goalLocation,
        scale,
        isTutorial,
        enemyData
      });
    }).reduce((acc, item) =>
      item.weight < acc.weight ? item : acc,
      { weight: Number.MAX_SAFE_INTEGER, path: {} })
    : { weight: Number.MAX_SAFE_INTEGER, path: {} }
};

export const shouldUpdate = (accTime, interval) => !(accTime % interval);

export const useEventTick = ({
  playerData,
  setPlayerData,
  hoverLookupString,
  path,
  setPath,
  scale,
  kaijuData,
  setKaijuData,
  dmgArray,
  setDmgArray,
  tileStatuses,
  setTileStatuses,
  width,
  height,
  accTime,
  setHoverRef,
  setClickedTile,
  setTiles,
  teleportData,
  setTeleportData,
  setDeadKaijuLocations,
  TURN_DELAY,
  highlightedTiles0,
  setHighlightedTiles0,
  shouldKaijuMove,
  intervalTime
}) => useInterval(() => {
  const isTutorial = true;
  updateHighlightedTiles(
    setHighlightedTiles0,
    playerData,
    hoverLookupString,
    path,
    setPath,
    scale,
    isTutorial
  );
  if (shouldUpdate(accTime.current, TURN_DELAY)) {
    updateTileState(
      playerData,
      kaijuData,
      setDmgArray,
      setTileStatuses,
      width,
      height,
      scale,
      accTime.current,
      isTutorial
    );
  }
  redrawTiles({
    highlightedTiles0,
    setHoverRef,
    setClickedTile,
    setTiles,
    playerData,
    kaijuData,
    tileStatuses,
    setTileStatuses,
    scale,
    isTutorial
  });
  // move players
  playerData.length &&
    movePlayerPieces(
      playerData,
      setPlayerData,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      kaijuData,
      dmgArray,
      () => { },
      teleportData,
      setTeleportData,
      isTutorial
    );
  // move monsters
  kaijuData.length &&
    shouldKaijuMove &&
    moveKaijuPieces({
      data: kaijuData,
      setData: setKaijuData,
      tileStatuses: tileStatuses,
      setTileStatuses: setTileStatuses,
      scale: scale,
      accTime: accTime.current,
      enemyData: playerData,
      setEnemyData: setPlayerData,
      dmgArray: dmgArray,
      kaijuKillCount: [],
      setKaijuKillCount: () => { },
      isTutorial: true,
      winner: null,
      setDeadKaijuLocations: setDeadKaijuLocations
    });
  // update accumulated time.
  accTime.current =
    accTime.current > Number.MAX_SAFE_INTEGER - 10000
      ? 0
      : accTime.current + intervalTime;
}, intervalTime);

export const useUpdateClickedMovetoTile = ({
  playerMoveToTiles,
  setPlayerData,
  setPlayerMoveToTiles
}) => {
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      const adjTilesToPath = playerMoveToTiles[0] && [
        playerMoveToTiles[0],
        ...getAdjacentTilesTutorial(playerMoveToTiles[0])
      ];
      setPlayerData(_playerData =>
        _playerData.map((p, i) => {
          if (i === 0) {
            const adjTilesToPlayer = p.tile && [
              p.tile,
              ...getAdjacentTilesTutorial(p.tile)
            ];
            const shouldSet =
              adjTilesToPlayer &&
              adjTilesToPath &&
              adjTilesToPlayer.some(t =>
                adjTilesToPath.some(_t => _t.i === t.i && _t.j === t.j)
              );
            return {
              ...p,
              moveToTiles: shouldSet ? playerMoveToTiles : p.moveToTiles
            };
          } else {
            return p;
          }
        })
      );
    }
    setPlayerMoveToTiles(null);
  }, [playerMoveToTiles]);
}

export const useUpdateTutorialScreenContent = ({
  tutorialViewIndex,
  setBackButtonContent,
  setNextButtonContent,
  setTitle,
  setBackButtonCallback,
  setShouldKaijuMove,
  triggerTransition,
  handleClickHome,
  handleClickGame,
  incrementTutorialViewIndex,
  decrementTutorialViewIndex,
  setFullScreenPageData,
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
  backButtonCallback,
  setIsHomeButton,
  selectedAvatar,
  setGameBoardMarginTop
}) => {
  useEffect(() => {

    // gameboard variables  
    let playerSpawnPositions = [];
    let kaijuSpawnPositions = [];
    let abilities = [];

    // full-page screen variables
    let text, buttons, image, backgroundImgs, homeButtonOnClick = undefined;

    switch (tutorialViewIndex) {
      case 0:
        playerSpawnPositions = [{ i: 11, j: 5 }];
        kaijuSpawnPositions = [];
        setBackButtonContent("Home");
        setNextButtonContent("Got it!");
        setTitle(["This is you.", "Click on a tile to walk to it"]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => handleClickHome())
        );
        setIsHomeButton(false);
        break;
      case 1:
        text = ["You are a Kaiju Warrior,", "the best of the best."];
        buttons = [
          { text: "Back", onClick: () => triggerTransition(() => decrementTutorialViewIndex()) },
          { text: "Ok", onClick: incrementTutorialViewIndex }
        ];
        image = { src: './story_images/tutorial_kaiju_warrior.png', width: '896px', height: '1200px' };
        backgroundImgs = [
          {
            src: './Background_Wires.png',
            width: 901,
            height: 942,
            styles: `filter: opacity(.2) saturate(.4); position: absolute; z-index: -1; transition: transform 1.5s; transform: scale(1, .8) translate(400px, 0px);`
          }
        ]
        homeButtonOnClick = () => triggerTransition(() => handleClickHome());
        setBackButtonCallback(() => () => triggerTransition(() => decrementTutorialViewIndex()));
        setIsHomeButton(true);
        break;
      case 2:
        text = ["This is your home, Kaiju City."];
        buttons = [{ text: "Back", onClick: backButtonCallback }, { text: "Ok", onClick: incrementTutorialViewIndex }];
        image = { src: './Map.gif', width: '500px', height: '800px' };
        backgroundImgs = [
          // TO-DO: Add anim: "bobbing" - - - - - -
          // NIGHT CLOUD (bottom-left):
          {
            src: './Night_Cloud.png',
            width: 647,
            height: 367,
            styles: `position: absolute; z-index: 0; bottom: -70px; left: -300px; transform: scale(-.7, .7);`
          },
          // NIGHT CLOUD (top-right):
          {
            src: './Night_Cloud.png',
            width: 647,
            height: 367,
            styles: `position: absolute; z-index: 0; top: -120px; right: -300px; transform: scale(-.9, -.6);`
          },
          // - - - - - - - - - - - - - - - - - - - - -

          // TO-DO: Add anim: "moving off-screen left to right, off-screen" - - - - - -
          // NIGHT CLOUD (moving, big cloud, front):
          {
            src: './Night_Cloud.png',
            width: 647,
            height: 367,
            styles: `position: absolute; z-index: 1; transition: transform 1.5s; transform: scale(.7) translate(700px, 300px); filter: drop-shadow(0px 500px 20px black);`
          },
          // NIGHT CLOUD (moving, medium cloud, middle):
          {
            src: './Night_Cloud.png',
            width: 647,
            height: 367,
            styles: `    position: absolute; z-index: -1; transition: transform 1.5s; transform: scale(.4) translate(600px, 340px); filter: drop-shadow(0px 500px 20px black);`
          },
          // NIGHT CLOUD (moving, little cloud, back):
          {
            src: './Night_Cloud.png',
            width: 647,
            height: 367,
            styles: `position: absolute; z-index: -2; transition: transform 1.5s; transform: scale(.2) translate(4000px, 600px); filter: drop-shadow(0px 500px 20px black);`
          }
          // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        ];
        homeButtonOnClick = () => triggerTransition(() => handleClickHome());
        break;
      case 3:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [{ i: 11, j: 4 }];
        setBackButtonContent("Back");
        setNextButtonContent("Ok...");
        setTitle(["This is a Kaiju"]);
        setShouldKaijuMove(false);
        break;
      case 4:
        playerSpawnPositions = [{ i: 11, j: 6 }];
        kaijuSpawnPositions = [
          { i: 19, j: 3 },
          { i: 3, j: 3 },
          { i: 11, j: 1 }
        ];
        setBackButtonContent("Back");
        setNextButtonContent("Ahhh!");
        setTitle([`Kaiju eat people!`]);
        setShouldKaijuMove(true);
        break;
      case 5:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [];
        setBackButtonContent("Back");
        setNextButtonContent("Ok!");
        setTitle([`This is your teammate.`]);
        setIsHomeButton(true);
        setGameBoardMarginTop(undefined);
        break;
      case 6:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
        setBackButtonContent("Back");
        setNextButtonContent("Next");
        setIsHomeButton(false);
        setGameBoardMarginTop(20);
        setTitle([
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignSelf: "center",
              // margin: "20px 0px -5px 0px"
            }}
          >
            <div style={{ margin: "5px" }}>
              Click on ability buttons</div>
            <div style={{ margin: "5px" }}>
              or use num keys 1-9
            </div>
            <div style={{ margin: "5px" }}>
              to attack and defend.
            </div>
          </div>,
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignSelf: "center",
              margin: "10px, 0px, 20px, 0px"
            }}
          >
            <p style={{ margin: "10px, 0px, 20px, 0px" }}>Right tile statuses replace left:</p>
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "space-around"
              }}
            >
              <StyledIcon className="fa fa-leaf" color="Chartreuse" />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-around",
                  alignSelf: "center"
                }}
              >
                <StyledIcon className="fa fa-free-code-camp" color="#df73ff" />
                <StyledIcon className="fa fa-free-code-camp" color="tomato" />
              </div>
              <StyledIcon className="fa fa-shield" color="AntiqueWhite" />
              <StyledIcon className="fa fa-snowflake-o" color="PaleTurquoise" />
              <StyledIcon className="fa fa-bolt" color="cyan" />
              <StyledIcon className="fa fa-snapchat-ghost" color="GhostWhite" />
              <StyledIcon className="fa fa-question-circle-o" color="Thistle" />
              <StyledIcon className="fa fa-heart" color="pink" />
            </div>
          </div>
        ]);
        break;
      case 7:
        setGameBoardMarginTop(undefined);
        text = ["Defeat the Kaiju,", "save the city!"];
        buttons = [
          { text: "Back", onClick: () => triggerTransition(() => decrementTutorialViewIndex()) },
          { text: "Play", onClick: () => triggerTransition(() => handleClickGame()) }
        ];
        image = { src: './story_images/tutorial_exit.png', width: '895px', height: '1200px' };
        backgroundImgs = [
          // TO-DO: Add anim: "move to position (position = bottom/top/left/right) from off-screen left, then bobbing infinite once in position" - - - - - -
          // DAY CLOUD (top-left, smallest):
          {
            src: './Day_Cloud.png',
            width: 660,
            height: 417,
            styles: `position: absolute; z-index: -1; transition: transform 1.5s; top: -140px; right: 50px; transform: scale(-.2, 0.15) translate(0px, 0px);`
          },
          // DAY CLOUD (top-right, medium):
          {
            src: './Day_Cloud.png',
            width: 660,
            height: 417,
            styles: `position: absolute; z-index: 1; transition: transform 1.5s; top: -120px; right: -200px; transform: scale(-.4, .35) translate(0px, 0px);`
          },
          // DAY CLOUD (bottom-middle, largest):
          {
            src: './Day_Cloud.png',
            width: 660,
            height: 417,
            styles: `position: absolute; z-index: 1; transition: transform 1.5s; bottom: -115px; right: 260px; transform: scale(-.6, .4) translate(0px, 0px);`
          }
        ]
        homeButtonOnClick = () => triggerTransition(() => handleClickHome());
        break;
    }

    !!buttons ? setFullScreenPageData({
      text,
      buttons,
      image,
      backgroundImgs,
      homeButtonOnClick
    }) : setFullScreenPageData(undefined);

    initializeTutorialGameBoard({
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
      selectedAvatar
    });
  }, [tutorialViewIndex, selectedAvatar]);
}

export const useUpdateSettingsScreen = ({
  currAbility,
  setTitle,
  setShouldKaijuMove,
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
  selectedAvatar
}) => {
  useEffect(() => {
    const playerSpawnPositions = [
      { i: 3, j: 3 }
    ];
    const kaijuSpawnPositions = [{ i: 19, j: 3 }];
    const abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
    setShouldKaijuMove(false);
    setTitle([
      <>
        <StyledIcon className="fa fa-leaf" color="Chartreuse" />
        <StyledIcon className="fa fa-free-code-camp" color="tomato" />
        <StyledIcon className="fa fa-shield" color="AntiqueWhite" />
        <StyledIcon className="fa fa-snowflake-o" color="PaleTurquoise" />
        <StyledIcon className="fa fa-bolt" color="cyan" />
        <StyledIcon className="fa fa-snapchat-ghost" color="GhostWhite" />
        <StyledIcon className="fa fa-question-circle-o" color="Thistle" />
        <StyledIcon className="fa fa-heart" color="pink" />
      </>
    ]);

    initializeTutorialGameBoard({
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
      selectedAvatar
    });
  }, [currAbility]);
}

export const getAbilityPickerDescription = (string, playerData, playerIndex) => {
  switch (string) {
    case "modifiers":
      return playerData && playerData[playerIndex]
        ? {
          title: playerIndex === 1 ? "Your teammate" : "You",
          description: [
            <div>
              Move Speed:{" "}
              <span
                style={{
                  color:
                    playerData[playerIndex].moveSpeed > 6
                      ? "green"
                      : playerData[playerIndex].moveSpeed < 6
                        ? "red"
                        : "black"
                }}
              >
                {playerData[playerIndex].moveSpeed}
              </span>
            </div>,
            <br />,
            <div>
              Lives:{" "}
              <span
                style={{
                  color:
                    playerData[playerIndex].lives > 4
                      ? "green"
                      : playerData[playerIndex].lives < 4
                        ? "red"
                        : "black"
                }}
              >
                {playerData[playerIndex].lives}
              </span>
            </div>,
            <br />,
            <div>
              Num Tiles Modifier:{" "}
              <span
                style={{
                  color:
                    playerData[playerIndex].numTilesModifier > 0
                      ? "green"
                      : "black"
                }}
              >
                {playerData[playerIndex].numTilesModifier}
              </span>
            </div>,
            <br />,
            <div>
              Tiles Count Modifier:{" "}
              <span
                style={{
                  color:
                    playerData[playerIndex].tileCountModifier > 0
                      ? "green"
                      : "black"
                }}
              >
                {playerData[playerIndex].tileCountModifier}
              </span>
            </div>
          ],
          effect1: "",
          effect2: "",
          img: "",
          formatData: {}
        }
        : {
          title: "",
          description: "",
          effect1: "",
          effect2: "",
          img: "",
          formatData: {}
        };
    case "class":
      return {
        title:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].playerClass &&
          `Class: ${playerData[playerIndex].playerClass}`,
        description:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].playerClassDescription &&
          playerData[playerIndex].playerClassDescription,
        effect1:
          playerData &&
          playerData[playerIndex] &&
          playerData[playerIndex].elements &&
          playerData[playerIndex].elements,
        effect2: "",
        img: "",
        formatData: {}
      };
    case "abilityLoveActive":
      return {
        title: "Heal",
        description: "Heal your teammate",
        effect1: "",
        effect2: "RoE: 7 AoE: 1",
        RoE: "7",
        AoE: "1",
        img: "",
        formatData: {},
        icon: "fa-heart",
        color: "pink"
      };
    case "abilityLovePassive":
      return {
        title: "Good Vibes",
        description: "You send out good vibes",
        effect1: "+1 effect range",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-gratipay",
        color: "pink"
      };
    case "abilityMetalPassive":
      return {
        title: "Seasoned Builder",
        description: "You are prolific",
        effect1: "+1 effect range",
        effect2: "",
        // effect2: "+1 tile count modifier",
        img: "",
        formatData: {},
        icon: "fa-wrench",
        color: "AntiqueWhite"
      };
    case "abilityMetalActive":
      return {
        title: "Aegis",
        description:
          "Create an area of protection around you. Blocking many ranged attacks",
        effect1: "Status remains on the tile until walked on",
        effect2: "RoE: 2 AoE: 6",
        RoE: "2",
        AoE: "6",
        img: "",
        formatData: {},
        icon: "fa-shield",
        color: "AntiqueWhite"
      };
    case "abilityGlassPassive":
      return {
        title: "Warp Energy Overload",
        description: "For a short time after teleporting, your magic is multiplied",
        effect1: "+2 effect area",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-tencent-weibo",
        color: "BlueViolet"
      };
    case "abilityGlassActive":
      return {
        title: "Escape",
        description: "Instantly travel to a safe tile",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-ravelry",
        color: "BlueViolet"
      };
    case "abilityIcePassive":
      return {
        title: "Inclement Weather",
        description: "The forecast calls for snow",
        effect1: "-1 move speed",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-thermometer-quarter",
        color: "PaleTurquoise"
      };
    case "abilityIceActive":
      return {
        title: "Ice Slice",
        description: "Conjure a stationary vortex of ice",
        effect1: "",
        effect2: "RoE: 10 AoE: 6",
        RoE: "10",
        AoE: "6",
        img: "",
        formatData: {},
        icon: "fa-snowflake-o",
        color: "PaleTurquoise"
      };
    case "abilityWaterPassive":
      return {
        title: "Slippery",
        description: "...when wet. Exercise caution.",
        effect1: "-1 movement speed",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-exclamation-triangle",
        color: "#3c7fde"
      };
    case "abilityWaterActive":
      return {
        title: "Tidal Wave",
        description: "Create a single, lateral line of water",
        effect1: "Water travels in the direction of your closest enemy",
        effect2: "RoE: 10 AoE: 3",
        RoE: "10",
        AoE: "3",
        img: "",
        formatData: {},
        icon: "fa-tint",
        color: "#3c7fde"
      };
    case "abilityFirePassive":
      return {
        title: "Uncontrolled Burn",
        description: "You've cleared a path...",
        effect1: "+1 effect range",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-fire",
        color: "tomato"
      };
    case "abilityFireActive":
      return {
        title: "Wildfire",
        description: "Create a single, lateral line of fire",
        effect1: "Fire travels in the direction of your closest enemy",
        effect2: "RoE: 10 AoE: 3",
        RoE: "10",
        AoE: "3",
        img: "",
        formatData: {},
        icon: "fa-free-code-camp",
        color: "tomato"
      };
    case "abilityWoodPassive":
      return {
        title: "Healthy",
        description: "You're extra healthy",
        effect1: "+1 health",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-tree",
        color: "Chartreuse"
      };
    case "abilityWoodActive":
      return {
        title: "Overgrowth",
        description:
          "Poison ivy travels to your closest enemy",
        effect1: "Status remains on the tile until walked on",
        effect2: "RoE: 10 AoE: 3",
        RoE: "10",
        AoE: "3",
        img: "",
        formatData: {},
        icon: "fa-leaf",
        color: "Chartreuse"
      };
    case "abilityLightningPassive":
      return {
        title: "Charged Step",
        description: "Electrical energy courses through your body",
        effect1: "+2 move speed",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-hourglass-half",
        color: "cyan"
      };
    case "abilityLightningActive":
      return {
        title: "Discharge",
        description:
          "Cast 3 bolts of lightning in the direction of your closest enemy",
        effect1: "Bolts ricochet off the walls of the map",
        effect2: "RoE: 20 AoE: 3",
        RoE: "20",
        AoE: "3",
        img: "",
        formatData: {},
        icon: "fa-bolt",
        color: "cyan"
      };
    case "abilityDeathPassive":
      return {
        title: "Blood Ritual",
        description: "You cut a fresh wound",
        effect1: "-1 health",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-heartbeat",
        color: "GhostWhite"
      };
    case "abilityDeathActive":
      return {
        title: "Haunt",
        description: "Shoot a ghost at your closest enemy",
        effect1: "",
        effect2: "RoE: 30 AoE: 1",
        RoE: "30",
        AoE: "1",
        img: "",
        formatData: {},
        icon: "fa-snapchat-ghost",
        color: "GhostWhite"
      };
    case "abilityBubblePassive":
      return {
        title: "Insight",
        description: "The bubbles teach you so many things",
        effect1: "+1 effect range",
        effect2: "",
        img: "",
        formatData: {},
        icon: "fa-universal-access",
        color: "Thistle"
      };
    case "abilityBubbleActive":
      return {
        title: "Dispel",
        description: "Dispel all tile effects around you",
        effect1: "Clears both positive and negative statuses",
        effect2: "RoE: 7 AoE: 6",
        RoE: "7",
        AoE: "6",
        img: "",
        formatData: {},
        icon: "fa-question-circle-o",
        color: "Thistle"
      };
    case "healthBar":
      return {
        title: "Health Bar",
        description: "Your health bar",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {},
        icon: ""
      };
    case "Kaiju":
      return {
        title: "Kaiju",
        description: "They come from the sea!",
        effect1: "",
        effect2: "",
        img: "",
        formatData: {},
        icon: ""
      };
  }
};

export const determineKaijuQuantity = difficulty => {
  let MAX_AT_ONCE, MAX_TO_WIN, KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN = undefined;
  switch (difficulty) {
    case Difficulty.Easy:
      MAX_AT_ONCE = 2;
      MAX_TO_WIN = 5;
      KAIJU_MAX_HEALTH = 2;
      KAIJU_MAX_SPEED = 2;
      KAIJU_COOL_DOWN = 12000;
      break;
    case Difficulty.Hard:
      MAX_AT_ONCE = 4;
      MAX_TO_WIN = 20;
      KAIJU_MAX_HEALTH = 3;
      KAIJU_MAX_SPEED = 3;
      KAIJU_COOL_DOWN = 9000;
      break;
    case Difficulty.Xtreme:
      MAX_AT_ONCE = 5;
      MAX_TO_WIN = 50;
      KAIJU_MAX_HEALTH = 3;
      KAIJU_MAX_SPEED = 3;
      KAIJU_COOL_DOWN = 6000;
      break;
    default: // Difficulty.Medium
      MAX_AT_ONCE = 3;
      MAX_TO_WIN = 10;
      KAIJU_MAX_HEALTH = 3;
      KAIJU_MAX_SPEED = 2;
      KAIJU_COOL_DOWN = 12000;
  }
  return { MAX_AT_ONCE, MAX_TO_WIN, KAIJU_MAX_HEALTH, KAIJU_MAX_SPEED, KAIJU_COOL_DOWN };
}
export const modifyStats = (playerStats, toggleOff, attr, modifier) => {
  const mod = (toggleOff ? -1 : 1) * modifier;
  const modification = playerStats[attr] + mod;
  const update = ({
    ...playerStats,
    [attr]: modification
  })
  return update;
};