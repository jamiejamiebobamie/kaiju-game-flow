import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import {
  Wrapper,
  Title,
  StyledSpookyText,
  StyledSciFiText,
  ButtonGroup,
  ButtonsWrapper,
  ButtonOutline,
  Button,
  StyledIcon,
  StyledSpookyTextShadow,
  StyledSciFiTextShadow,
  StyledLink,
  TestSilo
} from "./StyledComponents";

export const Home = () => {
  const MAX_TUTORIAL_VIEW_INDEX = 6;
  const [isTutorial, setIsTutorial] = useState(true);
  const [tutorialViewIndex, setTutorialViewIndex] = useState(-1);
  const [pickedAbilities, setPickedAbilities] = useState([]);
  const handleClickPlay = () =>
    pickedAbilities.length === 3 && setIsTutorial(false);
  const handleClickHome = () => {
    setTutorialViewIndex(-1);
    setIsTutorial(true);
    setPickedAbilities([]);
  };
  const handleClickGame = () => {
    setPickedAbilities([]);
    setIsTutorial(true);
    setTutorialViewIndex(MAX_TUTORIAL_VIEW_INDEX);
  };
  const handleClickTutorial = () => {
    setTutorialViewIndex(0);
  };
  // <TestSilo zIndex={-30} x={100} y={0} src={"silo4.png"} />
  //
  // <TestSilo zIndex={-50} x={100} y={200} src={"silo5.png"} />
  //
  // <TestSilo zIndex={-60} x={100} y={300} src={"silo6.png"} />
  //
  // <TestSilo zIndex={-70} x={100} y={400} src={"silo7.png"} />

  return tutorialViewIndex === -1 ? (
    <Wrapper>
      <svg
        style={{
          position: "absolute",
          backgroundColor: "red",
          zIndex: "100",
          transform: "scale(2)",
          opacity: 0.3
        }}
        width="500"
        height="500"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cityFade" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="black" />
            <stop offset="30%" stop-color="black" />
            <stop offset="100%" stop-color="transparent" />
          </linearGradient>
        </defs>
        <path
          d="M 50 200 v -80 h 50 v 80 h 10 v -40 h 50 v 40 h 50"
          fill="url(#cityFade)"
          stroke="black"
        />
      </svg>
      <TestSilo zIndex={-40} x={425} y={400} src={"silo3.png"} />
      <Title>
        <StyledSpookyText>Kaiju</StyledSpookyText>{" "}
        <StyledSciFiText>City</StyledSciFiText>
        <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
        <StyledSciFiTextShadow>City</StyledSciFiTextShadow>
      </Title>
      <ButtonGroup>
        <ButtonsWrapper>
          <Button onClick={handleClickGame}>
            <ButtonOutline zIndex={1} />
            Game
          </Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button onClick={handleClickTutorial}>
            <ButtonOutline zIndex={1} />
            Tutorial
          </Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button>
            <ButtonOutline zIndex={1} color={"black"} />
            <StyledLink></StyledLink>
            <StyledLink
              target="_blank"
              href="https://github.com/jamiejamiebobamie/kaiju-game-flow"
              rel="noreferrer"
            >
              Code
              <StyledIcon className="fa fa-github-alt" />
            </StyledLink>
          </Button>
        </ButtonsWrapper>
      </ButtonGroup>
    </Wrapper>
  ) : isTutorial ? (
    <Tutorial
      tutorialViewIndex={tutorialViewIndex}
      setTutorialViewIndex={setTutorialViewIndex}
      maxTutorialViewIndex={MAX_TUTORIAL_VIEW_INDEX}
      pickedAbilities={pickedAbilities}
      setPickedAbilities={setPickedAbilities}
      handleClickPlay={handleClickPlay}
      handleClickHome={handleClickHome}
    />
  ) : (
    <Game
      pickedAbilities={pickedAbilities}
      handleClickGame={handleClickGame}
      handleClickHome={handleClickHome}
    />
  );
};
// <TestSilo x={0} y={40} src={"silo2.png"} />
