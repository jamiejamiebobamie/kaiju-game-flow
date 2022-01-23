import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../../Utils/utils";

const ICON_LOOKUP = {
  heart: {
    Passive: "fa-gratipay",
    Active: "fa-heart",
    loader: "fa-spinner"
  },
  glass: {
    Passive: "fa-tencent-weibo",
    Active: "fa-ravelry",
    loader: "fa-spinner"
  },
  fire: {
    Passive: "fa-fire",
    Active: "fa-free-code-camp",
    loader: "fa-spinner"
  },
  wood: {
    Passive: "fa-tree",
    Active: "fa-leaf",
    loader: "fa-spinner"
  },
  lightning: {
    Passive: "fa-hourglass-half",
    Active: "fa-bolt",
    loader: "fa-spinner"
  },
  death: {
    Passive: "fa-heartbeat",
    Active: "fa-snapchat-ghost",
    loader: "fa-spinner"
  },
  bubble: {
    Passive: "fa-universal-access",
    Active: "fa-question-circle-o",
    loader: "fa-spinner"
  },
  metal: {
    Passive: "fa-cutlery",
    Active: "fa-shield",
    loader: "fa-spinner"
  },
  ice: {
    Passive: "fa-thermometer-quarter",
    Active: "fa-snowflake-o",
    loader: "fa-spinner"
  }
};

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-self: center;
  align-items: center;
  justify-self: center;
  align-self: center;
  border-radius: 100%;
  border-color: ${props => props.color};
  border-style: solid;
  border-width: thin;
  min-width: 50px;
  height: 50px;
  cursor: pointer;
  }
`;
const AbilityIcon = styled.i`
  z-index: ${props => props.i};
  justify-self: center;
  align-self: center;
  transform: scale(2);
  color: ${props => props.color};
`;
export const Ability = ({
  name,
  isActive,
  setDisplayString,
  displayLookup,
  element,
  isPicked,
  color
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  return (
    <Wrapper
      onClick={() => {}}
      ref={setHoverRef(`${displayLookup}${isActive ? "Active" : "Passive"}`)}
      title={name}
      color={isPicked && color}
    >
      <AbilityIcon
        color={isPicked && color}
        className={`fa ${
          ICON_LOOKUP[element][isActive ? "Active" : "Passive"]
        }`}
      />
    </Wrapper>
  );
};
