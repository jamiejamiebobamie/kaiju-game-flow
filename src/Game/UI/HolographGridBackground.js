import React from "react";
import styled from "styled-components";
import { BlinkFadeEffect } from 'Components/AvatarSelection';

const Wrapper = styled.div`
    position: absolute:
    z-index: -82;
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

const DisplayTextBox = styled.div`
    position: absolute;
    z-index: -83;
    pointer-events: none;
    transform: translate(${props => props.translation});
    width: ${props => props.width}px;
    height: 500px;

    color: rgb(96 190 96);
    text-stroke: .3px #4488ff;
    -webkit-text-stroke: .3px #4488ff;

    font-size: 20px;
    line-height: 30px;
`;

const DisplayImgBox = styled.div`
    position: absolute;
    z-index: -84;
    transform: translate(${props => props.translation});
    pointer-events: none;
    padding: 10px;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    align-self: center;
    border: 2px solid rgb(94, 255, 94);
    border-radius: 10px;
`;

const DisplayImg = styled.div`
    position: absolute;
    z-index: -83;
    pointer-events: none;

    background: url(${props => props.src});
    background-size: contain;
    background-repeat: no-repeat;

    width: ${props => props.width}px;
    height: ${props => props.height}px;

    color: rgb(94, 255, 94);

`;

export const HolographGridBackground = ({ isVisible, isLeftSide, scale }) => {


  const testTutorialScreens = <BlinkFadeEffect high={100} low={40} time={1}>
    {/* SQUARE IMG */}
    {/* <DisplayImgBox
        width={275}
        height={275}
      >
        <DisplayImg
          width={275}
          height={275}
          src='story_images/match_start.png' />
      </DisplayImgBox> */}


    {/* PORTRAIT IMG */}
    <DisplayImgBox
      translation={'473px, 257px'}
      width={320}
      height={425}
    >
      <DisplayImg
        width={320}
        height={425}
        src='story_images/tutorial_kaiju_warrior.png' />
    </DisplayImgBox>

    {/* left-side caption */}
    <DisplayTextBox translation={'482px, 514px'} width={426}>
      You are a Kaiju Warrior, a cybernetic super soldier
    </DisplayTextBox>

    {/* right-side text block - top */}
    <DisplayTextBox translation={'877px, 41px'} width={224}>
      who has been dipped in radioactive Kaiju fluids or "Kaijuices" to unlock your magic powers!
    </DisplayTextBox>

    {/* right-side text block - bottom */}
    <DisplayTextBox translation={'882px, 325px'} width={224}>
      The procedure has some side effects...
    </DisplayTextBox>
  </BlinkFadeEffect>

  return <Wrapper isVisible={isVisible} isLeftSide={isLeftSide}>
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
    {/* {testTutorialScreens} */}
  </Wrapper >
}
