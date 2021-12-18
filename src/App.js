import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES,
  PERIMETER_TILES,
  PLAYER_ABILITIES
} from "./Utils/gameState";
import {
  getRandAdjacentTile,
  getCharXAndY,
  getTileXAndY,
  getRandomIntInRange,
  useInterval,
  useKeyPress,
  movePiece,
  isLocatonInsidePolygon,
  checkIsInManaPool,
  setTileWithStatus,
  shootPower,
  respawnPlayers,
  getAdjacentTiles,
  getClosestPerimeterTileFromLocation,
  getAdjacentTilesFromNormVec,
  getNormVecFromTiles
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
        1. randomized starting setup for each player.
        2. kaiju pickups.
        3. enemy a.i.
        4. object placement, breadth first search
                final battleground vertex / "end game point"
                    graveyard placement
                do not place mana wells adjacent to one another
        5. home screen.
        6. deactivate passive when active is on cooldown

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
  const gameBoardStandIn = (
    <div
      style={{
        width: "500px",
        height: "800px",
        minWidth: "500px",
        borderStyle: "solid",
        borderThickness: "thin",
        borderRadius: "10px"
      }}
    ></div>
  );
  const uiStandIn = (
    <div
      style={{
        width: "500px",
        height: "800px",
        minWidth: "500px",
        borderStyle: "solid",
        borderThickness: "thin",
        borderRadius: "10px"
      }}
    ></div>
  );
  const testPlayerScale = (
    <img
      style={{
        marginLeft: "180px",
        marginTop: "193px",
        width: "50px",
        height: "75px",
        position: "absolute",
        zIndex: 1
        // opacity: 0.5
      }}
      src="test1.png"
    />
  );
  const [playerData, setPlayerData] = useState([]);
  const [winner, setWinner] = useState(null);
  const [intervalTime, setIntervalTime] = useState(200);
  const [graveyardData, setGraveyardData] = useState([]);
  const [graveyardTileKeys, setGraveyardTileKeys] = useState([]);
  const [powerUpData, setPowerUpData] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [elementPickUps, setElementPickUps] = useState([
    // "ice",
    "glass"
    // "fire",
    // "wood",
    // "lightning",
    // "death",
    // "bubble",
    // "metal"
  ]);
  const scale = 0.3;
  const accTime = useRef(0);
  const incrementPlayerLives = index => {
    setPlayerData(_players =>
      _players.map((p, i) => (i === index ? { ...p, lives: p.lives - 1 } : p))
    );
  };
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
    // PLAYERS - - - - - - - - - - - -
    // GRAVEYARDS - - - - - - - - - - - -
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
    // GRAVEYARDS - - - - - - - - - - - -
  }, []);
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      // getCharXAndY(playerMoveToTiles);
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
    movePiece(
      playerData,
      setPlayerData,
      powerUpData,
      setPowerUpData,
      setTileStatuses,
      graveyardTileKeys,
      scale
    );
    // respawnPlayers(
    //   setPlayerData,
    //   graveyardData,
    //   setGraveyardData,
    //   setWinner,
    //   scale
    // );
    movePiece(
      kaijuData,
      setKaijuData,
      undefined,
      undefined,
      setTileStatuses,
      graveyardTileKeys,
      scale
    );
    // movePiece(kaiju2Data, setKaiju2Data, scale);
    // checkIsInManaPool({ setPlayerData, kaiju1Data, kaiju2Data });
  }, intervalTime);
  // powerup spawning.
  useInterval(() => {
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
      const randInt2 = getRandomIntInRange({ max: elementPickUps.length - 1 });
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
  }, 5000);
  // useInterval(() => {
  //   const minX = 0;
  //   const minY = 30;
  //   const maxX = 490;
  //   const maxY = 800;
  //   const randIntX = getRandomIntInRange({ min: minX, max: maxX });
  //   const randIntY = getRandomIntInRange({ min: minY, max: maxY });
  //   const randBool1 = Math.random() > 0.5;
  //   const randBool2 = Math.random() > 0.5;
  //   const randPlayerIndex = getRandomIntInRange({ max: playerData.length - 1 });
  //   const location = randBool1
  //     ? { x: randIntX, y: randBool2 ? minY : maxY }
  //     : { x: randBool2 ? minX : maxX, y: randIntY };
  //   const kaijuTile = getClosestPerimeterTileFromLocation({
  //     ...location,
  //     scale
  //   });
  //   const normVec = getNormVecFromTiles(
  //     kaijuTile,
  //     playerData[randPlayerIndex].tile,
  //     scale
  //   );
  //   const [_, dirs] = getAdjacentTilesFromNormVec(kaijuTile, normVec, scale, 1);
  //   const key = Math.random();
  //   setKaijuData(_kaiju => [
  //     ..._kaiju,
  //     {
  //       key,
  //       charLocation: location,
  //       moveFromLocation: location,
  //       moveToLocation: location,
  //       moveToTiles: [kaijuTile],
  //       tile: kaijuTile,
  //       color: "purple",
  //       isThere: false,
  //       moveSpeed: 14,
  //       abilities: [
  //         () =>
  //           PLAYER_ABILITIES["kaiju"](
  //             key,
  //             dirs,
  //             _kaiju.length,
  //             setKaijuData,
  //             setTileStatuses,
  //             scale
  //           )
  //       ],
  //       isKaiju: true
  //     }
  //   ]);
  // }, 2000);
  // <GameTitle>Kaiju City</GameTitle>
  return (
    <>
      <div className="App">
        <GameBoard
          incrementPlayerLives={incrementPlayerLives}
          tileStatuses={tileStatuses}
          setTileStatuses={setTileStatuses}
          setPlayerMoveToTiles={setPlayerMoveToTiles}
          playerData={playerData}
          kaijuData={kaijuData}
          graveyardTileKeys={graveyardTileKeys}
          powerUpData={powerUpData}
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
