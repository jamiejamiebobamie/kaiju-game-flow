import React from "react";
import styled from "styled-components";

const Monster = styled.img`
    position: absolute;
    margin-left: -15px;
    margin-top: -25px;
    display: ${props =>
      props.charLocation.x < 0 ||
      props.charLocation.x > 490 ||
      props.charLocation.y < 30 ||
      props.charLocation.y > 800
        ? "none"
        : "block"};
    width: 40px;
    height: 40px;
    z-index: 20001;
    left: ${props => `${props.charLocation.x}px`};
    top: ${props => `${props.charLocation.y}px`};
    pointer-events: none;
}`;

/* const Monster = styled.i`
  position: absolute;


  width: 10px;
  height: 10px;
  color: ${props => props.color};
}
`; */
export const Kaiju = ({ charLocation, element, color }) => {
  return <Monster charLocation={charLocation} src={"kaiju.png"} />;
};
// <Monster
//   className="fa fa-optin-monster"
//   charLocation={charLocation}
//   color={color}
// />
