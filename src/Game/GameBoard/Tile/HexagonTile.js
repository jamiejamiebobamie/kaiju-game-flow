import React from "react";
import styled from "styled-components";
import { Content } from "./Parts/Content";
import { Border } from "./Parts/Border";
import { Icon } from "./Parts/Icon";
import { getAngleOfRotationFromTileDirs } from 'Utils/utils'

const Hexagon = styled.div`
  ${props =>
    `transform: translate(${props.x}px, ${props.y}px) scale(${props.scale});`};
    zindex: ${props => props.zIndex};
`;
const PopInEffect = styled.div`
  ${props =>
    `transform: translate(${props.isVisible ? 0 : 285 * props.scale}px, ${props.isVisible ? 0 : 285 * props.scale}px) scale(${props.isVisible ? 1 : 0});`};
  zindex: ${props => props.zIndex};
  ${props => !props.isTutorial && "pointer-events: none;"}
  ${props => !props.isVisible ? 'filter: drop-shadow(0 0 2px #80EF80);' : ''}

  transition: transform;
  transition-duration: 2s;
`;

const returnValue = v => v;
const addNeg240 = v => v - 240;
const addNeg240AndRandRotByIJ = (v, _, __, ___, i, j) => v - 240 + (i % 2 ? -1 : 1) * j % 15;// + 60 * (updateKey % 2 === 0) ? -1 : 1;
const shiver10 = v => Math.random() * 10 * (Math.random() > .5 ? -1 : 1);// + 60 * (updateKey % 2 === 0) ? -1 : 1;
const rotate360ByCount = (v, count, startCount) => v + (count / startCount) * 360;
const rotate360ByUpdateKey = (v, _, __, updateKey) => updateKey % 360;

const doNotRotate = _ => 0;
const add180 = v => v + 180;

const ICON_LOOKUP = {
  isOnKaijuFire: { finalStatus: 'isOnKaijuFire', className: "fa-free-code-camp", color: "#df73ff", rotationShift: doNotRotate },
  isOnFire: { finalStatus: 'isOnFire', className: "fa-free-code-camp", color: "tomato", rotationShift: doNotRotate },
  isWet: { finalStatus: 'isWet', className: "fa-tint", color: "#3c7fde", rotationShift: returnValue },
  isWooded: { finalStatus: 'isWooded', className: "fa-leaf", color: "Chartreuse", rotationShift: addNeg240 },
  isElectrified: { finalStatus: 'isElectrified', className: "fa-bolt", color: "cyan", rotationShift: returnValue },
  isGhosted: { finalStatus: 'isGhosted', className: "fa-snapchat-ghost", color: "GhostWhite", rotationShift: add180 },
  isBubble: { finalStatus: 'isBubble', className: "fa-question-circle-o", color: "Thistle", rotationShift: rotate360ByCount },
  isShielded: { finalStatus: 'isShielded', className: "fa-shield", color: "AntiqueWhite", rotationShift: doNotRotate },
  isCold: { finalStatus: 'isCold', className: "fa-snowflake-o", color: "PaleTurquoise", rotationShift: rotate360ByCount },
  isHealing: { finalStatus: 'isHealing', className: "fa-heart", color: "pink", rotationShift: add180 },
  isTeleportTile: { finalStatus: 'isTeleportTile', className: "fa-ravelry", color: "BlueViolet", rotationShift: doNotRotate },
  // IS_BLANK: { finalStatus: '_blank', className: 'fa-connectdevelop', color: 'blue', rotationShift: doNotRotate },
  IS_BLANK: { finalStatus: '', className: "", color: "", rotationShift: doNotRotate },
};
const determineIcon = status => {
  switch (true) {
    case !!status.isTeleportTile:
      return ICON_LOOKUP["isTeleportTile"];
    case !!status.isHealing:
      return ICON_LOOKUP["isHealing"];
    case !!status.isBubble:
      return ICON_LOOKUP["isBubble"];
    case !!status.isGhosted:
      return ICON_LOOKUP["isGhosted"];
    case !!status.isElectrified:
      return ICON_LOOKUP["isElectrified"];
    case !!status.isCold:
      return ICON_LOOKUP["isCold"];
    case !!status.isShielded:
      return ICON_LOOKUP["isShielded"];
    case !!status.isOnFire:
      return ICON_LOOKUP["isOnFire"];
    case !!status.isOnKaijuFire:
      return ICON_LOOKUP["isOnKaijuFire"];
    case !!status.isWet:
      return ICON_LOOKUP["isWet"];
    case !!status.isWooded:
      return ICON_LOOKUP["isWooded"];
    default:
      return ICON_LOOKUP["IS_BLANK"];
  }
}

export const HexagonTile = ({
  isVisible,
  tileLocation,
  rowLength = 1,
  scale = 1,
  i = 0,
  j = 0,
  setClickedIndex = () => { },
  isHighlighted0,
  status = {
    isOnKaijuFire: false,
    isOnFire: false,
    isWooded: false,
    isWet: false,
    isElectrified: false,
    isBubble: false,
    isShielded: false,
    isGhosted: false,
    isGraveyard: false
  },
}) => {
  const zIndex = rowLength * i + j + 1;
  const { className, color, finalStatus, rotationShift } = determineIcon(status);
  const iconRotation = !!status && !!status[finalStatus] && !!status[finalStatus].dirs && !!status[finalStatus].dirs.length ? getAngleOfRotationFromTileDirs(status[finalStatus].dirs) : 0;

  const { count, startCount } = !!status && !!status[finalStatus] ? status[finalStatus] : { count: 0, startCount: 1 }
  const { updateKey } = !!status ? status : { updateKey: 0 };
  return (
    <Hexagon
      zIndex={zIndex}
      scale={scale}
      x={tileLocation.x}
      y={tileLocation.y}
    >
      <PopInEffect
        isVisible={isVisible}
        scale={scale}>
        <Content
          onClick={() => setClickedIndex({ i, j, x: tileLocation.x, y: tileLocation.y })}
          index={{ i, j }}
          isHighlighted0={isHighlighted0}
          status={status}
          color={color}
          isVisible={isVisible}
        />
        <Icon zIndex={zIndex} className={className} color={color} rotation={rotationShift(iconRotation, count, startCount, updateKey, i, j)} />
        <Border color={color} />
      </PopInEffect>
    </Hexagon>
  );
};
