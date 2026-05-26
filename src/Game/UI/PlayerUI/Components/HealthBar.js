import React from "react";
import styled from "styled-components";
import { BlinkFadeEffect } from 'Components/AvatarSelection';

const Wrapper = styled.div`
  display: flex;
  ${props =>
    !!props.health
      ? "margin-left: 5px;"
      : "flex-direction: column; margin-left: -10px; text-align: center; font-size: 15px; color: rgb(113, 255, 113); -webkit-text-stroke: 0.5px rgb(113, 255, 113);"}
  ${props =>
    !!props.isTeammate && !props.health && "font-size: 19px;"}
  ${props =>
    !props.isTeammate && !props.health && "line-height: 35px;"}

      ${props =>
    !!props.isTeammate && !!props.health && "margin-bottom: 5px;"}

    
  width: 220px;
  height: 30px;
  justify-content: flex-start;
`;
const Bar = styled.div`
  ${props =>
    (props.health + props.healthModifier) < 5
      ? "min-width: 20%; width: 20%;"
      : "min-width: 15%; width: 15%;"};
  height: 15px;
  min-height: 10px;
  margin-left: 10px;
  align-self: center;
  border-radius: 30px;
  background: linear-gradient(45deg, #d22b2b, #880808);
  margin: 5px;

  ${props =>
    !!props.isTeammate && !!props.health && "margin: 10px 5px 5px 5px;"}

  ${props => props.healthModifier > 0 
              && ((props.index + 1) > props.health) ?
                'background: linear-gradient(45deg, #2bd24aff, #065d1cff);' 
                : props.healthModifier < 0
                    && ((props.health + props.healthModifier) < 0 || (props.index + 1) > props.health + props.healthModifier) ?
                  `background: linear-gradient(45deg, #dfdfdfff, #c8c8c8ff);;  border-radius: 10px; border-style: solid; border-thickness: thin; border-color: #000;`
              : ''}  
`;
export const HealthBar = ({
  health = 0,
  isTeammate = false,
  healthModifier
}) => {
  const bars = Array(healthModifier > 0 ? health + healthModifier : health).fill(0).map((_, i) => <Bar key={i} index={i} health={health} healthModifier={healthModifier} isTeammate={isTeammate} />)
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
