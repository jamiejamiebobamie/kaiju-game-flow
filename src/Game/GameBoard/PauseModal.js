import React from "react";
import styled from "styled-components";
import { BlinkFadeEffect } from 'Components/AvatarSelection';

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  z-index: 1111111111;
  flex-direction: column;
  width: 100%;
  text-align: center;
  align-self: center;
  color: #db974f;
  font-size: 30px;
  font-alignment: center;
  text-stroke: 0.5px #db974f;
  -webkit-text-stroke: 0.5px #db974f;
`;
export const PauseModal = () => {
  return <Wrapper>
    <BlinkFadeEffect>
      Paused
    </BlinkFadeEffect>
  </Wrapper>;
};
