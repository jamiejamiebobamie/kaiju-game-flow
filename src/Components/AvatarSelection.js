import React, { useState, useEffect, useContext } from "react";
import { SelectedAvatarContext } from 'Home';
import { useInterval } from "Utils/utils";

import styled from "styled-components";

const AvatarSelectionWrapper = styled.div`
    position: absolute;
    flex-direction: column;
    z-index: 1;
    width: 100dvw;
    height: 300px;
    margin-top: 200px;
    align-self: center;
    display: flex;
    justify-content: space-around;


    background-color: #18324c;
    border-color: #18434c;
    border-width: 1px;
    border-style: solid;
    border-bottom: 1px solid #13142e;

`;

//  ${props => !props.selected ? `background-position: 0 -460px; &:hover{animation: cycleThroughIdleAnims 2.4s steps(6) -0.8s infinite;}` : `animation: ${props.anim} 1s steps(10) infinite;`}

const SpriteSheet = styled.div`
  cursor: pointer;

  ${props =>
    props.isPlayerOne
      ? 'background: url("spritesheet/player.png");'
      : 'background: url("spritesheet/teammate.png");'}

  height: 230px;
  width: 152px;

  ${props => `filter: drop-shadow(0 0 ${props.selected ? props.dropShadow : '2'}px ${props.isPlayerOne ? "#55AAff" : "salmon"});`}

  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  transition-property: drop-shadow;
  // -webkit-transition: -webkit-transform 3s ease-in-out;

  ${props => !props.selected ? `background-position: 0 -460px; &:hover{animation: cycleThroughIdleAnims 2.4s steps(6) -0.8s infinite;}` : ""}

  @keyframes cycleThroughIdleAnims {
    from {
      background-position-x: 0px;
      background-position-y: 0px;
    }
    to {
      background-position-x: 0px;
      background-position-y: -1380px;
    }
  }  

  @keyframes upRight {
    from {
      background-position-x: -152px;
      background-position-y: 0px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 0px;
    }
  }
  @keyframes up {
    from {
      background-position-x: -152px;
      background-position-y: 220px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 220px;
    }
  }
  @keyframes upLeft {
    from {
      background-position-x: -152px;
      background-position-y: 440px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 440px;
    }
  }
  @keyframes downLeft {
    from {
      background-position-x: -152px;
      background-position-y: 660px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 660px;
    }
  }
  @keyframes down {
    from {
      background-position-x: -152px;
      background-position-y: 880px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 880px;
    }
  }
  @keyframes downRight {
    from {
      background-position-x: -152px;
      background-position-y: 1100px;
    }
    to {
      background-position-x: -1682px;
      background-position-y: 1100px;
    }
  }
`;

const SlidingLabels = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const Label = styled.div`

    position: absolute;
    ${props => `z-index: ${props.zIndex};`}
    
    display: flex;
    align-self: center;
    width: 770px;

    ${props => props.isGuy ? "justify-content: flex-end;" : "justify-content: flex-start;"}

    transition-property: transform;
    transition-duration: 1s;

    color: #887191;

`;

const SpritesWrapper = styled.div`
    display: flex;
    width: 100%;
    align-self: center;
    justify-content: space-around;

    // max-width: 1100px;
    max-width: 1300px;
`;

const StyledSpan = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;

    transition-property: transform;
    transition-duration: 1s;

    ${props => props.selected ? props.isGuy ? "" : "transform: translateX(650px)" : props.isGuy ? "transform: translateX(-650px)" : ""}
`;

const StyledIcon = styled.i`
    align-self: center;
    ${props => props.rotate && `transform: translateY(20px) rotate(${props.rotate}deg);`}
`;

const UpDownAnim = styled.div`
    align-self: center;

        animation: up-down 1s linear infinite;

    @keyframes up-down {
        0%, 100% {
            transform: translate(0px, 0px);
        }
        50% {
            transform: translate(0px, -10px);
        }
    }
`;

const TopRightBottomLeftAnim = styled.div`
        animation: top-left-bottom-right 1s linear infinite;

    @keyframes top-left-bottom-right {
        0%, 100% {
            transform: translate(0px, 0px);
        }
        50% {
            transform: translate(5px, 5px);
        }
    }
`;

const StyledMsg = styled.div`
    position: absolute;
    filter: none !important;

    align-self: flex-start;

    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    width: 100%;
    max-width: 1250px;

    color: #FF5F1F;

    ${props => `transform: rotate(${props.rotate});`}

    animation: blink-fade 4s linear infinite;

    @keyframes blink-fade {
        0%, 100% {
            opacity: 0;
        }
        20% {
            opacity: 0.8;
        }
        80% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
        }   
    }
`;

const StyledSpan2 = styled.span`
    width: 250px;
    text-align: end;
`;

const PopupSpan = () => <StyledMsg isGuy={false}>
  <StyledSpan2>Click to change avatar</StyledSpan2>
  <br />
  <TopRightBottomLeftAnim>
    <StyledIcon className='fa fa-caret-down' rotate={-45} />
  </TopRightBottomLeftAnim>
</StyledMsg>


export const AvatarSelection = () => {
  const [isAvatarChangedOnce, setIsAvatarChangedOnce] = useState(false);
  const [dropShadow, setDropShadow] = useState(2)
  const { selectedAvatar, setSelectedAvatar } = useContext(SelectedAvatarContext);

  useInterval(() => {
    setDropShadow(dropShadow + 1);
  }, 1000);

  return <AvatarSelectionWrapper>
    <SpritesWrapper>
      {!isAvatarChangedOnce && <PopupSpan isGuy={false} selectedAvatar={selectedAvatar} />}
      <SpriteSheet
        dropShadow={dropShadow}
        isSelected={"girl" == selectedAvatar}
        onClick={
          () => {
            setIsAvatarChangedOnce(true);
            setSelectedAvatar('girl');
          }}
        isPlayerOne={false} />
      <SpriteSheet
        dropShadow={dropShadow}
        isSelected={"guy" == selectedAvatar}
        onClick={() => setSelectedAvatar('guy')}
        isPlayerOne={true} />
    </SpritesWrapper>
    <SlidingLabels>
      {/* default is "girl" = "Teammate", "guy" = "Player" */}
      <Label isGuy={false} zIndex={3}>
        <StyledSpan
          selected={"girl" == selectedAvatar}
          isGuy={false}
        >
          <UpDownAnim><StyledIcon className="fa fa-caret-up" /></UpDownAnim>
          Teammate
        </StyledSpan>
      </Label>
      <Label isGuy={true} zIndex={4}>
        <StyledSpan
          selected={"guy" == selectedAvatar}
          isGuy={true}
        >
          <UpDownAnim><StyledIcon className="fa fa-caret-up" /></UpDownAnim>
          Player
        </StyledSpan>
      </Label>
    </SlidingLabels>
  </AvatarSelectionWrapper>
}