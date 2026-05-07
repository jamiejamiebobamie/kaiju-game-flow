import React, { useRef, useState, useContext } from "react";
import { FullscreenPage } from "Components/FullscreenPage.js";
import {
  useHover,
  useEventTick,
  useUpdateClickedMovetoTile,
  useUpdateSettingsScreen,
} from "Utils/utils";
import { TutorialGameBoard } from "Tutorial/Components/TutorialGameBoard";
import {
  // Wrapper,
  TitleWrapper,
  Title,
  // ButtonsWrapper,
  // Button,
  // ButtonGroup,
  // ButtonOutline,
  HomeButtonWrapper
} from "Tutorial/Components/StyledComponents";
import { Difficulty, GlobalSettingsContext } from "Home";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
  align-items: center;
  width: auto;
  height: 100dvh;
  max-height: 710px;
  max-width: 870px;
  flex-direction: column;
  align-self: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-color: #db974f;
  transition: 3s;
  // margin-top: 80px;
`;

export const SectionHeader = styled.div`
  ${props => props.padding ? `padding: ${props.padding};` : "padding: 40px 0px 20px 30px;"}
  color: rgb(219, 151, 79);
  font-size: 20px;
`;

export const DifficultyWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10px 30px;
`;

export const DifficultyButtonWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 50px;
  transform: scale(1.2, 1.5);
  margin 25px 50px;
`;

export const RadioButton = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  width: 200px;
  min-width: 200px;
  height: 30px;

  font-alignment: center;
  cursor: pointer;

  border-top: 3px solid #5a8a7a;
  border-bottom: 5px solid #5a8a7a;
  border-right: solid black .75px;
  border-left: solid black .75px;
  border-radius: none;

  ${props => props.first && `
    border-left: 3px solid #5a8a7a;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    `
  }

  ${props => props.last &&
    `
    border-right: 3px solid #5a8a7a;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    `
  }

  color: #5a8a7a;
  filter: drop-shadow(0px 3px 1px black);
  -webkit-text-stroke: 0.5px black;


  ${props => !props.selected &&
    `&:hover {
    border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 3px);
    filter: drop-shadow(0px 0px 0px black);
  }`}

  ${props => props.selected &&
    `border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 1px);
    filter: drop-shadow(0px 0px 4px #fff080);
    -webkit-text-stroke: 0.5px #fff080;
    `
  }

  font-size: 25px;
  text-stroke: 0.5px black;
  background-color: #376e5b;
`;

export const RadioButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 200px;
  min-width: 200px;
  height: 29.5px;
  margin-top: -0.5px;
  pointer-events: none;

  border-top: 0.75px solid black;
  border-bottom: 0.5px solid black;
  border-right: none;
  border-left: none;
  border-radius: none;

${props => props.first &&
    `border-left: 0.3px solid black;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;`}

${props => props.last &&
    `border-right: 0.3px solid black;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;`}

`;

export const AbilityEditorSectionWrapper = styled.div`
  position: relative;
  width: 100%;

    display: flex;
    height: 400px;
    flex-direction: column;
    justify-content: flex-end;
`;

export const AbilityEditorButton = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;

  // margin: 0px 0px 170px;

  width: 700px;
  // min-width: 200px;
  height: 50px;

  font-alignment: center;
  cursor: pointer;

  border-radius: 5px;
  border-style: solid;

  border-top: 3px solid #5a8a7a;
  border-right: 4px solid #5a8a7a;
  border-left: 4px solid #5a8a7a;
  border-bottom: 5px solid #5a8a7a;
  color: #5a8a7a;
  filter: drop-shadow(0px 3px 1px black);

  &:hover {
    border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 1px);
    filter: drop-shadow(0px 0px 0px black);
  }

  font-size: 35px;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  background-color: #376e5b;
`;

export const AbilityEditorButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 700px;
  height: 49.5px;
  margin-top: -0.5px;
  pointer-events: none;
  border-radius: 3px;
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;
`;

export const BackButtonSectionWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0px 0px 0px 60px;`;

export const BackButton = styled.div`
  display: flex;
  align-self: flex-start;
  justify-content: center;

  width: 250px;
  height: 30px;

  margin: 0px 0px 70px;

  font-alignment: center;
  cursor: pointer;

  border-radius: 5px;
  border-style: solid;

  border: 3px solid #5a8a7a;
  border-bottom: 5px solid #5a8a7a;
  color: #5a8a7a;
  filter: drop-shadow(0px 3px 1px black);

  &:hover {
    border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 3px);
    filter: drop-shadow(0px 0px 0px black);
  }

  font-size: 23px;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  background-color: #376e5b;
`;

export const BackButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 250px;
  /* min-width: 200px; */
  height: 29.5px;
  margin-top: -0.5px;
  pointer-events: none;
  border-radius: 3px;
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;
`;

