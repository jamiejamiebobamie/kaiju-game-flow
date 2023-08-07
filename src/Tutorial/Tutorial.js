import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { StyledIcon } from "./Components/StyledComponents";
import { PLAYER_ABILITIES } from "Utils/gameState";
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
} from "Utils/utils";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import { GameMap } from "Components/GameMap.js";
import {
  Wrapper,
  TitleWrapper,
  Title,
  ButtonsWrapper,
  Button,
  ButtonGroup,
  ButtonOutline,
  BackgroundImage
} from "./Components/StyledComponents";

const TutorialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: red;
  height: 100vh;
  align-content: center;
  align-items: center;
  perspective: 500px;
`;
const TutorialWindow = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-self: center;
  align-content: center;
  text-align: center;
  align-items: center;
  font-size: 25px;
  width: 300px;
  height: 200px;
  -webkit-animation-duration: 28s;
  animation-duration: 28s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  background-color: #152642;
  border-color: #db974f;
  box-shadow: 3px 7px 10px black;
  ${props => `animation-delay: ${props.aD}s;`};
  @keyframes goAround {
    0% {
      transform: scale(1.3, 1) translate(0vw, -10vh) rotateY(0deg) rotate(0deg);
      z-index: 3;
    }
    25% {
      transform: scale(0.5) translate(75vw, -40vh) rotateX(-20deg)
        rotateY(30deg) rotate(-45deg);
      z-index: 2;
    }
    50% {
      transform: scale(0.3) translate(0vw, -80vh) rotateY(180deg) rotate(0deg);
      z-index: 0;
    }
    75% {
      transform: scale(0.5) translate(-75vw, -40vh) rotateY(330deg)
        rotateX(20deg) rotate(45deg);
      z-index: 2;
    }
    100% {
      transform: scale(1.3, 1) translate(0vw, -10vh) rotateY(360deg)
        rotate(0deg);
      z-index: 3;
    }
  }
  ${props => props.tutorialWindowTitle && "animation-play-state: paused;"}
  animation-name: goAround;
  &:hover {
    transform: scale(1) translate(0) rotateX(0deg) rotateY(0deg);
    z-index: 5;
    width: 900px;
    height: 900px;
  }
  /* max-width: 800px;
  height: 300px;
  overflow-y: hidden;
  transition: height 4s linear; */
  transition: 4s;
  animation-name: goAround;
`;
const TutorialWindowTitle = styled.div`
  position: absolute;
  z-index: 5;

  @keyframes titleFadeOut {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  @keyframes titleFadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  color: #db974f;
  pointer-events: none;
  animation-duration: 1s;
  animation-timing-function: linear;
  ${props =>
    props.isHovered
      ? `opacity:0; animation-name: titleFadeOut;`
      : `opacity:1; animation-name: titleFadeIn;`}
`;
export const Tutorial = ({ handleClickHome, triggerTransition }) => {
  const tutorialSubjects = [
    "How to Move?",
    "Kaiju City?",
    "Kaiju?",
    "You and Kaiju?",
    "Teammate?",
    "Tile Statuses?",
    "Abilities?"
  ];
  const maxTutorialViewIndex = 5;
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const [tutorialViewIndex, setTutorialViewIndex] = useState(0);
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
  const [setTutorialWindowTitle, tutorialWindowTitle] = useHover();
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(1);
  const [title, setTitle] = useState([]);
  const [nextButtonContent, setNextButtonContent] = useState("");
  const [backButtonContent, setBackButtonContent] = useState("");
  const [backButtonCallback, setBackButtonCallback] = useState(() => {});
  const shouldUpdate = (accTime, interval) => !(accTime % interval);
  const incrementTutorialViewIndex = () =>
    triggerTransition(() =>
      setTutorialViewIndex(_i =>
        _i + 1 <= maxTutorialViewIndex ? _i + 1 : handleClickHome()
      )
    );
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
        setBackButtonCallback(() => () =>
          triggerTransition(() => handleClickHome())
        );
        break;
      case 1:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        // display map gif.
        setBackButtonContent("Back");
        setNextButtonContent("Yay!");
        setTitle(["This is Kaiju City"]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 2:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [{ i: 11, j: 4 }];
        kaijuMoveSpeed = 0;
        setBackButtonContent("Back");
        setNextButtonContent("Ok...");
        setTitle(["This is a Kaiju"]);
        setShouldKaijuMove(false);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 3:
        playerSpawnPositions = [{ i: 11, j: 6 }];
        kaijuSpawnPositions = [
          { i: 19, j: 3 },
          { i: 3, j: 3 },
          { i: 11, j: 1 }
        ];
        setBackButtonContent("Back");
        setNextButtonContent("Oh no!");
        setTitle([`This is you and Kaiju`]);
        setShouldKaijuMove(true);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
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
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 5:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
        setBackButtonContent("Back");
        setNextButtonContent("Home");
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
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
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
        setPlayerData,
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
  const borderStyles = `
    position:relative;
    width:245px;
    height:395px;
    background-repeat: no-repeat;
    margin-bottom: 30px;
    border-radius: 5px;
    border-style: solid;
    border-thickness: thick;
    border-color: #db974f;
    box-shadow: 3px 7px 10px black;
    overflow:hidden;
    `;
  const mapStyles = `transform:scale(.5) translate(-125px);`;
  const shiftContentOver = tutorialViewIndex === 6;
  return (
    <Wrapper>
      {tutorialViewIndex !== 0 && tutorialViewIndex !== 5 && (
        <div
          style={{
            display: "flex",
            width: "400px",
            // backgroundColor: "red",
            alignSelf: "flex-start",
            marginTop: "-75px",
            marginLeft: "-100px",
            transform: "scale(.8)"
          }}
        >
          <ButtonGroup>
            <ButtonsWrapper>
              <Button
                onClick={() => triggerTransition(() => handleClickHome())}
              >
                <ButtonOutline zIndex={1} />
                Home
              </Button>
            </ButtonsWrapper>
          </ButtonGroup>
        </div>
      )}
      <TitleWrapper>
        <Title>{title[0]}</Title>
      </TitleWrapper>
      {tutorialViewIndex === 1 ? (
        <GameMap
          isTutorial={true}
          borderStyles={borderStyles}
          mapStyles={mapStyles}
        />
      ) : (
        <TutorialGameBoard
          shiftContentOver={shiftContentOver}
          isPaused={false}
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
      )}
      {!!title[1] && (
        <TitleWrapper>
          <Title>{title[1]}</Title>
        </TitleWrapper>
      )}
      <ButtonGroup isPaddingBottom={tutorialViewIndex === 1}>
        <ButtonsWrapper>
          <Button onClick={backButtonCallback}>
            <ButtonOutline zIndex={1} />
            {backButtonContent}
          </Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button onClick={() => incrementTutorialViewIndex()}>
            <ButtonOutline zIndex={1} />
            {nextButtonContent}
          </Button>
        </ButtonsWrapper>
      </ButtonGroup>
    </Wrapper>
  );
};
