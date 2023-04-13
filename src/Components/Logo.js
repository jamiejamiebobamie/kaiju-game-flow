import React, { useState } from "react";
import {
  Title,
  StyledSpookyText,
  StyledSciFiText,
  StyledSciFiTextShadow,
  StyledSpookyTextShadow,
  StyledStaticLogo,
  Oval,
  Rectangle
} from "./StyledComponents";
import { SkyLineSVG } from "./SkyLineSVG";

export const Logo = ({ isNavBar, handleClickHome, isDescription }) => {
  return (
    <>
      <Oval />
      <Rectangle />
      <Title isDescription={isDescription}>
        <StyledSpookyText isDescription={isDescription}>Kaiju</StyledSpookyText>{" "}
        <StyledSciFiText>City</StyledSciFiText>
        <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
      </Title>
      <SkyLineSVG zIndex={-1} isNavBar={false} />
    </>
  );
};
