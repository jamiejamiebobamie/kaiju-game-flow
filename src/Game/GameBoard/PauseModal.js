import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  z-index: 1111111111;
  flex-direction: column;
  align-self: center;
  margin-top: 250px;
  margin-left: 120px;
  padding: 30px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  border-color: #64939b;
  color: #64939b;

  font-size: 30px;
  font-alignment: center;
  background-color: #152642;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const PauseModal = () => {
  return <Wrapper>Paused</Wrapper>;
};
