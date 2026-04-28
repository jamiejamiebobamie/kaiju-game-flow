import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  ${props =>
    !!props.health
      ? ""
      : "flex-direction: column; margin-left: -10px; text-align: center; font-size: 15px;"}
  ${props =>
    !!props.isTeammate && !props.health && "font-size: 19px;"}
  width: 230px;
  height: 30px;
  justify-content: flex-start;
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
export const HealthBar = ({
  health = 1,
  isTeammate = false
}) => {
  const bars = [];
  for (let i = 0; i < health; i++) {
    bars.push(<Bar key={i} numHealth={health} />);
  }
  return (
    <Wrapper
      health={health}
      isTeammate={isTeammate}
    >
      {health ? bars : "Unalived!"}
    </Wrapper>
  );
};
