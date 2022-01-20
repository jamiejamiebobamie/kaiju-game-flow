import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { ClassPicker } from "./ClassPicker/ClassPicker";
import { TutorialExplain } from "./ClassPicker/TutorialExplain";
import { StyledIcon } from "./ClassPicker/Components/StyledComponents";
import { PLAYER_CLASSES, PLAYER_ABILITIES } from "../Utils/gameState";
import {
  useInterval,
  useHover,
  movePiece,
  movePieceTutorial,
  updateTileState,
  redrawTiles,
  updateHighlightedTiles,
  initializeTutorialGameBoard
} from "../Utils/utils";

export const Tutorial = ({
  pickedAbilities,
  setPickedAbilities,
  handeClickPlay,
  handeClickHome,
  maxTutorialViewIndex,
  tutorialViewIndex,
  setTutorialViewIndex
}) => {
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [playerData, setPlayerData] = useState([]);
  const [teleportData, setTeleportData] = useState([]);
  const [dmgArray, setDmgArray] = useState([]);
  const [kaijuData, setKaijuData] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles0, setHighlightedTiles0] = useState([]);
  const [highlightedTiles1, setHighlightedTiles1] = useState([]);
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
  const [animName, setAnimName] = useState("fadeInRight");
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  const incrementTutorialViewIndex = () => {
    // if (!animName) {
    setAnimName("fadeInRight");
    setTimeout(() => setAnimName(null), 3000);
    setTutorialViewIndex(_i => (_i + 1 <= maxTutorialViewIndex ? _i + 1 : 0));
    // }
  };
  const decrementTutorialViewIndex = () => {
    // if (!animName) {
    setAnimName("fadeInLeft");
    setTimeout(() => setAnimName(null), 3000);
    setTutorialViewIndex(_i => (_i - 1 >= 0 ? _i - 1 : 0));
    // }
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
        setTitle(["This is you.", "Click on a tile to walk to it."]);
        setBackButtonCallback(() => () => handeClickHome()); // Toggle home screen
        break;
      case 1:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        // display map gif.
        setBackButtonContent("Back");
        setNextButtonContent("Yay!");
        setTitle(["This is Kaiju City."]);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 2:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [{ i: 11, j: 4 }];
        kaijuMoveSpeed = 0;
        setBackButtonContent("Back");
        setNextButtonContent("Ok...");
        setTitle(["This is a Kaiju."]);
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
        // kaijuMoveSpeed = 0;
        setBackButtonContent("Back");
        setNextButtonContent("Oh no!");
        setTitle([`This is you and Kaiju.`]);
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
        setTitle([`This is your teammate.`]);
        setBackButtonCallback(() => decrementTutorialViewIndex);
        break;
      case 5:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
        console.log(abilities);
        setBackButtonContent("Back");
        setNextButtonContent("Next");
        setTitle([
          "You cast magic to attack, defend and more.",
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
        kaijuMoveSpeed = 0;
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
      setPlayerData(_playerData =>
        _playerData.map((p, i) =>
          i === 0 ? { ...p, moveToTiles: playerMoveToTiles } : p
        )
      );
      setPlayerMoveToTiles(null);
    }
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
      0,
      isTutorial
    );
    if (shouldUpdate(accTime.current, 2))
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
    );
    // move players
    movePiece(
      playerData,
      setPlayerData,
      [],
      () => {},
      tileStatuses,
      setTileStatuses,
      scale,
      accTime.current,
      kaijuData,
      dmgArray,
      teleportData,
      setTeleportData,
      () => {},
      isTutorial
    );
    // move monsters
    tutorialViewIndex !== 3 &&
      tutorialViewIndex !== 2 &&
      movePiece(
        kaijuData,
        setKaijuData,
        undefined,
        () => {},
        tileStatuses,
        setTileStatuses,
        scale,
        accTime.current,
        playerData,
        dmgArray,
        undefined,
        undefined,
        () => {},
        isTutorial
      );
    // update accumulated time.
    accTime.current =
      accTime > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  });
  // , intervalTime);
  return tutorialViewIndex === maxTutorialViewIndex ? (
    <ClassPicker
      animName={animName}
      incrementTutorialViewIndex={incrementTutorialViewIndex}
      decrementTutorialViewIndex={decrementTutorialViewIndex}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handeClickPlay={handeClickPlay}
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
      animName={animName}
      showCity={tutorialViewIndex === 1}
      shiftContentOver={tutorialViewIndex === 6}
      incrementTutorialViewIndex={incrementTutorialViewIndex}
      decrementTutorialViewIndex={decrementTutorialViewIndex}
      nextButtonContent={nextButtonContent}
      backButtonContent={backButtonContent}
      backButtonCallback={backButtonCallback}
      title={title[0]}
      title2={title.slice(1)}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handeClickPlay={handeClickPlay}
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
