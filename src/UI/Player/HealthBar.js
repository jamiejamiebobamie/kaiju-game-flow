import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  overflow: scroll;
  justify-content: flex-start;
  width: 70%;
  height: 50px;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
`;

const Bar = styled.div`
  background-color: ${props => (props.isWraith ? "green" : "red")};
  width: 60px;
  min-width: 60px;
  height: 15px;
  min-height: 10px;
  margin-left: 10px;
  align-self: center;
  border-radius: 30px;
`;

export const HealthBar = ({ setDisplayString, health = 6 }) => {
  const [hoverRef, isHovered] = useHover();
  useEffect(
    () => (isHovered ? setDisplayString("test") : setDisplayString(null)),
    [isHovered]
  );
  const bars = [];
  for (let i = 0; i < health; i++) {
    bars.push(<Bar isWraith={i > 2} />);
  }
  return <Wrapper>{bars}</Wrapper>;
};
