import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  overflow: scroll;
  justify-content: flex-start;
  width: 60%;
  height: 50px;
  /* background-color: red; */
  /* border-radius: 10px; */
  /* border-style: solid;
  border-thickness: thin; */
`;
const Bar = styled.div`
  ${props =>
    props.numHealth < 5
      ? "min-width: 60px;width: 60px;"
      : "min-width: 35px;width: 35px;"};
  height: 15px;
  min-height: 10px;
  margin-left: 10px;
  align-self: center;
  border-radius: 30px;
  border-style: solid;
  border-width: thin;
  background: linear-gradient(45deg, #d22b2b, #880808);
  border-color: #880808;
`;
export const HealthBar = ({ setDisplayString, health = 1 }) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const bars = [];
  for (let i = 0; i < health; i++) {
    bars.push(
      <Bar key={i} ref={setHoverRef("healthBar")} numHealth={health} />
    );
  }
  return <Wrapper>{bars}</Wrapper>;
};
