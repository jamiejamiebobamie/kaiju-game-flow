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

export const Logo = ({ isNavBar, handleClickHome }) => {
  return isNavBar ? (
    <StyledStaticLogo onClick={handleClickHome} src="staticLogo.png" />
  ) : (
    <>
      <Title>
        <StyledSpookyText>Kaiju</StyledSpookyText>{" "}
        <StyledSciFiText>City</StyledSciFiText>
        <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
      </Title>
      <SkyLineSVG x={0} y={-30} zIndex={-100} />
    </>
  );
};
