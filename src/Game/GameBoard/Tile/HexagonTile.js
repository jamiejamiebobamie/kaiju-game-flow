import React from "react";
import styled from "styled-components";
import { Content } from "./Parts/Content";
import { Border } from "./Parts/Border";
import { Icon } from "./Parts/Icon";

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${props.x}px, ${props.y}px) scale(${props.scale});`};
  zindex: ${props => props.zIndex};
  ${props => !props.isTutorial && "pointer-events: none;"}
`;
export const HexagonTile = ({
  tileLocation,
  setHoverRef,
  rowLength = 1,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => {},
  isHighlighted0,
  status = {
    isOnKaijuFire: false,
    isOnFire: false,
    isWooded: false,
    isElectrified: false,
    isBubble: false,
    isShielded: false,
    isGhosted: false,
    isGraveyard: false
  },
  isTutorial = false
}) => {
  const zIndex = rowLength * i + j + 1;
  const ICON_LOOKUP = {
    isOnKaijuFire: { className: "fa-free-code-camp", color: "#df73ff" },
    isOnFire: { className: "fa-free-code-camp", color: "tomato" },
    isWooded: { className: "fa-leaf", color: "Chartreuse" },
    isElectrified: { className: "fa-bolt", color: "cyan" },
    isGhosted: { className: "fa-snapchat-ghost", color: "GhostWhite" },
    isBubble: { className: "fa-question-circle-o", color: "Thistle" },
    isShielded: { className: "fa-shield", color: "AntiqueWhite" },
    isGraveyard: { className: "fa-toggle-off", color: "white" },
    isMonster: { className: "fa-optin-monster", color: "purple" },
    isCold: { className: "fa-snowflake-o", color: "PaleTurquoise" },
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
    <Hexagon
      zIndex={zIndex}
      scale={scale}
      x={tileLocation.x}
      y={tileLocation.y}
      isTutorial={isTutorial}
    >
      <Content
        onClick={() =>
          setClickedIndex({ i, j, x: tileLocation.x, y: tileLocation.y })
        }
        index={{ i, j }}
        setHoverRef={setHoverRef}
        isHighlighted0={isHighlighted0}
        status={status}
        color={color}
        isTutorial={isTutorial}
      />
      <Icon zIndex={zIndex} className={className} color={color} />
      <Border color={color} isTutorial={isTutorial} />
    </Hexagon>
  );
};
