import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import { PENINSULA_TILE_LOOKUP, BRIDGE_TILES } from "./Utils/gameState";
import {
  getCharXAndY,
  getRandomIntInRange,
  useInterval,
  useKeyPress,
  useHover,
  movePiece,
  respawnPlayers,
  spawnKaiju,
  spawnPowerUp,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles
} from "./Utils/utils";
import "./App.css";
const GameTitle = styled.div`
  display: flex;
  margin-top: 40px;
  margin-left: 40px;
  margin-bottom: -50px;
  color: black;
  font-family: data;
  font-size: 40px;
  @font-face {
    font-family: data;
    src: url(Datalegreya-Dot.otf);
  }
`;
const App = () => {
  /*
        1. teammate a.i.
        2. graveyard placement.
        3. home screen.
        4. pause game on key presses. pause modal.
        5. tutorial.
        6. have powers attack the closest monster.

        - tileStatus updates.
        - make character move to the last tile on a path.
        - do a circular of icons around profile pic for activated passives
        - hover descriptions.
        - fix issue with NaN location values.
        - hexagon pathing
        - kaijus only move if clicked on, and then stop moving when they get to the next tile.
                - do not allow Kaiju to move to tiles that are adjacent to other Kaiju
        - make a single event tick with useInterval at GameBoard level.
        - mana wells / kaiju need to be sorted so that they form a non convex hull
        - x,y coords of peninsula (whether or not something is on peninsula)
        - hexagons need x,y coords
        - player start vertices
        - starting Kaiju for each player
        - graveyard respawn point (decrement gravestones) at player death
        - player movement speed
        - mana pool polygons drawn between mana wells:
            https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#drawing_a_triangle
            https://medium.com/@pdx.lucasm/canvas-with-react-js-32e133c05258
        - test whether player inside or outside his mana pool
        - pull up Player functional state and store in 'players' state variable at GameBoard level.
            - pass down state to Player component
    */
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const [intervalTime, setIntervalTime] = useState(100);
  const [accTime, setAccTime] = useState(0);
  const [playerData, setPlayerData] = useState([]);
  const [winner, setWinner] = useState(null);
  const [graveyardData, setGraveyardData] = useState([]);
  const [graveyardTileKeys, setGraveyardTileKeys] = useState([]);
  const [powerUpData, setPowerUpData] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [elementPickUps, setElementPickUps] = useState([
    "ice",
    // "glass"
    "fire",
    "wood",
    "lightning",
    "death",
    "bubble",
    "metal"
  ]);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const incrementPlayerLives = index => {
    setPlayerData(_players =>
      _players.map((p, i) => (i === index ? { ...p, lives: p.lives - 1 } : p))
    );
  };
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  // useKeyPress(
  //   code => {
  //     let offset = { i: 0, j: 0 };
  //     switch (code) {
  //       case "KeyW":
  //         offset = { i: 0, j: -1 }; // up
  //         break;
  //       case "KeyS":
  //         offset = { i: 0, j: 1 }; // down
  //         break;
  //       case "KeyD":
  //         offset = { i: 1, j: 0 }; // down left
  //         break;
  //       case "KeyA":
  //         offset = { i: -1, j: 0 }; // up left
  //         break;
  //       default:
  //         offset = { i: 0, j: 0 };
  //     }
  //     setPlayerData(_players =>
  //       _players.map((p, i) => {
  //         if (i === 0 && p.isThere) {
  //           const nextTile = {
  //             i: p.tile.i + offset.i,
  //             j: p.tile.j + offset.j
  //           };
  //           return PENINSULA_TILE_LOOKUP &&
  //             PENINSULA_TILE_LOOKUP[`${nextTile.i} ${nextTile.j}`] &&
  //             graveyardTileKeys.every(
  //               key => key !== `${nextTile.i} ${nextTile.j}`
  //             )
  //             ? {
  //                 ...p,
  //                 moveToLocation: getCharXAndY({
  //                   ...nextTile,
  //                   scale
  //                 }),
  //                 isThere: false,
  //                 moveFromLocation: p.charLocation,
  //                 tile: {
  //                   i: p.tile.i + offset.i,
  //                   j: p.tile.j + offset.j
  //                 }
  //               }
  //             : p;
  //         } else {
  //           return p;
  //         }
  //       })
  //     );
  //   },
  //   ["KeyW", "KeyA", "KeyS", "KeyD"]
  // );
  useEffect(() => {
    const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
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
      _players.push({
        isInManaPool: false,
        color: k ? "salmon" : "blue",
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [],
        tile: { i, j },
        i: k,
        isThere: true,
        moveSpeed: 14,
        lives: 3,
        abilities: [],
        abilityCooldowns: [],
        accessory: {
          displayLookup: "testAccessoryLookup",
          accessoryImgFile: "fire_icon.png"
        }
      });
    }
    setPlayerData(_players);
    // PLAYERS    - - - - - - - - - -
    // GRAVEYARDS - - - - - - - - - -
    const _graveyards = [];
    for (let k = 0; k < 10; k++) {
      _max -= k;
      const bridgeTiles = Object.values(BRIDGE_TILES);
      const bridgeTile = bridgeTiles[bridgeTiles.length - 1];
      let key = `${bridgeTile.i} ${bridgeTile.j}`;
      let randTile, randomInt;
      while (BRIDGE_TILES[key]) {
        randomInt = getRandomIntInRange({
          max: _max
        });
        randTile = tileIndices[randomInt];
        key = `${randTile.i} ${randTile.j}`;
      }
      const { i, j } = randTile;
      const storeItem = tileIndices.length - k;
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      const charLocation = getCharXAndY({ i, j, scale });
      const { x, y } = charLocation;
      _graveyards.push({
        charLocation,
        tile: { i, j },
        isUsed: false
      });
    }
    setGraveyardData(_graveyards);
    setGraveyardTileKeys(_graveyards.map(({ tile }) => `${tile.i} ${tile.j}`));
    // GRAVEYARDS - - - - - - - - - -
    // TILES      - - - - - - - - - -
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
    // TILES      - - - - - - - - - -
  }, []);
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      setPlayerData(_playerData =>
        _playerData.map((p, i) =>
          i === 0 ? { ...p, moveToTiles: playerMoveToTiles } : p
        )
      );
      setPlayerMoveToTiles(null);
    }
  }, [playerMoveToTiles]);
  useEffect(() => {
    if (winner) {
      console.log(winner.i === 0 ? "You won!" : "Other guy won.");
      setIntervalTime(null);
    }
  }, [winner]);
  useInterval(() => {
    // move players
    movePiece(
      playerData,
      setPlayerData,
      powerUpData,
      setPowerUpData,
      setTileStatuses,
      graveyardTileKeys,
      scale
    );
    // move monsters
    // (monsters become tile statuses when they reach the tiles.)
    if (shouldUpdate(accTime, 500))
      movePiece(
        kaijuData,
        setKaijuData,
        undefined,
        undefined,
        setTileStatuses,
        graveyardTileKeys,
        scale
      );
    // powerup spawning.
    if (shouldUpdate(accTime, 5000))
      spawnPowerUp(
        powerUpData,
        setPowerUpData,
        elementPickUps,
        setElementPickUps,
        graveyardTileKeys,
        playerData,
        scale
      );
    // spawn monsters on gameboard
    if (shouldUpdate(accTime, 2000))
      spawnKaiju(playerData, setKaijuData, setTileStatuses, scale);
    if (shouldUpdate(accTime, 100))
      redrawTiles(
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
      );
    if (shouldUpdate(accTime, 500))
      updateTileState(
        playerData,
        setTileStatuses,
        incrementPlayerLives,
        width,
        height,
        scale
      );
    if (shouldUpdate(accTime, 100))
      updateHighlightedTiles(
        setHighlightedTiles,
        playerData,
        graveyardTileKeys,
        hoverLookupString,
        path,
        setPath,
        scale
      );
    // respawnPlayers(
    //   setPlayerData,
    //   graveyardData,
    //   setGraveyardData,
    //   setWinner,
    //   scale
    // );
    setAccTime(accTime + intervalTime);
  }, intervalTime);
  // <GameTitle>Kaiju City</GameTitle>
  return (
    <>
      <div className="App">
        <GameBoard
          powerUpData={powerUpData}
          playerData={playerData}
          kaijuData={kaijuData}
          graveyardTileKeys={graveyardTileKeys}
          setPlayerMoveToTiles={setPlayerMoveToTiles}
          tileStatuses={tileStatuses}
          setTileStatuses={setTileStatuses}
          clickedTile={clickedTile}
          setClickedTile={setClickedTile}
          tiles={tiles}
          path={path}
          width={width}
          height={height}
          scale={scale}
        />
        <UI
          playerData={playerData}
          setPlayerData={setPlayerData}
          setTileStatuses={setTileStatuses}
          scale={scale}
        />
      </div>
    </>
  );
};

export default App;
