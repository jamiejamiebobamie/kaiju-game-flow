import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HexagonTile } from "./Tile/HexagonTile";
import { Graveyard } from "./Graveyard";
import { Player } from "./Player";
import { ManaPoolOverlay } from "./ManaPoolOverlay";
import {
  STARTING_KAIJU_CHOICES,
  ACCESSORIES,
  PENINSULA_TILE_LOOKUP
} from "../Utils/gameState";
import {
  getCharXAndY,
  getManaWellXAndY,
  getRandomIntInRange,
  aStar,
  isAdjacent,
  getIndicesFromFlattenedArrayIndex,
  getFlattenedArrayIndex,
  getRandomCharacterLocation,
  useInterval,
  moveTo,
  getRandomAdjacentLocation
} from "../Utils/utils";

const Board = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  margin-left: 100px;
  margin-top: 100px;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const BackgroundImage = styled.img`
  z-index: -2;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
`;
export const GameBoard = () => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [includedHexes, setIncludedHexes] = useState([]);
  const [path, setPath] = useState({
    to: null,
    from: null
  });
  const [endGamePoint, setEndGamePoint] = useState(null);
  const [tiles, setTiles] = useState([]);
  const [graveyards, setGraveyards] = useState([]);
  // const [players, setPlayers] = useState([]);
  const [manaPools, setManaPools] = useState();
  const [testRandom, setTestRandom] = useState([]);
  const [startingPlayerStats, setStartingPlayerStats] = useState([]);
  const [manaPoolLocations, setManaPoolLocations] = useState([]);

  // FOR TESTING:
  // var width =
  //   window.innerWidth ||
  //   document.documentElement.clientWidth ||
  //   document.body.clientWidth;
  // var height =
  //   window.innerHeight ||
  //   document.documentElement.clientHeight ||
  //   document.body.clientHeight;
  const redrawTiles = highlightedTiles => {
    const rowLength = Math.ceil(width / (70 * scale));
    const colLength = Math.ceil(height / (75 * scale));
    const _tiles = [];
    for (let i = 0; i < rowLength; i++) {
      for (let j = 0; j < colLength; j++) {
        const key = `${i} ${j}`;
        if (PENINSULA_TILE_LOOKUP[key])
          _tiles.push(
            <HexagonTile
              key={key}
              rowLength={rowLength}
              i={i}
              j={j}
              scale={scale}
              setClickedIndex={setClickedTile}
              isHighlighted={highlightedTiles.some(
                ({ h_i, h_j }) => h_i === i && h_j === j
              )}
            />
          );
      }
    }
    setTiles(_tiles);
  };
  useEffect(() => {
    const highlightedTiles = [];
    redrawTiles(highlightedTiles);
    // const _graveyards = [];
    // for (let i = 0; i < 30; i++) {
    //   const x = Math.random() * width;
    //   const y = Math.random() * height;
    //   _graveyards.push(<Graveyard key={`${x} ${y}`} x={x} y={y} />);
    // }
    // setGraveyards(_graveyards);
    const _players = [];
    // const colors = [];
    for (let k = 0; k < 3; k++) {
      const tileIndices = Object.values(PENINSULA_TILE_LOOKUP);
      const color = `rgb(${Math.random() * 255},${Math.random() *
        255},${Math.random() * 255})`;
      // colors.push(color);
      // const stats = {
      //   dmg: 5,
      //   lives: 0,
      //   moveSpeed: 3
      // };
      const number = k + 1;
      const randomInt = getRandomIntInRange({ max: tileIndices.length });
      const { i, j } = tileIndices[randomInt];
      const location = getCharXAndY({ i, j, scale });

      // const moveToLocation = getRandomAdjacentLocation(
      //   { x: location.x, y: location.y },
      //   scale
      // );
      // const moveFromLocation = location;
      // const isThere = false;
      // const randInt1 = getRandomIntInRange({
      //   max: STARTING_KAIJU_CHOICES.length - 1
      // });
      // const startingKaiju = STARTING_KAIJU_CHOICES[randInt1];
      // const kaiju = [startingKaiju];
      // const accessoryKeys = Object.keys(ACCESSORIES);
      // const randInt2 = getRandomIntInRange({
      //   max: accessoryKeys.length - 1
      // });
      // const randKey = accessoryKeys[randInt2];
      // const randAccessory = ACCESSORIES[randKey];
      // const { Compass } = ACCESSORIES;
      // const accessory = [Compass, randAccessory];
      // randAccessory &&
      //   randAccessory.onStart &&
      //   randAccessory.onStart({ kaiju: [startingKaiju], setStats, setKaiju });
      // const _player = {
      //   color,
      //   location,
      //   moveToLocation,
      //   moveFromLocation,
      //   isThere,
      //   kaiju,
      //   accessory,
      //   number
      // };
      //   _players.push(
      //     <Player
      //       key={number}
      //       startingX={location.x}
      //       startingY={location.y}
      //       color={color}
      //       scale={scale}
      //       number={number}
      //       getManaPools={getManaPools}
      //     />
      //   );

      //   _players.push(
      //     <Player
      //       key={number}
      //       startingX={location.x}
      //       startingY={location.y}
      //       color={color}
      //       scale={scale}
      //       number={number}
      //       getManaPools={getManaPools}
      //     />
      //   );
      _players.push({
        color,
        location
      });
    }
    // setPlayers(_players);
    setStartingPlayerStats(_players);

    // const manaWells = [];
    // for (let i = 0; i < 6; i++) {
    //   const { x, y } = getRandomCharacterLocation(scale);
    //   manaWells.push({ x, y });
    // }
    // setManaPools([
    //   { manaWells: manaWells.slice(0, 3), color: colors[0] },
    //   { manaWells: manaWells.slice(3, 6), color: colors[1] }
    // ]);
    const { x, y } = getRandomCharacterLocation(scale);
    setEndGamePoint(
      <Graveyard key={`${x} ${y}`} isEndgame={true} x={x} y={y} />
    );
  }, []);
  useEffect(() => {
    const { i, j } = clickedTile;
    if (i !== -1) {
      // console.log(clickedTile);
      // let _includedHexes;
      // if (includedHexes[`${i} ${j}`]) {
      //   _includedHexes = { ...includedHexes };
      //   delete _includedHexes[`${i} ${j}`];
      //   setIncludedHexes(_includedHexes);
      // } else {
      //   _includedHexes = { ...includedHexes, [`${i} ${j}`]: clickedTile };
      //   setIncludedHexes(_includedHexes);
      // }

      // console.log(highlightedTiles);

      const newXAndY = getManaWellXAndY({ i, j, scale });

      setManaPoolLocations(_manaPoolLocations => [
        ..._manaPoolLocations,
        getCharXAndY({ i, j, scale })
      ]);

      const _test = [...testRandom, newXAndY];
      setTestRandom(_test);
      setManaPools(
        <ManaPoolOverlay testRandom={_test} manaPools={manaPools} />
      );
      const _includedHexes = [...includedHexes, { i, j }];
      setIncludedHexes(_includedHexes);
      const highlightedTiles = Object.entries(_includedHexes).map(([k, v]) => {
        return { h_i: v.i, h_j: v.j };
      });
      redrawTiles(highlightedTiles);
      // FOR TESTING A*:
      // const { to, from } = path;
      // if (to && from) console.log(isAdjacent(to, from));

      // const _path =
      //   (to && from) || !from
      //     ? { from: clickedTile, to: null }
      //     : { from, to: clickedTile };
      // setPath(_path);
      // const highlightedTiles = Object.entries(_path)
      //   .filter(([k, v]) => v !== null)
      //   .map(([k, v]) => {
      //     return { h_i: v.i, h_j: v.j };
      //   });

      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  // useEffect(() => {
  //   const { to, from } = path;
  //   if (to && from) {
  //     console.log(isAdjacent(to, from));
  //     // const AStarPath = aStar(to, from);
  //     // console.log(AStarPath);
  //     // const highlightedTiles = Object.values(PENINSULA_TILE_LOOKUP)
  //     //   .map(v =>
  //     //     AStarPath.includes(`${v.i} ${v.j}`) ? { h_i: v.i, h_j: v.j } : null
  //     //   )
  //     //   .filter(v => v !== null);
  //     // const highlightedTiles =
  //     //   to && from
  //     //     ? Object.values(PENINSULA_TILE_LOOKUP)
  //     //         .map(v => {
  //     //           isAdjacent(to, { i: v.i, j: v.j }) && console.log(v);
  //     //           // isAdjacent(from, { i: v.i, j: v.j }) ||
  //     //           return isAdjacent(to, { i: v.i, j: v.j })
  //     //             ? { h_i: v.i, h_j: v.j }
  //     //             : null;
  //     //         })
  //     //         .filter(v => v !== null)
  //     //     : [];
  //     // redrawTiles(highlightedTiles);
  //   }
  // }, [path]);
  // useInterval(() => {
  //   setManaPools(
  //     <ManaPoolOverlay
  //       testRandom={[
  //         getRandomCharacterLocation(scale),
  //         getRandomCharacterLocation(scale),
  //         getRandomCharacterLocation(scale),
  //         `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() *
  //           255})`
  //       ]}
  //       manaPools={manaPools}
  //     />
  //   );
  // }, 3000);
  // useInterval(() => {
  //   players.forEach((player, i) => {
  //     if (
  //       player.location &&
  //       player.moveFromLocation &&
  //       player.moveToLocation &&
  //       !player.isThere
  //     )
  //       moveTo({
  //         currentLocation: player.location,
  //         moveFromLocation: player.moveFromLocation,
  //         moveToLocation: player.moveToLocation,
  //         moveSpeed:
  //           player.stats && player.stats.moveSpeed ? player.stats.moveSpeed : 0,
  //         setLocation: location => {
  //           setPlayers(_players => {
  //             const ps = [..._players];
  //             console.log(location);
  //             ps[i].location = location;
  //             return ps;
  //           });
  //         },
  //         setHasArrived: isThere => {
  //           setPlayers(_players => {
  //             const ps = [..._players];
  //             ps[i].isThere = isThere;
  //             return ps;
  //           });
  //         }
  //       });
  //   });
  // }, 2000);
  // const playerComponents = players.map(player => (
  //   <Player
  //     key={player.number}
  //     location={player.location}
  //     color={player.color}
  //     number={player.number}
  //   />
  // ));
  // useInterval(() => {}, 5000);

  const players = startingPlayerStats.map((p, i) => (
    <Player
      key={i}
      number={i + 1}
      startingX={p.location.x}
      startingY={p.location.y}
      color={p.color}
      scale={scale}
      manaPools={manaPoolLocations}
    />
  ));

  return (
    <Board width={width} height={height}>
      <ShiftContentOver scale={scale}>{tiles}</ShiftContentOver>
      <BackgroundImage src={"test_map.png"} />
    </Board>
  );

  // return (
  //   <Board width={width} height={height}>
  //     {manaPools}
  //     <ShiftContentOver scale={scale}>
  //       {endGamePoint}
  //       {tiles}
  //       {graveyards}
  //       {players}
  //     </ShiftContentOver>
  //     <BackgroundImage src={"test_map.png"} />
  //   </Board>
  // );
};

/*
{manaPools}
<ShiftContentOver scale={scale}>
  {endGamePoint}
  {tiles}

  players:
  [
  {
    charLocation: {x,y},
    accessoryAndFamiliars:[{}],
    color:"",
    i:0,
    tileIndices: {i,j} // so that I don't spawn someone on a manaWell or graveyard
  }
  ]

  kaijuAndManaWells:
  [
   {
      charLocation: {x,y},
      tileIndices: {i,j},
      canvasLocation: {x,y},
      isKaiju: true, // dictates if it moves,
      owner: 0 // undefined or index into players array
   }
  ]

  graveyards:
  [
   {
      charLocation: {x,y},
      tileIndices: {i,j},
      isUnused: false
   }
  ]


*/
