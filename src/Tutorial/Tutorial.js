import React, { useRef, useState, useEffect } from "react";
import { ClassPicker } from "./Views/ClassPicker";
import { TutorialExplain } from "./Views/TutorialExplain";
import { StyledIcon } from "./Views/Components/StyledComponents";
import { PLAYER_ABILITIES } from "../Utils/gameState";
import {
  useInterval,
  useHover,
  movePlayerPieces,
  moveKaijuPieces,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeTutorialGameBoard,
  areTilesAdjacent,
  getAdjacentTilesTutorial
} from "../Utils/utils";

export const Tutorial = ({
  pickedAbilities,
  setPickedAbilities,
  handleClickPlay,
  handleClickHome,
  maxTutorialViewIndex,
  tutorialViewIndex,
  setTutorialViewIndex
}) => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [playerData, setPlayerData] = useState([]);
  const [shouldKaijuMove, setShouldKaijuMove] = useState(true);
  const [teleportData, setTeleportData] = useState([]);
  const [dmgArray, setDmgArray] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles0, setHighlightedTiles0] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(1);
  const [title, setTitle] = useState([]);
  const [nextButtonContent, setNextButtonContent] = useState("");
  const [backButtonContent, setBackButtonContent] = useState("");
  const [backButtonCallback, setBackButtonCallback] = useState(() => {});
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  const incrementTutorialViewIndex = () => {
    setTutorialViewIndex(_i => (_i + 1 <= maxTutorialViewIndex ? _i + 1 : 0));
  };
  const decrementTutorialViewIndex = () => {
    setTutorialViewIndex(_i => (_i - 1 >= 0 ? _i - 1 : 0));
  };
  useEffect(() => {
    let playerSpawnPositions = [];
    let kaijuSpawnPositions = [];
    let abilities = [];
    let kaijuMoveSpeed = undefined;
    switch (tutorialViewIndex) {
      case 0:
        playerSpawnPositions = [{ i: 11, j: 5 }];
        kaijuSpawnPositions = [];
        setBackButtonContent("Home");
        setNextButtonContent("Got it!");
        setTitle(["This is you", "Click on a tile to walk to it"]);
        setBackButtonCallback(() => () => handleClickHome()); // Toggle home screen
        break;
      case 1:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        // display map gif.
        setBackButtonContent("Back");
        setNextButtonContent("Yay!");
        setTitle(["This is Kaiju City"]);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 2:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [{ i: 11, j: 4 }];
        kaijuMoveSpeed = 0;
        setBackButtonContent("Back");
        setNextButtonContent("Ok...");
        setTitle(["This is a Kaiju"]);
        setShouldKaijuMove(false);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 3:
        playerSpawnPositions = [{ i: 11, j: 6 }];
        // fix this... freezes witj Kaiju data.
        kaijuSpawnPositions = [
          { i: 19, j: 3 },
          { i: 3, j: 3 },
          { i: 11, j: 1 }
        ];
        setBackButtonContent("Back");
        setNextButtonContent("Oh no!");
        setTitle([`This is you and Kaiju`]);
        setShouldKaijuMove(true);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 4:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [];
        setBackButtonContent("Back");
        setNextButtonContent("Ok!");
        setTitle([`This is your teammate`]);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 5:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
        setBackButtonContent("Back");
        setNextButtonContent("Next");
        setTitle([
          "You cast magic to attack and defend",
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignSelf: "center"
            }}
          >
            <p>Right tile statuses replace left:</p>
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
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case maxTutorialViewIndex:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        break;
    }
    initializeTutorialGameBoard(
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
    );
  }, [tutorialViewIndex]);
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
  useInterval(() => {
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
    if (shouldUpdate(accTime.current, 3))
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
    redrawTiles(
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
    );
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
        () => {},
        teleportData,
        setTeleportData,
        true,
        null
      );
    // move monsters
    kaijuData.length &&
      shouldKaijuMove &&
      moveKaijuPieces(
        kaijuData,
        setKaijuData,
        tileStatuses,
        setTileStatuses,
        scale,
        accTime.current,
        playerData,
        dmgArray,
        () => {},
        true,
        null
      );
    // update accumulated time.
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  });
  return tutorialViewIndex === maxTutorialViewIndex ? (
    <ClassPicker
      incrementTutorialViewIndex={incrementTutorialViewIndex}
      decrementTutorialViewIndex={decrementTutorialViewIndex}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handleClickPlay={handleClickPlay}
      isPaused={false}
      powerUpData={[]}
      playerData={playerData}
      setPlayerData={setPlayerData}
      setTeleportData={setTeleportData}
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
      numAbilitiesToPick={3}
    />
  ) : (
    <TutorialExplain
      showCity={tutorialViewIndex === 1}
      shiftContentOver={tutorialViewIndex === 6}
      incrementTutorialViewIndex={incrementTutorialViewIndex}
      decrementTutorialViewIndex={decrementTutorialViewIndex}
      nextButtonContent={nextButtonContent}
      backButtonContent={backButtonContent}
      backButtonCallback={backButtonCallback}
      title={title[0]}
      title2={title.length > 1 && title.slice(1)}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      isPaused={false}
      powerUpData={[]}
      playerData={playerData}
      setPlayerData={setPlayerData}
      setTeleportData={setTeleportData}
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
  );
};