export const Settings = ({ handleClickHome, handleClickGame, triggerTransition }) => {

  const { selectedAvatar, selectedDifficulty, setSelectedDifficulty } = useContext(GlobalSettingsContext);

  const TURN_DELAY = 100;
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

  // keep in case I want to implement "pause gameboard"
  const [intervalTime, setIntervalTime] = useState(TURN_DELAY);

  const [title, setTitle] = useState([]);
  const [nextButtonContent, setNextButtonContent] = useState("");
  const [backButtonContent, setBackButtonContent] = useState("");
  const [backButtonCallback, setBackButtonCallback] = useState(() => { });
  const [fullScreenPageData, setFullScreenPageData] = useState(undefined);
  const [isHomeButton, setIsHomeButton] = useState(false);

  // const incrementTutorialViewIndex = () =>
  //   triggerTransition(() =>
  //     setTutorialViewIndex(_i =>
  //       _i + 1 <= maxTutorialViewIndex ? _i + 1 : handleClickHome()
  //     )
  //   );
  // const decrementTutorialViewIndex = () => {
  //   setTutorialViewIndex(_i => (_i - 1 >= 0 ? _i - 1 : 0));
  // };

  // logic for user to cycle through Tutorial screen(s) content
  useUpdateSettingsScreen({
    tutorialViewIndex,
    setBackButtonContent,
    setNextButtonContent,
    setTitle,
    setBackButtonCallback,
    setShouldKaijuMove,
    triggerTransition,
    handleClickHome,
    handleClickGame,
    incrementTutorialViewIndex: () => { },
    decrementTutorialViewIndex: () => { },
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
  // useEventTick({
  //   playerData,
  //   setPlayerData,
  //   hoverLookupString,
  //   path,
  //   setPath,
  //   scale,
  //   kaijuData,
  //   setKaijuData,
  //   dmgArray,
  //   setDmgArray,
  //   tileStatuses,
  //   setTileStatuses,
  //   width,
  //   height,
  //   accTime,
  //   setHoverRef,
  //   setClickedTile,
  //   setTiles,
  //   teleportData,
  //   setTeleportData,
  //   setDeadKaijuLocations,
  //   TURN_DELAY,
  //   highlightedTiles0,
  //   setHighlightedTiles0,
  //   shouldKaijuMove,
  //   intervalTime,
  //   setPlayerMoveToTiles
  // });

  // const homeButton = <HomeButtonWrapper>
  //   <ButtonGroup>
  //     <ButtonsWrapper>
  //       <Button
  //         onClick={() => triggerTransition(() => handleClickHome())}
  //       >
  //         <ButtonOutline zIndex={1} />
  //         Home
  //       </Button>
  //     </ButtonsWrapper>
  //   </ButtonGroup>
  // </HomeButtonWrapper>

  console.log({ isMediumChecked: selectedDifficulty == Difficulty.Medium, Difficulty, selectedDifficulty, Medium: Difficulty.Medium })

  return (<Wrapper>
    <DifficultyWrapper>
      <SectionHeader>
        Difficulty:
      </SectionHeader>
      <DifficultyButtonWrapper>
        <RadioButton
          selected={selectedDifficulty == Difficulty.Easy}
          first={true} onClick={() => setSelectedDifficulty(Difficulty.Easy)}>
          <RadioButtonOutline first={true} zIndex={1} />
          Easy
        </RadioButton>
        <RadioButton
          selected={selectedDifficulty == Difficulty.Medium}
          onClick={() => setSelectedDifficulty(Difficulty.Medium)}>
          <RadioButtonOutline zIndex={1} />
          Medium
        </RadioButton>
        <RadioButton
          selected={selectedDifficulty == Difficulty.Hard}
          onClick={() => setSelectedDifficulty(Difficulty.Hard)}>
          <RadioButtonOutline zIndex={1} />
          Hard
        </RadioButton>
        <RadioButton
          selected={selectedDifficulty == Difficulty.Xtreme}
          last={true} onClick={() => setSelectedDifficulty(Difficulty.Xtreme)}>
          <RadioButtonOutline last={true} zIndex={1} />
          Xtreme
        </RadioButton>
      </DifficultyButtonWrapper>
    </DifficultyWrapper>
    <AbilityEditorSectionWrapper>
      <SectionHeader padding={'100px 0px 50px 30px'}>
        Edit the lifespan and spawn count of your active abilities:
      </SectionHeader>
      <AbilityEditorButton onClick={() => { }}>
        <AbilityEditorButtonOutline zIndex={1} />
        Ability Editor
      </AbilityEditorButton>
    </AbilityEditorSectionWrapper>
    <BackButtonSectionWrapper>
      <BackButton onClick={handleClickHome}>
        <BackButtonOutline zIndex={1} />
        Back
      </BackButton>
    </BackButtonSectionWrapper>

    {/* {isHomeButton && homeButton}
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
    </ButtonGroup> */}
  </Wrapper>
  );
};
