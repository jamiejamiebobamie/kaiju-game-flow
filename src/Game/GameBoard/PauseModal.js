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
  padding: 15px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  border-color: #db974f;
  color: #db974f;
  font-size: 30px;
  font-alignment: center;
  background-color: #152642;
  text-stroke: 0.5px #db974f;
  -webkit-text-stroke: 0.5px #db974f;
`;
export const PauseModal = () => {
  return <Wrapper>Paused</Wrapper>;
};
