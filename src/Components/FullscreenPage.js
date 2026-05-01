import React from "react";
import styled from "styled-components";
import {
    ButtonsWrapper,
    Button,
    ButtonGroup,
    ButtonOutline,
} from "Tutorial/Components/StyledComponents";

const Wrapper = styled.div`
  position: absolute;
  z-index: 999999999;

  display: flex;
  justify-content: space-between;
  align-self: center;
  align-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  max-width: 1400px;
//   max-width: 2200px;
  max-height: 1100px;

  background-color: #152642;

  -webkit-animation-duration: 1s;
  animation-duration: 1s;

  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    10% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ImgWrapper = styled.div`
    display: flex;
    margin-left: 3%;
    // width: fit-content;
    flex-direction: column;
    max-width: 1000px;

    justify-content: flex-start;
`;

const ContentWrapper = styled.div`
    // display: flex;
    // margin-right: 5%;
    // width: fit-content;
    // align-self: flex-end;
    // align-items: center;
    // height: 80%;
    // flex-direction: column;
    // max-width: 1000px;
    // justify-content: space-around;
    // margin-bottom: 50px;


    // match screen:

    display: flex;
    margin-right: 5%;
    width: fit-content;
    align-self: center;
    -webkit-box-align: center;
    align-items: center;
    height: fit-content;
    flex-direction: column;
    max-width: 1000px;
    justify-content: space-around;
    margin-bottom: 50px;
`;

const HomeButtonWrapper = styled.div`
    display: flex;
    width: 400px;
    alignSelf: flex-start;
    margin: -45px 0px 0px 0px;
`;

const StyledImg = styled.img`
    max-height: 70dvh;
    max-width: 600px;
    object-fit: contain;
    ${props => `aspect-ratio: ${props.width} / ${props.height};`}
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //   margin: 25px 0px 0px 0px; <-- original
margin: 25px 0px 30px 0px;
  //     margin: 25px 0px 30px 0px; <-- double on match screen
  //     margin: 25px 50px; <-- single on match screen
  line-height: 60px;
  max-width: 700px;
`;

const StyledText = styled.div`
  display: flex;
  align-self: flex-start;
//   align-self: center;
//   text-alignment: center;
//   text-align: center;
//   font-alignment: center;
  margin: 5px;
  color: #db974f;
  ${props =>
        props.fontSize !== undefined &&
        `font-size: ${props.fontSize}px !important;`}
`;

export const FullscreenPage = ({ text, buttons, image, homeButtonOnClick = undefined }) => {
    const homeButton = homeButtonOnClick ? 
    <HomeButtonWrapper>
        <ButtonGroup style={{ marginLeft: "0px" }}>
            <ButtonsWrapper>
                <Button
                    onClick={homeButtonOnClick}
                >
                    <ButtonOutline zIndex={1} />
                    Home
                </Button>
            </ButtonsWrapper>
        </ButtonGroup>
    </HomeButtonWrapper> : null;

    return <Wrapper>
        <ImgWrapper>
            {homeButton}
            <StyledImg src={image.src} width={image.width} height={image.height} />
        </ImgWrapper>
        <ContentWrapper>
            <TextWrapper>
                {text.map(t => <StyledText fontSize={22}>{t}</StyledText>)}
            </TextWrapper>
            {<ButtonGroup>
                {buttons.map(b => <ButtonsWrapper>
                    <Button onClick={b.onClick}>
                        <ButtonOutline zIndex={1} />
                        {b.text}
                    </Button>
                </ButtonsWrapper>)}
            </ButtonGroup >}
        </ContentWrapper>
    </Wrapper>
}