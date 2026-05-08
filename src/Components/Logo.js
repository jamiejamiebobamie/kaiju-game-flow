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
  }
`;

const KaijuWrapper = styled.div`
  pointer-events: none;

  position: absolute;
  z-index: 8;

  filter: drop-shadow(rgb(191, 64, 191) 0px 0px 1px);

  animation: fadeKaijuWalk linear 60s infinite;

  @keyframes fadeKaijuWalk {
    0% {
      opacity: 0;
      transform: scale(2.7) translate(10px, 67px);
    }
    8.5%{
      opacity: 0;
    }
    13% {
      opacity: 1;
    }
    41.5%{
      opacity: 1;
    }
    44% {
      opacity: 0;
    }
    50% {
      opacity: 0;
      transform: scale(2.7) translate(290px, 67px);
    }
    51% {
      opacity: 0;
      transform: scale(-2.7, 2.7) translate(-240px, 67px);
    }
    64.5%{
      opacity: 0;
    }
    69% {
      opacity: 1;
    }
    91.5%{
      opacity: 1;
    }
    94% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: scale(-2.7, 2.7) translate(80px, 67px);
    }  
  }
  
`;


const SpriteSheet = styled.div`
  pointer-events: none;
  display: flex;

  background-color: #101c30;
  
  -webkit-mask-image: url('spritesheet/kaiju_sprite.png');
  mask-image: url('spritesheet/kaiju_sprite.png');

  transform: scale(0.4) translate(-130px, -165px);
  height: 230.2px;
  width: 153px;

  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  -webkit-transition: -webkit-transform 3s ease-in-out;

  animation: upRight 5s steps(10) infinite;

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
`;

export const Logo = () => (<LogoWrapper>
  <Title isDescription={false}>
    <StyledSpookyText isDescription={true}>Kaiju</StyledSpookyText>{" "}
    <StyledSciFiText>City</StyledSciFiText>
    <StyledSpookyTextShadow>Kaiju</StyledSpookyTextShadow>{" "}
  </Title>
  <LogoImage src={"./SVG_logo.svg"} />
  <KaijuWrapper >
    <SpriteSheet />
  </KaijuWrapper>
</LogoWrapper>);