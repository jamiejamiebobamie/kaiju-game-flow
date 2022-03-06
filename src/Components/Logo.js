import React, { useState } from "react";
import {
  Title,
  StyledSpookyText,
  StyledSciFiText,
  StyledSciFiTextShadow,
  StyledSpookyTextShadow,
  StyledStaticLogo
} from "./StyledComponents";
import { SkyLineSVG } from "./SkyLineSVG";

export const Logo = ({ isNavBar, handleClickHome, isDescription }) => {
  return (
    <>
      <Title isDescription={isDescription}>
        <StyledSpookyText isDescription={isDescription}>Kaiju</StyledSpookyText>{" "}
        <StyledSciFiText>City</StyledSciFiText>
        <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
      </Title>
    </>
  );
};
