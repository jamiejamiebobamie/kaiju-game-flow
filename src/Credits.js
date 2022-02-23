import React, { useState } from "react";
import { useInterval } from "./Utils/utils";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  align-self: center;
  /* background-color: red; */
  width: 100%;
  height: 115vh;
  /* margin-top: -25vh; */
  text-align: center;
  perspective: 20px;
`;
const Test = styled.div`
  height: 300px;
  min-height: 10px;
  position: relative;
  ${props => `z-index:${props.zIndex};`};
  opacity: 0;
  animation: starWarsScroll 50s;
  ${props => `animation-delay: ${props.aD}s;`};
  @keyframes starWarsScroll {
    0% {
      opacity: 1;
      transform: scale(1) translate(0, 180vh) rotateX(1deg);
    }
    100% {
      opacity: 1;
      transform: scale(0.75, 0) translate(0, 0vh) rotateX(1deg);
    }
  }
`;

export const Button = styled.div`
  top: 70vh;
  left: 30px;

  position: absolute;
  z-index: 10003;
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
  z-index: 10004;
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

// <ButtonGroup>
//   <ButtonsWrapper>
//     <Button onClick={() => {}}>
//       <ButtonOutline zIndex={1} />
//       Credits
//     </Button>
//   </ButtonsWrapper>
// </ButtonGroup>

export const Credits = ({ handleClickHome }) => {
  const delayTime = 3;
  const [tests, setTests] = useState([
    <Test aD={0 * delayTime} zIndex={1}>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />{" "}
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />
    </Test>,

    <Test aD={1 * delayTime} zIndex={1}>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />{" "}
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />
    </Test>,
    <Test aD={2 * delayTime} zIndex={1}>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />{" "}
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />
    </Test>,
    <Test aD={3 * delayTime} zIndex={1}>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />{" "}
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />
    </Test>,
    <Test aD={4 * delayTime} zIndex={1}>
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />{" "}
      <div>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum is simply dummy text of the printing and
        typesetting industry. Lorem Ipsum is simply dummy text of the printing
        and typesetting industry. Lorem Ipsum is simply dummy text of the
        printing and typesetting industry. Lorem Ipsum is simply dummy text of
      </div>
      <br />
      <br />
    </Test>,
    <Test aD={10} zIndex={1}>
      <div>Yay</div>
      <br />
      <br />
    </Test>
  ]);
  // useInterval(() => {
  //   setTests(_tests => [
  //     ..._tests,
  //     <Test zIndex={tests.length}>
  //       <div>
  //         Lorem Ipsum is simply dummy text of the printing and typesetting
  //         industry. Lorem Ipsum is simply dummy text of the printing and
  //         typesetting industry. Lorem Ipsum is simply dummy text of the printing
  //         and typesetting industry. Lorem Ipsum is simply dummy text of the
  //         printing and typesetting industry. Lorem Ipsum is simply dummy text of
  //       </div>
  //       <br />
  //       <br />{" "}
  //       <div>
  //         Lorem Ipsum is simply dummy text of the printing and typesetting
  //         industry. Lorem Ipsum is simply dummy text of the printing and
  //         typesetting industry. Lorem Ipsum is simply dummy text of the printing
  //         and typesetting industry. Lorem Ipsum is simply dummy text of the
  //         printing and typesetting industry. Lorem Ipsum is simply dummy text of
  //       </div>
  //       <br />
  //       <br />
  //     </Test>
  //   ]);
  // }, 3000);

  return (
    <Wrapper>
      <Button onClick={handleClickHome}>
        <ButtonOutline />
        Back
      </Button>
      {tests}
    </Wrapper>
  );
};
