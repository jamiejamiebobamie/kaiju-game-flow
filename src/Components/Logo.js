import React, { useState } from "react";
import {
  Title,
  StyledSpookyText,
  StyledSciFiText,
  StyledSciFiTextShadow,
  StyledSpookyTextShadow,
  StyledStaticLogo,
  Oval,
  Rectangle,
  Cloud
} from "./StyledComponents";
import { SkyLineSVG } from "./SkyLineSVG";

export const Logo = ({ isNavBar, handleClickHome, isDescription }) => {
  return (
    <img
      style={{
        position: "absolute",
        top: "0px",
        width: "600px",
        height: "300px",
        marginTop: "40px",
        marginBottom: "30px",
        marginLeft: "20px",
        zIndex: "999999",
        display: "flex",
        justifyContent: "space-between",
        pointerEvents: "none"
      }}
      // src="./Logo.gif"
      src="./staticLogo.png"
    />
  );
};
