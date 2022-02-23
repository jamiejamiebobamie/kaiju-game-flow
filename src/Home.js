import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Credits } from "./Credits";
import { Game } from "./Game/Game";
import {
  Wrapper,
  ButtonGroup,
  ButtonsWrapper,
  ButtonOutline,
  Button,
  StyledIcon,
  StyledLink
} from "./Components/StyledComponents";
import { Logo } from "./Components/Logo";
import { NavBar } from "./Components/NavBar";

export const Home = () => {
  const MAX_TUTORIAL_VIEW_INDEX = 6;
  const [isTutorial, setIsTutorial] = useState(true);
  const [isCredits, setIsCredits] = useState(true);

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
  const handleClickCredits = () => {
    setTutorialViewIndex(0);
    setIsTutorial(false);
    setIsCredits(true);
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
            <ButtonsWrapper>
              <Button onClick={handleClickCredits}>
                <ButtonOutline zIndex={1} />
                Credits
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
      ) : isCredits ? (
        <Credits handleClickHome={handleClickHome} />
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
