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
  border-color: #64939b;
`;
export const ButtonsWrapper = styled.div`
  position: absolute;
  display: flex;
  bottom: 75px;
  justify-content: space-around;
  width: 100%;
  height: 100px;
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
  border-color: #64939b;
  color: #64939b;

  &:hover {
    border-bottom: 3px solid;
    transform: translate(0px, 3px);
  }
  font-size: 20px;
`;
export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 130px;
`;
export const Title = styled.div`
  display: flex;
  justify-content: center;
  align-self: center;
  font-size: 20px;
  text-align: center;
  color: #64939b;
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
