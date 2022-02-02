import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-self: center;
  align-items: center;
  width: auto;
  height: auto;
  min-width: 700px;
  flex-direction: column;
  align-self: center;
  align-items: center;
  border-radius: 10px;
  border-style: solid;
  border-thickness: thin;
  border-color: #db974f;
  transition: 3s;
`;
export const BackgroundImage = styled.img`
  background-repeat: no-repeat;
  margin-bottom: 30px;
  border-radius: 5px;
  border-style: solid;
  border-thickness: thick;
  border-color: #db974f;
`;
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  height: 50px;
  transform: scale(1.2, 1.5);
  margin-top: 25px;
  margin-bottom: 25px;
  margin-left: 50px;
  margin-right: 50px;
`;
export const ButtonsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  /* height: 100px; */
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
export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* width: 90%; */
  padding-left: 50px;
  padding-right: 50px;

  height: 130px;
  /* background-color: #614324; */
  /* border-radius: 3px;
  border-style: none;
  border-thickness: thin; */
`;
export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  font-size: 20px;
  text-align: center;
  text-stroke: 0.5px black;
  -webkit-text-stroke: 0.5px black;
  color: #64939b;
  /* color: #621d75; */
  color: #db974f;
  /* color: #376e5b; */
`;
export const StyledIcon = styled.i`
  display: flex;
  align-self: center;
  width: 50px;
  height: 50px;
  transform: scale(2);
  pointer-events: none;
  color: ${props => props.color};
`;
