import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  display: flex;
  z-index: 1111111111;
  flex-direction: column;
  width: 100%;
  text-align: center;
  align-self: center;
  margin-top: 250px;
  padding: 15px 0px;
  // margin-left: 120px;
  // border-style: solid;
  border-thickness: thin;
  border-top-style: dashed;
  border-bottom-style: dashed;
  border-right-style: none;
  border-left-style: none;
  // border-radius: 10px;
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
