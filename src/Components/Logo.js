import React, { useState } from "react";
import styled from "styled-components";
import {
  Title,
  StyledSpookyText,
  StyledSciFiText,
  StyledSpookyTextShadow
} from './StyledComponents'
import "App.css";

const LogoWrapper = styled.div`
  position: absolute;
  display: flex;
  align-self: center;
  flex-direction: column;

  width: 700px;
  height: 350px;

  margin-top: -370px;
`;

const LogoImage = styled.img`

  pointer-events: none;
  position: absolute;
  z-index: 9;
  display: flex;

  align-self: center;

  ${props => `src: ${props.src};`}

    justify-content: space-between;
    width: 600px;
    height: 300px;

  -webkit-animation-duration: 3s;
  animation-duration: 3s;

  @keyframes fadeInLogo {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const KaijuWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  ${props => `z-index: ${props.isReversed ? 7 : 8};`}
  // transform: scale(2.7) translate(245px, 68px);
  // transform: scale(2) translate(310px, 80px);
  filter: drop-shadow(rgb(191, 64, 191) 0px 0px 1px);

  ${props => `animation: ${props.isReversed ? 'fadeKaijuWalk_reversed' : 'fadeKaijuWalk'} cubic-bezier(0, .2, .3, .2) 25s infinite;`} // 25s

  /*
    500 ms -> a step... 1 sec

    250px -> distance

    25s -> total anim time
  */

  @keyframes fadeKaijuWalk {
    0% {
      opacity: 0;
      transform: scale(2.7) translate(10px, 67px);
    }
    5%{
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90%{
      opacity: 1;
    }
    95% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: scale(2.7) translate(290px, 67px);
    }
}

  @keyframes fadeKaijuWalk_reversed {
    0% {
      opacity: 0;
      transform: scale(-2.7, 2.7) translate(-290px, 68px);
    }
    5%{
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90%{
      opacity: 1;
    }
    95% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: scale(-2.7, 2.7) translate(-32px, 68px);
    }
}

`;

/*
    filter: drop-shadow(rgb(191, 64, 191) 0px 0px 20px);

        filter: drop-shadow(salmon 0px 0px 2px);


*/

const SpriteSheet = styled.div`
  pointer-events: none;
  display: ${props => (props.lives > 0 ? "flex" : "none")};

  background-color: #101c30;
  
  -webkit-mask-image: url('spritesheet/kaiju_sprite.png');
  mask-image: url('spritesheet/kaiju_sprite.png');

    // mask-repeat: no-repeat;
    // -webkit-mask-repeat: no-repeat;

  



  transform: scale(0.4) translate(-130px, -165px);
  height: 230.2px;
  width: 153px;

  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition: -webkit-transform 3s ease-in-out;
  ${props => `animation: ${props.anim} 5s steps(10) infinite;`};


    @keyframes upRight {
    0% {
      -webkit-mask-position: -152px 0px; 
      mask-position: -152px 0px;
    }
  
    100% {
      -webkit-mask-position: -1682px 0px; 
      mask-position: -1682px 0px;
    }
  }


  @keyframes up {
    0% {
      -webkit-mask-position: -152px 220px; 
      mask-position: -152px 220px;
    }
    100% {
    -webkit-mask-position: -1682px 220px; 
      mask-position: -1682px 220px;
    }
  }

  @keyframes upLeft {
    0% {
    -webkit-mask-position: -152px 440px; 
    mask-position: -152px 440px;
    }
    100% {
      -webkit-mask-position: -1682px 440px; 
      mask-position: -1682px 440px;
    }
  }

  @keyframes downLeft {
    0% {
      -webkit-mask-position: -152px 660px; 
      mask-position: -152px 660px;

    }
    100% {
      -webkit-mask-position: -1682px 660px; 
      mask-position: -1682px 660px;
    }
  }

  @keyframes down {
    0% {
      -webkit-mask-position: -152px 880px; 
      mask-position: -152px 880px;
    }
    100% {
      -webkit-mask-position: -1682px 880px; 
      mask-position: -1682px 880px;
    }
  }

  @keyframes downRight {
    0% {
      -webkit-mask-position: -152px 1100px; 
      mask-position: -152px 1100px;
    }
    100% {
      -webkit-mask-position: -1682px 1100px; 
      mask-position: -1682px 1100px;
    }
  }

  @keyframes idleupRight {
    from {
      background-position-x: 0px;
      background-position-y: 0px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 0px;
    }
  }
  @keyframes idleup {
    from {
      background-position-x: 0px;
      background-position-y: 220px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 220px;
    }
  }
  @keyframes idleupLeft {
    from {
      background-position-x: 0px;
      background-position-y: 440px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 440px;
    }
  }
  @keyframes idledownLeft {
    from {
      background-position-x: 0px;
      background-position-y: 660px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 660px;
    }
  }
  @keyframes idledown {
    from {
      background-position-x: 0px;
      background-position-y: 880px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 880px;
    }
  }
  @keyframes idledownRight {
    from {
      background-position-x: 0px;
      background-position-y: 1100px;
    }
    to {
      background-position-x: 0px;
      background-position-y: 1100px;
    }
  }
`;

export const Logo = () => {

  const ANIMS = [
    'upRight',
    'up',
    'upLeft',
    'downLeft',
    'down',
    'downRight',
    'idleupRight',
    'idleup',
    'idleupLeft',
    'idledownLeft',
    'idledown',
    'idledownRight',
  ]

  const [currIndex, setCurrIndex] = useState(0);




  return <LogoWrapper 
    // onClick={() => setCurrIndex(i => i + 1 < ANIMS.length ? i += 1 : 0)}
    >
    <Title isDescription={false}>
      <StyledSpookyText isDescription={true}>Kaiju</StyledSpookyText>{" "}
      <StyledSciFiText>City</StyledSciFiText>
      <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
    </Title>
    <LogoImage src={"./SVG_logo.svg"} />

    {/* testing */}
    <KaijuWrapper>
      <SpriteSheet lives={1} anim={ANIMS[currIndex]} dropShadowSize={1} />
    </KaijuWrapper>
    {/* <KaijuWrapper isReversed={true}>
      <SpriteSheet lives={1} anim={ANIMS[currIndex]} dropShadowSize={1} />
    </KaijuWrapper> */}
    {/* testing */}


  </LogoWrapper>
};