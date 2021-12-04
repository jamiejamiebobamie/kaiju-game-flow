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
  ${props => (props.isWooded ? "background-image: url(ivy_icon.png);" : null)}
  ${props =>
    props.isOnFire
      ? "background-image: url(fire_icon.png);"
      : null}
  visibility: visible;
  -webkit-transform: rotate(-60deg);
  -moz-transform: rotate(-60deg);
  -ms-transform: rotate(-60deg);
  -o-transform: rotate(-60deg);
  transform: rotate(-60deg);
  ${props =>
    props.isHighlighted ? "background-color: red;opacity: 0.3;" : null}
  &:hover {
    background-color: red;
    opacity: 0.3;
  }
`;
export const Content = ({
  isHighlighted = false,
  onClick,
  isOnFire,
  isWooded
}) => {
  return (
    <ContentWrapper>
      <ImageWrapper>
        <Image
          onClick={onClick}
          isHighlighted={isHighlighted}
          isOnFire={isOnFire}
          isWooded={isWooded}
        />
      </ImageWrapper>
    </ContentWrapper>
  );
};
// isHighlighted: for highlighting adjacent tiles of a clicked Kaiju.
