import React from "react";
import styled from "styled-components";

const ContentWrapper = styled.div`
  width: 400px;
  height: 200px;
  margin: 0 0 0 -80px;
  position: absolute;
  z-index: -1;
  overflow: hidden;
  visibility: hidden;
  -webkit-transform: rotate(120deg);
  -moz-transform: rotate(120deg);
  -ms-transform: rotate(120deg);
  -o-transform: rotate(120deg);
  transform: rotate(120deg) scale(0.4) translate(-10px, 120px);
  cursor: pointer;
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
  ${props =>
    props.isHighlighted
      ? "background-image: url(http://placekitten.com/241/241);"
      : null}
  visibility: visible;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
  &:hover {
    background-image: url(http://placekitten.com/242/242);
  }
`;
export const Content = ({ isHighlighted = false, url = "", onClick }) => {
  return (
    <ContentWrapper>
      <ImageWrapper>
        <Image onClick={onClick} url={url} isHighlighted={isHighlighted} />
      </ImageWrapper>
    </ContentWrapper>
  );
};
