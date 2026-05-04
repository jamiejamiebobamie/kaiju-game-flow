import React, { useState, useEffect, useRef, useContext } from "react";
import { SelectedAvatarContext } from 'Home';
import { useHover } from "Utils/utils";
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

const SpriteSheet = styled.div`
  cursor: pointer;
  ${props => !props.anim && "pointer-events: none;"}

  ${props =>
    props.gender == 'guy'
      ? 'background: url("spritesheet/player.png");'
      : 'background: url("spritesheet/teammate.png");'}

  height: 230px;
  width: 152px;

  ${props => `filter: drop-shadow(0 0 2px ${props.gender == 'guy' ? "#55AAff" : "salmon"});`}

  -webkit-transition-duration: 0.4s;
  transition-duration: 0.4s;
  transition-property: drop-shadow;
  // -webkit-transition: -webkit-transform 3s ease-in-out;

  background-position: 0 -460px;

  &:hover{
    ${props => `animation: ${props.anim} 4.8s steps(6) -1.8s infinite;`}
  }
  
  @keyframes cycleThroughIdleAnims {
    to {
      background-position-x: 0px;
      background-position-y: 0px;
    }
    from {
      background-position-x: 0px;
      background-position-y: 1380px;
    }
  }  
`;

const SpritesWrapper = styled.div`
    display: flex;
    width: 100%;
    align-self: center;
    justify-content: space-around;

    // max-width: 1100px;
    max-width: 1300px;
`;

const CenteredLabelsContainer = styled.div`
    display: flex;
    width: 100%;
    justify-content: center;
`;

const LabelContainer = styled.div`

    position: absolute;
    ${props => `z-index: ${props.zIndex};`}
    
    display: flex;
    align-self: center;
    width: 770px;

    ${props => props.labelContent == 'Player' ? "justify-content: flex-end;" : "justify-content: flex-start;"}

    transition-property: transform, color;
    transition-duration: 1s;

    color: ${props => props.selectedGender == 'guy' && props.labelContent == 'Player' || props.selectedGender == 'girl' && props.labelContent == 'Teammate' ? "#55AAff" : "salmon"};
`;

const SlidingLabel = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;

    transition-property: transform;
    transition-duration: 1s;

    ${props => props.selectedGender == 'guy' ? props.labelContent == 'Player' ? "" : "" : props.labelContent == 'Player' ? "transform: translateX(-650px)" : "transform: translateX(650px)"}
`;

const StyledIcon = styled.i`
    align-self: center;
    ${props => props.rotate && `transform: translateY(20px) rotate(${props.rotate}deg);`}
`;

const UpDownAnim = styled.div`
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

    color: #D1001C;

    ${props => `transform: rotate(${props.rotate});`}
`;

const BlinkFadeEffect = styled.div`
    animation: blink-fade .05s linear infinite;

    @keyframes blink-fade {
        0%, 100% {
            opacity: .3;
        }
        20% {
            opacity: 0.59;
        }
        80% {
            opacity: 0.59;
        }
        100% {
            opacity: .3;
        }   
    }
