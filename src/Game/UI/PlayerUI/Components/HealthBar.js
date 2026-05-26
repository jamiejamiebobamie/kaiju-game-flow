import React from "react";
import styled from "styled-components";
import { BlinkFadeEffect } from 'Components/AvatarSelection';

const Wrapper = styled.div`
  display: flex;
  ${props =>
    !!props.health
      ? "margin-left: 5px;"
      : "flex-direction: column; margin-left: -10px; text-align: center; font-size: 15px;"}
  ${props =>
    !!props.isTeammate && !props.health && "font-size: 19px;"}
  width: 220px;
  height: 30px;
  justify-content: flex-start;
`;
const Bar = styled.div`
  ${props =>
    props.numHealth < 5
      ? "min-width: 20%; width: 20%;"
      : "min-width: 15%; width: 15%;"};
  height: 15px;
  min-height: 10px;
  margin-left: 10px;
  align-self: center;
  border-radius: 30px;
  background: linear-gradient(45deg, #d22b2b, #880808);
  margin: 5px;
`;
export const HealthBar = ({
  health = 1,
  isTeammate = false
}) => {
  const bars = Array(health).fill(0).map((_, i) => <Bar key={i} numHealth={health} />)
  return (
    <BlinkFadeEffect>
      <Wrapper
        health={health}
        isTeammate={isTeammate}
      >
        {health ? bars : "Deceased!"}
      </Wrapper>
    </BlinkFadeEffect>

  );
};
