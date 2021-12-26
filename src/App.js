import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import {
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PLAYER_ABILITIES,
  PLAYER_CLASSES
} from "./Utils/gameState";
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
        1. home screen.
        2. teammate a.i.
        3. have smarter ai for teammate lightning power... (like a rook queen or bishop in chess)
        4. tutorial.
        5. Determine class compliments for teammate so gameplay feels balanced.
        6. Clean up code.

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
  const [isPaused, setIsPaused] = useState(false);
  const [dmgArray, setDmgArray] = useState([]);
  const [intervalTime, setIntervalTime] = useState(100);
  // const [accTime, setAccTime] = useState(0);
  const accTime = useRef(0);
  const [playerData, setPlayerData] = useState([]);
  const [teleportData, setTeleportData] = useState([]);
  const [winner, setWinner] = useState(null);
  const [powerUpData, setPowerUpData] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles, setHighlightedTiles] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [elementPickUps, setElementPickUps] = useState([
    "ice",
    // "glass",
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
  useKeyPress(
    code => {
      switch (code) {
        case "Escape":
          setIsPaused(_isPaused => !_isPaused);
          setIntervalTime(_intervalTime =>
            _intervalTime === null ? 100 : null
          );
          break;
      }
    },
    ["Escape"]
  );
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
      const [_, playerClass] = PLAYER_CLASSES.find(pc => {
        const [key, _class] = pc.split(" ");
        return key === classLookUpKey;
      }).split(" ");
      console.log(playerClass);
      _players.push({
        key: Math.random(),
        isInManaPool: false,
        color: k ? "salmon" : "blue",
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [],
        tile: { i, j },
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
        playerClass,
        accessory: {
          displayLookup: "testAccessoryLookup",
          accessoryImgFile: "fire_icon.png"
        }
      });
    }
    setPlayerData(_players);
    // PLAYERS    - - - - - - - - - -
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
          isKaiju: kaijuData
            .filter(k => k.isOnTiles)
            .find(key => key === `${i} ${j}`)
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
  useInterval(() => {
    // move players
    movePiece(
      playerData,
      setPlayerData,
      powerUpData,
      setPowerUpData,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      kaijuData,
      dmgArray,
      teleportData,
      setTeleportData
    );
    // move monsters
    movePiece(
      kaijuData,
      setKaijuData,
      undefined,
      undefined,
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      playerData,
      dmgArray
    );
    // powerup spawning.
    if (shouldUpdate(accTime.current, 30000))
      spawnPowerUp(
        powerUpData,
        setPowerUpData,
        elementPickUps,
        setElementPickUps,
        playerData,
        scale
      );
    updateHighlightedTiles(
      setHighlightedTiles,
      playerData,
      hoverLookupString,
      path,
      setPath,
      scale
    );
    if (shouldUpdate(accTime.current, 400))
      updateTileState(
        playerData,
        kaijuData,
        setDmgArray,
        setTileStatuses,
        incrementPlayerLives,
        width,
        height,
        scale,
        accTime.current
      );
    if (shouldUpdate(accTime.current, 300))
      redrawTiles(
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
      );

    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
    // setAccTime(
    //   accTime > Number.MAX_SAFE_INTEGER - 10000 ? 0 : accTime + intervalTime
    // );
  }, intervalTime);
  // <GameTitle>Kaiju City</GameTitle>
  return (
    <>
      <div className="App">
        <GameBoard
          isPaused={isPaused}
          powerUpData={powerUpData}
          playerData={playerData}
          kaijuData={kaijuData}
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
          kaijuData={kaijuData}
          setPlayerData={setPlayerData}
          setTeleportData={setTeleportData}
          setTileStatuses={setTileStatuses}
          scale={scale}
        />
      </div>
    </>
  );
};

export default App;
