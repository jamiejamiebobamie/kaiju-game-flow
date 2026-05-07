import React, { useRef, useState, useContext } from "react";
import { FullscreenPage } from "Components/FullscreenPage.js";
import { GlobalSettingsContext } from 'Home';
import {
  useHover,
  useEventTick,
  useUpdateClickedMovetoTile,
  useUpdateTutorialScreenContent,
} from "Utils/utils";
import { TutorialGameBoard } from "./Components/TutorialGameBoard";
import {
  Wrapper,
  TitleWrapper,
  Title,
  ButtonsWrapper,
  Button,
  ButtonGroup,
  ButtonOutline,
  HomeButtonWrapper
} from "./Components/StyledComponents";

export const Tutorial = ({ handleClickHome, handleClickGame, triggerTransition }) => {
  const TURN_DELAY = 100;
  const maxTutorialViewIndex = 7;
  const width = 500;
  const height = 800;
  const scale = 0.3;
  const accTime = useRef(0);
  const { selectedAvatar } = useContext(GlobalSettingsContext);
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

  // keep in case I want to implement "pause gameboard"
  const [intervalTime, setIntervalTime] = useState(TURN_DELAY);

  const [title, setTitle] = useState([]);
  const [nextButtonContent, setNextButtonContent] = useState("");
  const [backButtonContent, setBackButtonContent] = useState("");
  const [backButtonCallback, setBackButtonCallback] = useState(() => { });
  const [fullScreenPageData, setFullScreenPageData] = useState(undefined);
  const [isHomeButton, setIsHomeButton] = useState(false);

  const incrementTutorialViewIndex = () =>
    triggerTransition(() =>
      setTutorialViewIndex(_i =>
        _i + 1 <= maxTutorialViewIndex ? _i + 1 : handleClickHome()
      )
    );
  const decrementTutorialViewIndex = () => {
    setTutorialViewIndex(_i => (_i - 1 >= 0 ? _i - 1 : 0));
  };

  // logic for user to cycle through Tutorial screen(s) content
  useUpdateTutorialScreenContent({
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
    selectedAvatar
  });

  // user clicks gameboard tile -> update move-to-tile data
  useUpdateClickedMovetoTile({
    playerMoveToTiles,
    setPlayerData,
    setPlayerMoveToTiles
  });

  // gameboard update logic:
  useEventTick({
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
    intervalTime,
    setPlayerMoveToTiles
  });

  const homeButton = <HomeButtonWrapper>
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
  </HomeButtonWrapper>

  const infoPage = fullScreenPageData &&
    <FullscreenPage
      text={fullScreenPageData.text}
      buttons={fullScreenPageData.buttons}
      image={fullScreenPageData.image}
      homeButtonOnClick={fullScreenPageData.homeButtonOnClick}
    />

  const gameboardPage = <Wrapper>
    {isHomeButton && homeButton}
    <TitleWrapper>
      <Title>{title[0]}</Title>
    </TitleWrapper>
    <TutorialGameBoard
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
    {!!title[1] && (
      <TitleWrapper>
        <Title>{title[1]}</Title>
      </TitleWrapper>
    )}
    <ButtonGroup>
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

  /*
    infoPage = overlay above gameboardPage, contains info
    gameboardPage = main gameboard area where gameplay occurs
  */
  return (
    <>
      {infoPage}
      {gameboardPage}
    </>
  );
};
