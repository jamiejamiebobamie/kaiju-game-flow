import styled from "styled-components";

export const ReplayTitle = styled.div`
  display: flex;
  align-self: center;
  text-alignment: center;
  text-align: center;
  font-alignment: center;
  margin: 5px;
  color: #db974f;
  ${props =>
    props.fontSize !== undefined &&
    `font-size: ${props.fontSize}px !important;`}
`;
export const ReplayModal = styled.div`
  position: absolute;
  z-index: 999999999;
  padding: 0px 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  align-items: center;
  align-content: center;
  // margin-left: 5dvw;
  // margin-top: -5dvw;
  // width: 550px;
  // height: 550px;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-color: #db974f;
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
  ${props =>
    props.fontSize ? `font-size:${props.fontSize}px;` : "font-size:25px;"};
`;
export const ModalMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // margin-bottom: 50px;
  margin: 25px 0px 0px 0px;
  line-height: 40px;
`;
export const StyledImg = styled.img`
  margin: 10px 0px;
  border-radius: 5px;
  border-style: solid;
  border-thickness: thick;
  border-color: #db974f;
  box-shadow: 3px 7px 10px black;
`;