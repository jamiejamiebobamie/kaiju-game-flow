import React from "react";
import styled from "styled-components";

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
  ${props =>
    props.isHighlighted0 &&
    (props.isPlayer !== 0 || props.isPlayer !== 1) &&
    "background-color: #495a6e;opacity: 0.5;"};
  ${props =>
    props.isKaiju &&
    (props.isPlayer !== 0 || props.isPlayer !== 1) &&
    "background-color: #BF40BF; opacity: 0.5;"};
  ${props =>
    props.isPlayer === 0
      ? "background-color: #495a6e;opacity: .7;"
      : props.isPlayer === 1
      ? "background-color: #FFA836;opacity: .3;"
      : null};
`;
export const Content = ({
  isHighlighted0 = false,
  onClick,
  index,
  setHoverRef,
  status
}) => {
  const { i, j } = index;
  return (
    <ContentWrapper>
      <ImageWrapper>
        <Image
          ref={setHoverRef(`${i} ${j}`)}
          onClick={onClick}
          isKaiju={status.isKaiju}
          isHighlighted0={isHighlighted0}
          isPlayer={status.isPlayer}
        />
      </ImageWrapper>
    </ContentWrapper>
  );
};
