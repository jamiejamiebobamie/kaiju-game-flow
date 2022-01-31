import React, { useState } from "react";
import { Tutorial } from "./Tutorial/Tutorial";
import { Game } from "./Game/Game";
import {
  Wrapper,
  // Title,
  // StyledSpookyText,
  // StyledSciFiText,
  ButtonGroup,
  ButtonsWrapper,
  ButtonOutline,
  Button,
  StyledIcon,
  // StyledSpookyTextShadow,
  // StyledSciFiTextShadow,
  StyledLink
  // TestSilo
} from "./StyledComponents";
// import { SkyLineSVG } from "./SkyLineSVG";
import { Logo } from "./Logo";

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
  // <TestSilo zIndex={-150} x={100} y={200} src={"silo6.png"} />

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <div
        style={{
          width: "100%",
          height: "125px",
          marginBottom: "-50px"
          // backgroundColor: "blue"
          // overflow: "hidden"
          // borderBottom: "solid 2px"
        }}
      >
        {tutorialViewIndex !== -1 && (
          <Wrapper
            onClick={handleClickHome}
            scale={"scale(.5)"}
            translate={"translate(-400px, -550px)"}
          >
            <Logo isNavBar={true} />
          </Wrapper>
        )}
      </div>
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
    </div>
  );
};
