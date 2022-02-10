import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  /* overflow: hidden; */
  justify-content: flex-start;
  width: 230px;
  height: 30px;
  margin-left: 5px;
  /* background-color: purple; */
`;
const Bar = styled.div`
  ${props =>
    props.numHealth < 5
      ? "min-width: 20%;width: 20%;"
      : "min-width: 15%;width: 15%;"};
  height: 15px;
  min-height: 10px;
  margin-left: 10px;
  align-self: center;
  border-radius: 30px;
  border-style: solid;
  border-width: thin;
  background: linear-gradient(45deg, #d22b2b, #880808);
  /* border-color: #880808; */
  border-radius: 30px;
  border-style: solid;
  border-thickness: 0.5px;
  border-color: #db974f;
  margin: 5px;
`;
export const HealthBar = ({ setDisplayString, health = 1 }) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const bars = [];
  for (let i = 0; i < health; i++) {
    bars.push(<Bar key={i} numHealth={health} />);
  }
  return <Wrapper ref={setHoverRef("healthBar")}>{bars}</Wrapper>;
};
