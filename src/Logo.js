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
import { SkyLineSVG } from "./SkyLineSVG";

export const Logo = ({ isNavBar }) => {
  return (
    <>
      <Title>
        <StyledSpookyText>Kaiju</StyledSpookyText>{" "}
        <StyledSciFiText>City</StyledSciFiText>
        <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
      </Title>
      <SkyLineSVG isNavBar={isNavBar} x={0} y={-30} zIndex={-100} />
    </>
  );
};
