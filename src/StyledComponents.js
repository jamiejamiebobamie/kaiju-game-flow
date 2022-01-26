import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  align-items: center;
  width: 750px;
  height: 900px;
  min-width: 700px;
  min-height: 800px;
  margin-top: 5vh;
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
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
export const Title = styled.div`
  font-size: 40px;
  border-color: #64939b;
  color: #64939b;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
  margin-bottom: 100px;
`;
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 500px;
`;
export const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 50px;
`;
export const Button = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  margin-bottom: 100px;
  width: 250px;
  min-width: 200px;
  height: 100px;

  font-alignment: center;
  cursor: pointer;

  border-radius: 5px;
  border-style: solid;
  border-thickness: thin;
  border-bottom: 5px solid;
  border-color: #64939b;
  color: #64939b;
  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 25px;
  font-family: gameboy;
  @font-face {
    font-family: gameboy;
    src: url(Early_GameBoy.ttf);
  }
`;
export const StyledIcon = styled.i`
  margin-top: 3px;
  margin-left: 5px;
  border-color: #64939b;
  color: #64939b;
`;
