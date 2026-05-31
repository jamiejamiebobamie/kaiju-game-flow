import React from "react";
import styled from "styled-components";
import { BlinkFadeEffect } from 'Components/AvatarSelection';

const Wrapper = styled.div`
    position: absolute:
    z-index: -84;
    ${props => props.isLeftSide && `transform: translate(-545px, 3px) scale(1.2, 1);`}
    opacity: ${props => props.isVisible ? 1 : 0};
    transition-duration: 2s;
    transition: opacity;
`;

const HolographGridPart = styled.div`
  position: absolute;
  z-index: -85;

  pointer-events: none;
  background: url(${props => props.src});
  transform: scale(0.78, 0.84) translate(518px, -87px);
  
  width: 478px;
  height: 876px;

  filter: drop-shadow(0px 0px 1px rgb(94, 255, 94))  blur(2px);
  border: solid rgb(94, 255, 94) .25px;

`;

export const HolographGridBackground = ({ isVisible, isLeftSide, scale }) => (
    <Wrapper isVisible={isVisible} isLeftSide={isLeftSide}>
        <BlinkFadeEffect high={49} low={10} time={700}>
            <BlinkFadeEffect high={100} low={30} time={400}>
                <HolographGridPart src="GameUI_Pieces/HolographGrid1.png" />
            </BlinkFadeEffect>
            <BlinkFadeEffect high={100} low={30} time={500}>
                <HolographGridPart src="GameUI_Pieces/HolographGrid2.png" />
            </BlinkFadeEffect>
            <BlinkFadeEffect high={100} low={30} time={700}>
                <HolographGridPart src="GameUI_Pieces/HolographGrid3.png" />
            </BlinkFadeEffect>
            <BlinkFadeEffect high={100} low={30} time={600}>
                <HolographGridPart src="GameUI_Pieces/HolographGrid4.png" />
            </BlinkFadeEffect>
        </BlinkFadeEffect>
    </Wrapper>);