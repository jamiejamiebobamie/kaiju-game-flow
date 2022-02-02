import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import {
  Wrapper,
  ButtonGroup,
  ButtonsWrapper,
  ButtonOutline,
  Button,
  StyledIcon,
  StyledLink,
  TestImg
} from "./Components/StyledComponents";
import { Logo } from "./Components/Logo";
import { NavBar } from "./Components/NavBar";

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
  return (
    <>
      <NavBar
        handleClickHome={handleClickHome}
        isLogoDisplayed={tutorialViewIndex !== -1}
      />
      {tutorialViewIndex === -1 ? (
        <Wrapper>
          <Logo />
          <ButtonGroup>
            <TestImg alignment={"start"} width={"300"} src="test1.png" />
            <TestImg alignment={"end"} src="test2.png" />

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
      )}
    </>
  );
};
