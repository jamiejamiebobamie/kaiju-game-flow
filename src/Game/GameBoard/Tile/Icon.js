import React from "react";
import styled from "styled-components";

const StyledIcon = styled.i`
  position: absolute;
  z-index: ${props => props.zIndex};
  width: 100%;
  height: 100%;
  transform: scale(3) translate(19px, 15px);
  pointer-events: none;
  color: ${props => props.color};
`;
// -webkit-transform: scale(3) translate(20px, 15px);
// -moz-transform: scale(3) translate(20px, 15px);
// -ms-transform: scale(3) translate(20px, 15px);
// -o-transform: scale(3) translate(20px, 15px);
export const Icon = ({ status, zIndex }) => {
  const ICON_LOOKUP = {
    isOnKaijuFire: { className: "fa-free-code-camp", color: "#df73ff" },
    isOnFire: { className: "fa-free-code-camp", color: "tomato" },
    isWooded: { className: "fa-leaf", color: "green" },
    isElectrified: { className: "fa-bolt", color: "cyan" },
    isGhosted: { className: "fa-snapchat-ghost", color: "white" },
    isBubble: { className: "fa-question-circle-o", color: "white" },
    isShielded: { className: "fa-shield", color: "black" },
    isGraveyard: { className: "fa-toggle-off", color: "white" },
    isMonster: { className: "fa-optin-monster", color: "purple" },
    isCold: { className: "fa-snowflake-o", color: "white" },
    isHealing: { className: "fa-heart", color: "pink" }
  };
  const determineIcon = status => {
    if (status.isHealing) {
      return ICON_LOOKUP["isHealing"];
    } else if (status.isBubble) {
      return ICON_LOOKUP["isBubble"];
    } else if (status.isGhosted) {
      return ICON_LOOKUP["isGhosted"];
    } else if (status.isShielded) {
      return ICON_LOOKUP["isShielded"];
    } else if (status.isElectrified) {
      return ICON_LOOKUP["isElectrified"];
    } else if (status.isOnKaijuFire) {
      return ICON_LOOKUP["isOnKaijuFire"];
    } else if (status.isCold) {
      return ICON_LOOKUP["isCold"];
    } else if (status.isOnFire) {
      return ICON_LOOKUP["isOnFire"];
    } else if (status.isWooded) {
      return ICON_LOOKUP["isWooded"];
    } else if (status.isMonster) {
      return ICON_LOOKUP["isMonster"];
    } else {
      return { className: "", offset: 0 };
    }
  };
  const { className, color } = determineIcon(status);
  return (
    <StyledIcon
      className={`fa ${className}`}
      zIndex={zIndex + 1}
      color={color}
    />
  );
};
