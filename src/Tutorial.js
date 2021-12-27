import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

const TutorialWrapper = styled.div`
  display: flex;
  width: 700px;
  height: 800px;
  min-width: 700px;
  min-height: 800px;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  align-items: center;
`;
const TutorialGameBoard = styled.div`
  width: 100%;
  height: 450px;
  background-color: green;
`;
const TutorialInstructions = styled.div`
  width: 100%;
  height: 200px;
  background-color: pink;
`;
const TutorialOverlay = styled.div`
  width: 100%;
  height: 150px;
  background-color: blue;
`;
export const Tutorial = () => {
  return (
    <TutorialWrapper>
      <TutorialOverlay />
      <TutorialGameBoard />
      <TutorialInstructions />
    </TutorialWrapper>
  );
};
