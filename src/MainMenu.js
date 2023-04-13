import React, { useState } from "react";
import {
  Wrapper,
  ButtonGroup,
  ButtonsWrapper,
  ButtonOutline,
  Button,
  StyledIcon,
  StyledLink,
  BannerImg
} from "./Components/StyledComponents";
import { Logo } from "./Components/Logo";
import logo from "./logo.svg";

export const MainMenu = ({ handleClickGame, handleClickTutorial }) => {
  return (
    <Wrapper>
      <BannerImg
        width="300px"
        zIndex={-1}
        marginLeft={-150}
        marginTop={-660}
        src="kaiju_img.png"
      />
      <BannerImg
        width="170px"
        zIndex={-2}
        marginLeft={270}
        marginTop={-610}
        src="kaiju_img2.png"
      />

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
      <footer className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{ fontSize: "10px" }}>Made with React</p>
      </footer>
    </Wrapper>
  );
};
