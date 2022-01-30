import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  align-items: center;
  width: 750px;
  height: 900px;
  min-width: 750px;
  min-height: 800px;
  margin-top: 150px;
  -webkit-animation-duration: 3s;
  animation-duration: 3s;
  -webkit-animation-name: fadeInUp;
  animation-name: fadeInUp;
  /* background-color: green; */
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

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  width: 500px;
  height: 200px;
  margin-top: 25px;
  transform: scale(1.2, 1.5);
  /* background-color: red; */
`;
export const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100px;
`;
export const Button = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  /* margin-bottom: 100px; */
  width: 200px;
  min-width: 200px;
  height: 20px;

  font-alignment: center;
  cursor: pointer;

  border-radius: 5px;
  border-style: solid;

  border: 3px solid #5a8a7a;
  border-bottom: 5px solid #5a8a7a;
  color: #5a8a7a;
  filter: drop-shadow(0px 3px 1px black);

  &:hover {
    border-bottom: 3px solid #5a8a7a;
    transform: translate(0px, 3px);
    filter: drop-shadow(0px 0px 0px black);
  }

  font-size: 15px;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  background-color: #376e5b;
`;
export const ButtonOutline = styled.div`
  position: absolute;
  z-index: ${props => props.zIndex};
  /* display: flex;
  align-self: center;
  justify-content: center;
  margin-bottom: 100px; */
  /* margin-left: 150px; */
  width: 200px;
  min-width: 200px;
  height: 19.5px;
  margin-top: -0.5px;

  /* font-alignment: center;
  cursor: pointer; */
  pointer-events: none;

  border-radius: 3px;
  /* border-style: solid; */
  /* border-thickness: thin; */
  /* border: 3px solid #785391;
  border-bottom: 5px solid #785391;
  color: #621d75; */
  /*
  border: 3px solid #64939b;
  border-bottom: 5px solid #64939b;
  color: #64939b;
  &:hover {
    border-bottom: 3px solid #64939b;
    transform: translate(0px, 3px);
  } */
  /* border-color: #376e5b; */
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;

  /* border-bottom: 5px solid #5a8a7a; */
  /* color: #5a8a7a; */
  /* &:hover { */
  /* border-bottom: 3px solid #5a8a7a; */
  /* transform: translate(0px, 3px); */
  /* } */

  /* border-left: 3px solid #785391;
  border-right: 3px solid #785391; */
  /* border-bottom: 5px solid #785391; */
  /* border-color: #785391; */
  /* color: #785391; */

  /* background-color: black; */

  /* background: -webkit-linear-gradient(#785391, #64939b); */
  /* -webkit-background-clip: text; */

  /* &:hover {
    border-bottom: 3px solid #785391;
    transform: translate(0px, 3px);
  } */
  /* font-size: 25px;
  text-stroke: 0.75px black;
  -webkit-text-stroke: 0.75px black; */
  /* filter: drop-shadow(0 0 0.1rem #376e5b); */
`;
export const StyledLink = styled.a`
  border-color: #5a8a7a;
  color: #5a8a7a;
  /* color: #64939b; */
  text-decoration: none;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
`;
export const StyledIcon = styled.i`
  margin-left: 5px;
  /* margin-right: 20px; */
  /* margin-left: 5px; */
  /* border-color: 785391; */
  /* color: #785391; */
  color: #5a8a7a;
  transform: scale(1.2, 1);

  /* 64939b */
  /* textstroke: 0px black;
  -webkit-text-stroke: 0px black; */
`;
export const Title = styled.div`
  position: relative;
  font-size: 40px;
  border-color: #64939b;
  color: #64939b;
  margin-bottom: 100px;
  transform: scale(1.5);
  margin-top: -300px;
  pointer-events: none;
`;
export const StyledSpookyText = styled.p`
  font-family: green_fuz;
  font-size: 90px;
  /* text-shadow: 2px 2px; */

  /* background: -webkit-linear-gradient(green, #f6ffd4); */
  /* -webkit-background-clip: text; */
  -webkit-text-fill-color: transparent;

  filter: drop-shadow(0 0 0.2rem purple);
  color: black;

  /* text-stroke: 5px purple; */
  -webkit-text-stroke: 1.1px purple;
`;
export const StyledSciFiText = styled.p`
  font-family: Metro;
  margin-top: -110px;
  font-size: 43px;
  color: #621d75;
  /* color: black; */

  /* Width and color values */
  text-stroke: 1px black;
  -webkit-text-stroke: 1px black;
`;

export const StyledSpookyTextShadow = styled.p`
  position: absolute;
  z-index: -1;
  font-family: green_fuz;
  font-size: 90px;
  margin-top: -190px;
  text-shadow: 3px 6px;
  color: black;
  filter: drop-shadow(0px 3px 1px black);

  /* -webkit-text-stroke: 2px black; */
  /* margin-left: -5px; */
`;
export const StyledSciFiTextShadow = styled.p`
  position: absolute;
  z-index: -1;
  font-family: Metro;
  margin-top: -101px;
  font-size: 43px;
  text-shadow: 3px 6px;
  color: black;
  /* Width and color values */
  filter: drop-shadow(0px 3px 1px black);
`;
export const TestSilo = styled.img`
  position: absolute;
  pointer-events: none;
  ${props => `z-index:${props.zIndex}; left: ${props.x}px; top:${props.y}px;`};
  ${props => ` transform: scale(${props.scaleX}, ${props.scaleY});`};
`;
