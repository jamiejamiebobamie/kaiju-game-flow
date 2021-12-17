import React from "react";
import styled from "styled-components";

const StyledIcon = styled.i`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 100%;
  height: 100%;
  transform: scale(3)
    translate(19px, ${props => (props.isGraveyard ? "30px" : "15px")})
    rotate(${props => (props.isGraveyard ? "-90deg" : "0deg")});
  pointer-events: none;
  color: ${props => props.color};
`;
// -webkit-transform: scale(3) translate(20px, 15px);
// -moz-transform: scale(3) translate(20px, 15px);
// -ms-transform: scale(3) translate(20px, 15px);
// -o-transform: scale(3) translate(20px, 15px);
export const Icon = ({ status, zIndex }) => {
  const ICON_LOOKUP = {
    isOnFire: { className: "fa-free-code-camp", offset: 0, color: "tomato" },
    isWooded: { className: "fa-leaf", offset: 45, color: "green" },
    isElectrified: { className: "fa-bolt", offset: 180, color: "cyan" },
    isGhosted: { className: "fa-snapchat-ghost", offset: 0, color: "white" },
    isBubble: { className: "fa-question-circle-o", offset: 0, color: "white" },
    isShielded: { className: "fa-shield", offset: 0, color: "black" },
    isGraveyard: { className: "fa-toggle-off", offset: -90, color: "white" },
    isCold: { className: "fa-snowflake-o", color: "grey" }
  };
  const determineIcon = status => {
    if (status.isGraveyard) {
      return ICON_LOOKUP["isGraveyard"];
    } else if (status.isBubble) {
      return ICON_LOOKUP["isBubble"];
    } else if (status.isGhosted) {
      return ICON_LOOKUP["isGhosted"];
    } else if (status.isShielded) {
      return ICON_LOOKUP["isShielded"];
    } else if (status.isElectrified) {
      return ICON_LOOKUP["isElectrified"];
    } else if (status.isCold) {
      return ICON_LOOKUP["isCold"];
    } else if (status.isOnFire) {
      return ICON_LOOKUP["isOnFire"];
    } else if (status.isWooded) {
      return ICON_LOOKUP["isWooded"];
    } else {
      return { className: "", offset: 0 };
    }
  };
  const { className, color } = determineIcon(status);
  const { isGraveyard } = status;
  return (
    <StyledIcon
      className={`fa ${className}`}
      isGraveyard={isGraveyard}
      zIndex={zIndex + 1}
      color={color}
    />
  );
};
