import React, { useState, useEffect } from "react";
import { GameBoard } from "./GameBoard/GameBoard";
import { UI } from "./UI/UI";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP,
  BRIDGE_TILES
} from "./Utils/gameState";
import {
  getRandAdjacentTile,
  getCharXAndY,
  getTileXAndY,
  getRandomIntInRange,
  useInterval,
  movePiece,
  isLocatonInsidePolygon,
  checkIsInManaPool
} from "./Utils/utils";
import "./App.css";

const App = () => {
  /*
        1. tileStatus updates.
        2. randomized starting setup for each player.
        3. kaiju pickups.
        4. enemy a.i.
        5. object placement, breadth first search
                final battleground vertex / "end game point"
                    graveyard placement
                do not place mana wells adjacent to one another
        6. home screen.
        7. make character move to the last tile on a path.
        8. do a circular of icons around profile pic for activated passives

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
  const [graveyardData, setGraveyardData] = useState([]);
  const [kaiju1Data, setKaiju1Data] = useState([]);
  const [kaiju2Data, setKaiju2Data] = useState([]);
  const [kaijuTokenTiles, setKaijuTokenTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const scale = 0.3;
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
        abilities: [
          {
            displayLookup: "abilityGlass",
            element: "glass",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityFire",
            element: "fire",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityWood",
            element: "wood",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityLightning",
            element: "lightning",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityDeath",
            element: "death",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityBubble",
            element: "bubble",
            isPassive: false,
            isActive: false
          },
          {
            displayLookup: "abilityMetal",
            element: "metal",
            isPassive: false,
            isActive: false
          }
        ],
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
    for (let k = 0; k < 15; k++) {
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
      // console.log(charLocation, randTile, randomInt);
      _graveyards.push({
        charLocation,
        tile: { i, j },
        isUsed: false
      });
    }
    setGraveyardData(_graveyards);
    // GRAVEYARDS - - - - - - - - - - - -
    // KAIJU - - - - - - - - - - - -
    const _kaiju = [];
    const _canvasLocations = [];
    for (let k = 0; k < 7; k++) {
      _max -= k;
      const randomInt = getRandomIntInRange({
        max: _max
      });
      const { i, j } = tileIndices[randomInt];
      const storeItem = tileIndices.length - k;
      const location = getCharXAndY({ i, j, scale });
      tileIndices[tileIndices.length - k] = tileIndices[randomInt];
      tileIndices[randomInt] = storeItem;
      _kaiju.push({
        charLocation: location,
        moveFromLocation: location,
        moveToLocation: location,
        moveToTiles: [],
        key: `${i} ${j}`,
        tile: { i, j },
        isThere: true,
        element: undefined,
        owner: k < 4 ? _players[0] : _players[1],
        color: k < 4 ? _players[0].color : _players[1].color,
        moveSpeed: 14
      });
    }
    setKaiju1Data(_kaiju.filter(k => k.owner === _players[0]));
    setKaijuTokenTiles(
      _kaiju
        .filter(k => k.owner === _players[0])
        .map(({ tile, key }) => {
          return {
            key,
            tile
          };
        })
    );
    setKaiju2Data(_kaiju.filter(k => k.owner === _players[1]));
    // KAIJU - - - - - - - - - - - -
  }, []);
  useEffect(() => {
    if (kaijuTokenTiles && kaijuTokenTiles.length)
      setKaiju1Data(_kaiju1Data =>
        _kaiju1Data.map(data => {
          return {
            ...data,
            isThere: false,
            moveToLocation: getCharXAndY({
              i: kaijuTokenTiles.find(t => t.key === data.key)
                ? kaijuTokenTiles.find(t => t.key === data.key).tile.i
                : 0,
              j: kaijuTokenTiles.find(t => t.key === data.key)
                ? kaijuTokenTiles.find(t => t.key === data.key).tile.j
                : 0,
              scale
            })
          };
        })
      );
  }, [kaijuTokenTiles]);
  useEffect(() => {
    if (playerMoveToTiles !== null) {
      getCharXAndY(playerMoveToTiles);
      setPlayerData(_playerData =>
        _playerData.map((p, i) =>
          i === 0 ? { ...p, moveToTiles: playerMoveToTiles } : p
        )
      );
      setPlayerMoveToTiles(null);
    }
  }, [playerMoveToTiles]);
  useInterval(() => {
    movePiece(playerData, setPlayerData, scale);
    movePiece(kaiju1Data, setKaiju1Data, scale);
    movePiece(kaiju2Data, setKaiju2Data, scale);
    checkIsInManaPool({ setPlayerData, kaiju1Data, kaiju2Data });
  }, 250);
  return (
    <div className="App">
      <GameBoard
        setPlayerMoveToTiles={setPlayerMoveToTiles}
        playerData={playerData}
        graveyardData={graveyardData}
        kaiju1Data={kaiju1Data}
        kaijuTokenTiles={kaijuTokenTiles}
        setKaijuTokenTiles={setKaijuTokenTiles}
        kaiju2Data={kaiju2Data}
        scale={scale}
      />
      <UI playerData={playerData} />
    </div>
  );
};
// {testPlayerScale}
// {gameBoardStandIn}
// {uiStandIn}

export default App;
