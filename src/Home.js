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
  const handeClickPlay = () =>
    pickedAbilities.length === 3 && setIsTutorial(false);
  const handeClickHome = () => {
    setTutorialViewIndex(-1);
    setIsTutorial(true);
  };

  return tutorialViewIndex === -1 ? (
    <Wrapper>
      <Title>Kaiju City</Title>
      <ButtonGroup>
        <ButtonsWrapper>
          <Button onClick={() => setTutorialViewIndex(MAX_TUTORIAL_VIEW_INDEX)}>
            Game
          </Button>
        </ButtonsWrapper>
        <ButtonsWrapper>
          <Button onClick={() => setTutorialViewIndex(0)}>Tutorial</Button>
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
      handeClickPlay={handeClickPlay}
      handeClickHome={handeClickHome}
    />
  ) : (
    <Game pickedAbilities={pickedAbilities} />
  );
};
