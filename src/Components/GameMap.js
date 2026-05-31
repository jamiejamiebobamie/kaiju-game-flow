import { React } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition-property: opacity;
  transition-duration: 2s;
`;
const BackgroundImage = styled.img`
  position: absolute;
  z-index: -4;
  pointer-events: none;
  background-color: #06080c;
`;
const GameMapDimmer = styled.img`
  position: absolute;
  z-index: -3;
  pointer-events: none;
`;
export const GameMap = ({ isVisible, width, height }) => (
  <Wrapper width={width} height={height} isVisible={isVisible}>
    <GameMapDimmer src={"landDimmer.png"} width={width} height={height} />
    <BackgroundImage src={"map.gif"} width={width} height={height} />
  </Wrapper>
);
