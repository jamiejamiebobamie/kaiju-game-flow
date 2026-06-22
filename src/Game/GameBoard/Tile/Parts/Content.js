import React, { useContext } from "react";
import styled from "styled-components";
import { GlobalSettingsContext } from 'Home';

const ContentWrapper = styled.div`
  width: 400px;
  height: 200px;
  margin: 0 0 0 -80px;
  position: absolute;
  cursor: pointer;
  z-index: -1;
  overflow: hidden;
  visibility: hidden;
  -webkit-transform: rotate(120deg);
  -moz-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  -o-transform: rotate(120deg);
  transform: rotate(120deg) scale(0.4) translate(-10px, 120px);
`;
const ImageWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
`;


const determineBackgroundColor = props => {
  switch(true){
    // case (props.playerGender == "guy" || props.playerGender == "girl"):
    //   return props.playerGender == "guy"
    //   ? "background-color: #55AAff; opacity: .4;" // guy
    //   : "background-color: salmon; opacity: .4;" // girl
    // case !!props.isKaiju:
    //   return "background-color: #BF40BF; opacity: .4;" // kaiju
    // case !!props.isHighlighted0 && props.selectedAvatar == 'guy':
    //   return "background-color: #55AAff; opacity: .4; transition: background-color; transition-duration: 1s;" // player highlight as guy
    // case !!props.isHighlighted0 && props.selectedAvatar == 'girl':
    //   return "background-color: salmon; opacity: .4; transition: background-color; transition-duration: 1s;" // player highlight as girl
    case !!props.isHighlighted0:
      return "background-color: #d2d3b2; opacity: .4; transition: background-color; transition-duration: 1s;" // player highlight as guy 
    case !!props.color:
      return `background-color: ${props.color}; opacity: .2;` // status color
    default:
      return `background-color: transparent; opacity: .2;` // transparent
  }
}

/*
  ${props => props.color
    ? `background-color: ${props.color}; opacity: .2;`
    : `${props.isTutorial
      ? "background-color: #db974f; opacity: 0.1;"
      : !props.isVisible
        ? 'background-color: #80EF80; opacity: .1;'
        : "background-color: lightgrey; opacity: .1;"
    }`}
  ${props =>
    props.isHighlighted0 && !props.playerGender &&
    `background-color: ${props.selectedAvatar == "guy" ? "#55AAff" : "salmon"}; opacity: .4;`} // player1
  ${props =>
    props.isKaiju &&
    !props.playerGender &&
    "background-color: #BF40BF; opacity: .4;"}; // kaiju
  ${props =>
    props.playerGender == "guy"
      ? "background-color: #55AAff; opacity: .4;" // player1
      : props.playerGender == "girl"
        ? "background-color: salmon; opacity: .4;" // player2
        : null};
*/

const Image = styled.div`
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 50%;
  visibility: visible;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
  ${props => determineBackgroundColor(props)};
`;
export const Content = ({
  isHighlighted0 = false,
  onClick,
  index,
  setHoverRef,
  // status,
  color,
  isTutorial,
  isVisible
}) => {
  const { i, j } = index;
  const { selectedAvatar } = useContext(GlobalSettingsContext);

  return (
    <ContentWrapper>
      <ImageWrapper>
        <Image
          ref={isTutorial ? setHoverRef(`${i} ${j} `) : undefined}
          onClick={isTutorial ? onClick : undefined}
          // isKaiju={status.isKaiju}
          isHighlighted0={isHighlighted0}
          selectedAvatar={selectedAvatar}
          // playerGender={status.playerGender}
          color={color}
          isVisible={isVisible}
        />
      </ImageWrapper>
    </ContentWrapper>
  );
};
