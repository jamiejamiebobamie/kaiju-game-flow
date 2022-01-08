import React, { useEffect } from "react";
import styled from "styled-components";
import { useHover } from "../../../../Utils/utils";

const Wrapper = styled.div`
  display: flex;
  align-self: center;
  justify-content: center;
  position: absolute;
  ${props => (props.isReversed ? "top: 86px;" : "top: 79px;")};
  ${props => (props.isReversed ? "right: 85px;" : "right: 77px;")};
  /* background-color: orange; */
  width: 50px;
  height: 50px;
  transform:
  /* translate(${props => props.i * 15}px, ${props => props.i * 15}px) */
    rotate(${props => (props.isReversed ? 90 : 30)}deg);
  /* margin-top: -50px; */
`;
const PassiveAbilityWrapper = styled.div`
  position: absolute;
  /* background-color: red; */
  right: 20px;
  width: 100px;
  /* // ${props => 100 - (7 - props.i) * 4}px; */
  height: 0px;
  /* border-style: solid; */
  /* border-thickness: thin; */
  transform:
  /* translate(${props => props.i * 15}px, ${props => props.i * 15}px) */
    rotate(${props => props.i * -18}deg);
  transform-origin: top right;
`;
const PassiveAbility = styled.div`
  display: flex;
  justify-content: center;
  width: 20px;
  height: 20px;
  align-self: center;
  align-content: center;
  border-radius: 10px;
  border-radius: 100%;
  border-style: solid;
  border-thickness: thin;
  background-color: #f2e3cc;
  transform: rotate(
    ${props => (props.isReversed ? props.i * 18 - 90 : props.i * 18 - 30)}deg
  );
`;
const PassiveIcon = styled.i`
  display: flex;
  align-self: center;
`;
export const PassiveAbilities = ({
  setDisplayString,
  isReversed,
  abilities = []
}) => {
  const [setHoverRef, hoverLookupString] = useHover();
  useEffect(() => setDisplayString(hoverLookupString), [hoverLookupString]);
  const ICON_LOOKUP = {
    heart: "fa-gratipay",
    glass: "fa-tencent-weibo",
    fire: "fa-fire",
    wood: "fa-tree",
    lightning: "fa-hourglass-half",
    death: "fa-heartbeat",
    bubble: "fa-universal-access",
    metal: "fa-cutlery",
    ice: "fa-thermometer-quarter"
  };
  const abilityButtons = abilities.map((data, i) => (
    <PassiveAbilityWrapper i={i}>
      <PassiveAbility
        ref={setHoverRef(`${data.displayLookup}Passive`)}
        key={i}
        isReversed={isReversed}
        i={i}
        title={data.passiveName}
      >
        <PassiveIcon className={`fa ${ICON_LOOKUP[data.element]}`} />
      </PassiveAbility>
    </PassiveAbilityWrapper>
  ));
  return <Wrapper isReversed={isReversed}>{abilityButtons}</Wrapper>;
};