`;

const BlinkFadeEffectParam = styled.div`

  &:hover{
      ${props => `animation: blink-fade ${props.time}s linear infinite;`}
  }

  @keyframes blink-fade {
      0%, 100% {
          ${props => `opacity: ${props.low};`
      }
      20% {
          ${props => `opacity: ${props.high};`
      }
      80% {
          ${props => `opacity: ${props.high};`
      }
      100% {
          ${props => `opacity: ${props.low};`
      }   
  }
`;

const DoodadSpriteSheet = styled.div`
  position: absolute;
  ${props => props.zIndex && `z-index: ${props.zIndex};`}
  pointer-events: none;
  ${props => `background: url(${props.src});`}

  width: 344px;
  height: 256px;

  filter: drop-shadow(0 0 5px #80EF80);

  animation: cycleThroughDoodad 1s steps(4) infinite;

  @keyframes cycleThroughDoodad {
    0% {
      background-position-x: 0px;
      background-position-y: 0px;
    }                         
    100% {
      background-position-x: -1376px;
      background-position-y: 0px;
    }
  }  
`;

const AlignSelfCenter = styled.div`
    display: flex;
    flex-direction: column;
    align-self: center;
`;

const PositionAbsolute = styled.div`
    position: absolute;
`;

const DoodadsWrapper = styled.div`
    position: absolute;
    ${props => `transform: translate(${props.translation});`}
`;

const PopupMsg = styled.span`
    display: flex;
    width: 250px;
    text-align: end;
`;

const FadeInOutEffect = styled.div`
    transition: opacity 1s;
    ${props => `opacity: ${props.opacity};`} 
`;

const DoodadTransform = styled.div`
  transition: transform 1s;
  ${props => `transform: scale(.45) translate(${props.translation});`}
`;

const BackgroundTest = styled.div`
  position: absolute;
  ${props => props.zIndex && `z-index: ${props.zIndex};`}

  pointer-events: none;
  background: url(spritesheet/selected_avatar_background.png);

  width: 358.4px;
  height: 592px;

  // filter: drop-shadow(0 0 5px #80EF80);

  animation: playSpriteSheet 2s steps(5) infinite;

  @keyframes playSpriteSheet {
    0% {
      background-position-x: 0px;
      background-position-y: 0px;
    }                         
    100% {
      background-position-x: -1792px;
      background-position-y: 0px;
    }
  }  
`;

const PopupSpan = () =>
  <StyledMsg>
    <BlinkFadeEffect>
      <PopupMsg>Click to change avatar
        <br />
        <TopRightBottomLeftAnim>
          <StyledIcon className='fa fa-caret-down' rotate={-45} />
        </TopRightBottomLeftAnim>
      </PopupMsg>
    </BlinkFadeEffect>
  </StyledMsg>

const useOpacityEffect = ({ show, opacity, setOpacity, activeInterval }) => useEffect(() => {
  const FADE_SPEED = 100; // 1 seconds to fade in or out
  if (!show && opacity > 0) {
    clearInterval(activeInterval.current);
    activeInterval.current = setInterval(() => {
      setOpacity(o => {
        if (o <= 0) clearInterval(activeInterval.current);
        return o > 0 ? o - .1 : 0
      });
    }, FADE_SPEED);
  } else if (show && opacity < 1) {
    clearInterval(activeInterval.current);
    activeInterval.current = setInterval(() => {
      setOpacity(o => {
        if (o >= 1) clearInterval(activeInterval.current);
        return o >= 1 ? 1 : o + .1
      });
    }, FADE_SPEED);
  }
}, [show]);

const useTranslationEffect = ({ STARTING_POSTIONS, opacity, setTranslations, activeInterval }) => {
  const TRANSLATION_RANGE = 25; // max range
  useEffect(() => {
    activeInterval.current = setInterval(() => {
      if (opacity <= 0) clearInterval(activeInterval.current);
      setTranslations(ts => ts.map((t, i) => {
        if (i >= STARTING_POSTIONS.length) return t;

        const start = STARTING_POSTIONS[i];
        const dx = Math.abs(t.x - start.x);
        const dy = Math.abs(t.y - start.y);

        if (dx > TRANSLATION_RANGE && dy > TRANSLATION_RANGE) {
          return start;
        } else {
          const negX = Math.random() > .5;
          const negY = Math.random() > .5;
          const x = Math.random() * TRANSLATION_RANGE;
          const y = Math.random() * TRANSLATION_RANGE;
          return { x: start.x + (negX ? -x : x), y: start.y + (negY ? -y : y) };
        }
      }));
    }, 5000);
  }, [opacity]);
}

const Doodads = ({ show, globalTranslation }) => {
  const STARTING_POSTIONS = [{ x: -100, y: -400 }, { x: 70, y: -280 }, { x: 70, y: -470 }];

  const activeOpacityInterval = useRef();
  const activeTranslationInterval = useRef();

  const [opacity, setOpacity] = useState(0);
  const [translations, setTranslations] = useState(STARTING_POSTIONS);

  useTranslationEffect({ STARTING_POSTIONS, opacity, setTranslations, activeInterval: activeTranslationInterval });
  useOpacityEffect({ show, opacity, setOpacity, activeInterval: activeOpacityInterval, });

  return <DoodadsWrapper translation={globalTranslation}>
    <FadeInOutEffect opacity={opacity}>
      <BlinkFadeEffect>
        <DoodadTransform translation={`${translations[0].x}px, ${translations[0].y}px`}>
          <DoodadSpriteSheet
            src={"spritesheet/doo_dad_bars.png"}
            zIndex={101}
          />
        </DoodadTransform>
      </BlinkFadeEffect>
      <BlinkFadeEffect>
        <DoodadTransform translation={`${translations[1].x}px, ${translations[1].y}px`}>
          <DoodadSpriteSheet
            src={"spritesheet/doo_dad_heartbeat.png"}
            zIndex={102}
          />
        </DoodadTransform>
      </BlinkFadeEffect>
      <BlinkFadeEffect>
        <DoodadTransform translation={`${translations[2].x}px, ${translations[2].y}px`}>
          <DoodadSpriteSheet
            src={"spritesheet/doo_dad_vertices.png"}
            zIndex={103}
          />
        </DoodadTransform>
      </BlinkFadeEffect>
    </FadeInOutEffect>
  </DoodadsWrapper>
};

export const AvatarSelection = () => {
  const { selectedAvatar, setSelectedAvatar, isAvatarChangedOnce, setIsAvatarChangedOnce } = useContext(SelectedAvatarContext);
  const [setHoverRef, hoverLookupString] = useHover();

  return <AvatarSelectionWrapper>
    <SpritesWrapper>
      {!isAvatarChangedOnce && <PopupSpan />}
      <div>
        <SpriteSheet
          ref={setHoverRef('girl')}
          onClick={() => {
            setIsAvatarChangedOnce(true);
            setSelectedAvatar('girl');
          }}
          gender={'girl'}
          anim={"girl" == selectedAvatar ? "" : 'cycleThroughIdleAnims'}
        />
        <Doodads globalTranslation={"-5px, 0px"} show={hoverLookupString == 'girl' && "guy" == selectedAvatar} />
        {/* <BackgroundTest zIndex={105} /> */}
      </div>
      <div>
        <SpriteSheet
          ref={setHoverRef('guy')}
          onClick={() => setSelectedAvatar('guy')}
          gender={'guy'}
          anim={"guy" == selectedAvatar ? "" : 'cycleThroughIdleAnims'}
        />
        <Doodads globalTranslation={"5px, 0px"} show={hoverLookupString == 'guy' && "girl" == selectedAvatar} />
        {/* <BackgroundTest zIndex={106} /> */}
      </div>
    </SpritesWrapper>
    <CenteredLabelsContainer>
      {/* default is "girl" = "Teammate", "guy" = "Player" */}
      <LabelContainer labelContent={"Teammate"} zIndex={3} selectedGender={selectedAvatar}>
        <SlidingLabel
          selectedGender={selectedAvatar}
          labelContent={"Teammate"}
        >
          <BlinkFadeEffect>
            <UpDownAnim>
              <AlignSelfCenter>
                <StyledIcon className="fa fa-caret-up" />
              </AlignSelfCenter>
            </UpDownAnim>
            Teammate
          </BlinkFadeEffect>
        </SlidingLabel>
      </LabelContainer>
      <LabelContainer labelContent={"Player"} zIndex={4} selectedGender={selectedAvatar}>
        <SlidingLabel
          selectedGender={selectedAvatar}
          labelContent={"Player"}
        >
          <BlinkFadeEffect>
            <UpDownAnim>
              <AlignSelfCenter>
                <StyledIcon className="fa fa-caret-up" />
              </AlignSelfCenter>
            </UpDownAnim>
            Player
          </BlinkFadeEffect>
        </SlidingLabel>
      </LabelContainer>
    </CenteredLabelsContainer>
  </AvatarSelectionWrapper>
}