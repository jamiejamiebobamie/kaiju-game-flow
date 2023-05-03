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
        // backgroundColor: "red",
        top: "0px",
        width: "600px",
        height: "350px",
        // marginTop: "-50px",
        zIndex: "999999",
        // opacity: ".4",
        display: "flex",
        justifyContent: "space-between",
        // filter: "drop-shadow(0px 10px 5px black)",

        pointerEvents: "none"
      }}
      src="./Logo.gif"
    />
  );
};
// OLD LOGO, BEFORE FIVERR
// <>
//   <Oval />
//   <Rectangle />
//   <Title isDescription={isDescription}>
//     <StyledSpookyText isDescription={isDescription}>Kaiju</StyledSpookyText>{" "}
//     <StyledSciFiText>City</StyledSciFiText>
//     <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
//   </Title>
//   <SkyLineSVG zIndex={-1} isNavBar={false} />
//   <div
//     style={{
//       position: "absolute",
//       zIndex: "-2",
//       width: "566px",
//       height: "150px",
//       // backgroundColor: "red",
//       marginTop: "-250px",
//       overflow: "hidden"
//     }}
//   ></div>
// </>
