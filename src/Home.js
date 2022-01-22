import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import {
  Wrapper,
  Title,
  ButtonGroup,
  ButtonsWrapper,
  Button,
  StyledIcon
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
  return tutorialViewIndex === -1 ? (
    <Wrapper>
      <Title>Kaiju City</Title>
      <ButtonGroup>
        <ButtonsWrapper>
          <Button onClick={handleClickGame}>Game</Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button onClick={handleClickTutorial}>Tutorial</Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button>
            <a
              target="_blank"
              style={{ color: "black", textDecoration: "none" }}
              href="https://github.com/jamiejamiebobamie/kaiju-game-flow"
              rel="noreferrer"
            >
              Code <StyledIcon className="fa fa-github-alt" />
            </a>
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
