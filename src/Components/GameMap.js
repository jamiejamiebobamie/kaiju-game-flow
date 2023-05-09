import { React } from "react";
import styled from "styled-components";

const Border = styled.div`
  ${props => props.styles}
`;
const Wrapper = styled.div`
  ${props => props.styles}
`;
const BackgroundImage = styled.img`
  position: absolute;
  z-index: -4;
  pointer-events: none;
  background-color: #06080c;
  // opacity: 0.5;
`;
const GameMapDimmer = styled.img`
  position: absolute;
  z-index: -3;
  pointer-events: none;
  // background-color: black;
  opacity: 0.5;
  // width: 100%;
  // height: 100%;
`;
export const GameMap = ({ isTutorial, borderStyles, mapStyles }) => {
  return (
    <Border styles={borderStyles}>
      <Wrapper styles={mapStyles}>
        <BackgroundImage src={"map.gif"} width={500} />
        {!isTutorial && <GameMapDimmer src={"landDimmer.png"} width={500} />}
      </Wrapper>
    </Border>
  );
};
