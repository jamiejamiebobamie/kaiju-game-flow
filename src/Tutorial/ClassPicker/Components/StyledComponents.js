import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  padding-top: 30px;
  display: flex;
  margin-top: 5vh;
  width: 750px;
  height: 900px;
  min-width: 700px;
  min-height: 800px;
  flex-direction: column;
  align-self: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-radius: 10px;
  ${props =>
    props.animName &&
    `-webkit-animation-duration: 3s;
    animation-duration: 3s;
    -webkit-animation-name: ${props.animName};
    animation-name:  ${props.animName};`}
  @keyframes fadeInLeft {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }
    10% {
      opacity: 0;
      transform: translateX(-20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes fadeInRight {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    10% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
export const ButtonsWrapper = styled.div`
  position: absolute;
  display: flex;
  bottom: 75px;
  justify-content: space-around;
  width: 100%;
  height: 100px;
  /* background-color: red; */
  /* padding-bottom: 100px; */
`;
export const Button = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center;

  min-width: 150px;
  height: 50px;
  right: 30px;
  bottom: 30px;

  font-alignment: center;
  text-align: center;

  cursor: pointer;

  border-radius: 5px;
  border-style: solid;
  border-thickness: thin;
  border-bottom: 5px solid;
  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 20px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 130px;
  /* background-color: green; */
`;
export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  /* padding: 50px; */
  /* height: 100%; */
  font-size: 20px;
  text-align: center;
  color: black;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const StyledIcon = styled.i`
  display: flex;
  align-self: center;
  width: 50px;
  height: 50px;
  transform: scale(2);
  /* translate(19px, 15px); */
  pointer-events: none;
  color: ${props => props.color};
  /* color: black; */
`;
