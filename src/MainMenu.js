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

// <BannerImg
//   width="300px"
//   zIndex={-1}
//   marginLeft={-150}
//   marginTop={-660}
//   src="kaiju_img.png"
// />
// <BannerImg
//   width="170px"
//   zIndex={-2}
//   marginLeft={270}
//   marginTop={-610}
//   src="kaiju_img2.png"
// />

export const MainMenu = ({ handleClickGame, handleClickTutorial }) => {
  return (
    <Wrapper>
      <Logo />
      <div
        style={
          {
            // position: "absolute",
            // backgroundColor: "red",
            // width: "600px",
            // height: "350px",
            // marginTop: "-600px",
            // zIndex: "999999",
            // opacity: ".4",
            // display: "flex",
            // justifyContent: "space-between",
            // pointerEvents: "none"
          }
        }
      />
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
// <div
//   style={{
//     position: "absolute",
//     // backgroundColor: "red",
//     width: "90%",
//     height: "10dvh",
//     zIndex: "99999",
//     opacity: ".4",
//     display: "flex",
//     justifyContent: "space-between",
//     pointerEvents: "none"
//   }}
// >
//   <div
//     style={{
//       width: "150px",
//       height: "250px",
//       border: "5px dashed grey"
//     }}
//   />
//   <div
//     style={{
//       width: "150px",
//       height: "250px",
//       border: "5px dashed grey"
//     }}
//   />
// </div>
