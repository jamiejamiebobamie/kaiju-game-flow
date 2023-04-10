import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  align-items: center;
  width: 750px;
  min-width: 750px;
  height: 900px;
  min-height: 800px;
  ${props =>
    props.scale &&
    props.translate &&
    `transform: ${props.scale} ${props.translate}; cursor:pointer;`};
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
  width: 200px;
  min-width: 200px;
  height: 19.5px;
  margin-top: -0.5px;
  pointer-events: none;
  border-radius: 3px;
  border: 0.75px solid black;
  border-right: 0.3px solid black;
  border-left: 0.3px solid black;
  border-bottom: 0.5px solid black;
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
  color: #5a8a7a;
  transform: scale(1.2, 1);
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
  /* isDescription */
  ${props =>
    props.isDescription &&
    `margin-left: 120px; transform: scale(1.2); margin-top: -75px;
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
    -webkit-animation-name: fadeInLogo;
    animation-name: fadeInLogo;
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
  }`}
`;
export const StyledSpookyText = styled.p`
  font-family: green_fuz;
  font-size: 90px;
  -webkit-text-fill-color: transparent;

  filter: drop-shadow(0 0 0.2rem purple);
  color: black;

  -webkit-text-stroke: 1.1px purple;

  ${props =>
    props.isDescription &&
    "-webkit-text-stroke: 1px purple; filter: drop-shadow(0 0 0.2rem purple);"}
`;
export const StyledSciFiText = styled.p`
  font-family: Metro;
  margin-top: -110px;
  font-size: 43px;
  color: #621d75;
  text-stroke: 1px black;
  -webkit-text-stroke: 1px black;
  filter: drop-shadow(3px 3px 1px black);
`;

export const StyledSpookyTextShadow = styled.p`
  position: absolute;
  z-index: -1;
  font-family: green_fuz;
  font-size: 90px;
  margin-top: -191px;
  color: black;
`;
export const StyledSciFiTextShadow = styled.p`
  position: absolute;
  z-index: -1;
  font-family: Metro;
  margin-top: -101px;
  font-size: 43px;
  text-shadow: 3px 6px;
  color: black;
`;
export const StyledStaticLogo = styled.img`
  cursor: pointer;
  // margin-left: 30px;
  width: 400px;
`;
