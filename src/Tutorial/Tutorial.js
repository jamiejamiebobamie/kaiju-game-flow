import React, { useRef, useState, useEffect } from "react";
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
} from "./Components/StyledComponents";

export const Tutorial = ({ handleClickHome, triggerTransition }) => {
  const TURN_DELAY = 100;
  const maxTutorialViewIndex = 7;
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
  const [deadKaijuLocations, setDeadKaijuLocations] = useState([]);
  const [clickedTile, setClickedTile] = useState({ i: -1, j: -1 });
  const [highlightedTiles0, setHighlightedTiles0] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [playerMoveToTiles, setPlayerMoveToTiles] = useState(null);
  const [tileStatuses, setTileStatuses] = useState(null);
  const [setHoverRef, hoverLookupString] = useHover();
  const [path, setPath] = useState(null);
  const [intervalTime, setIntervalTime] = useState(TURN_DELAY);
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
        setTitle(["This is you.", "Click on a tile to walk to it"]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => handleClickHome())
        );
        break;
      case 1:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        setBackButtonContent("Back");
        setNextButtonContent("Ok");
        // display Kaiju_Warrior png.
        setTitle(["You are a Kaiju Warrior, the best of the best."]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => handleClickHome())
        );
        break;        
      case 2:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        // display map gif.
        setBackButtonContent("Back");
        setNextButtonContent("Ok");
        setTitle(["This is Kaiju City, the city you love, your home."]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 3:
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
      case 4:
        playerSpawnPositions = [{ i: 11, j: 6 }];
        kaijuSpawnPositions = [
          { i: 19, j: 3 },
          { i: 3, j: 3 },
          { i: 11, j: 1 }
        ];
        setBackButtonContent("Back");
        setNextButtonContent("Ahh!");
        setTitle([`Every night, the Kaiju come out of the sea to feast on their favorite meal: people, well-done!`]);
        setShouldKaijuMove(true);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 5:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [];
        setBackButtonContent("Back");
        setNextButtonContent("Ok!");
        setTitle([`This is your teammate, another Kaiju warrior.`]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => decrementTutorialViewIndex())
        );
        break;
      case 6:
        playerSpawnPositions = [
          { i: 11, j: 7 },
          { i: 3, j: 3 }
        ];
        kaijuSpawnPositions = [{ i: 19, j: 3 }];
        abilities = Object.values(PLAYER_ABILITIES).slice(0, 9);
        setBackButtonContent("Back");
        setNextButtonContent("Home");
        setTitle([
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-around",
              alignSelf: "center",
              margin:"10px 0px"
            }}
          >
            <div style={{ marginBottom:"5px" }}>
              Click on ability buttons</div>
            <div style={{ marginBottom:"5px" }}>
              or use num keys 1-9
            </div>
            <div style={{ marginBottom:"5px" }}>
              to attack and defend
            </div>
          </div>,
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
      case 7:
        playerSpawnPositions = [];
        kaijuSpawnPositions = [];
        setBackButtonContent("Back");
        setNextButtonContent("Ok");
        // display Kaiju_Warrior png.
        setTitle(["Fight back the Kaiju and save the people and your city!"]);
        setBackButtonCallback(() => () =>
          triggerTransition(() => handleClickHome())
        );
        break; 
      // case maxTutorialViewIndex:
      //   playerSpawnPositions = [
      //     { i: 11, j: 7 },
      //     { i: 3, j: 3 }
      //   ];
      //   kaijuSpawnPositions = [{ i: 19, j: 3 }];
      //   break;
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
    if (shouldUpdate(accTime.current, TURN_DELAY))
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
        null,
        setDeadKaijuLocations
      );
    // update accumulated time.
    accTime.current =
      accTime.current > Number.MAX_SAFE_INTEGER - 10000
        ? 0
        : accTime.current + intervalTime;
  }, intervalTime);
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
  const shiftContentOver = tutorialViewIndex === 7;
  return (
    <Wrapper>
      {tutorialViewIndex !== 0 && tutorialViewIndex !== 6 && (
        <div
          style={{
            display: "flex",
            width: "400px",
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
      {tutorialViewIndex === 2 ? (
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
          deadKaijuLocations={deadKaijuLocations}
        />
      )}
      {!!title[1] && (
        <TitleWrapper>
          <Title>{title[1]}</Title>
        </TitleWrapper>
      )}
      <ButtonGroup isPaddingBottom={tutorialViewIndex === 2}>
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
