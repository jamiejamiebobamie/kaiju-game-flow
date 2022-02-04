import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Player } from "./Pieces/PlayerPiece";
import { Kaiju } from "./Pieces/KaijuPiece";
import { PauseModal } from "./PauseModal";
const Board = styled.div`
  width: ${props => props.width}px;
  min-width: ${props => props.width}px;
  height: ${props => props.height}px;
  minwidth: ${props => props.width}px;
  overflow: hidden;
  border-style: solid;
  border-thickness: medium;
  border-radius: 10px;
  border-color: #db974f;
`;
const ShiftContentOver = styled.div`
  margin-top: -30px;
  margin-left: -5px;
  position: absolute;
`;
const BackgroundImage = styled.svg`
  margin-left: -55px;
  pointer-events: none;
  background-color: #06080c;
`;
const Road = styled.path`
  stroke-dasharray: 0.3px;
  opacity: 0.7;
  stroke: #d3a085;
  fill: transparent;
  filter: drop-shadow(0 0 1px #d3a085);
  animation: run 200s linear infinite;
  @keyframes run {
    to {
      stroke-dashoffset: 1020;
    }

    from {
      stroke-dashoffset: 1000;
    }
  }
`;
const Peninsula = styled.path`
  fill: #1b2536;
`;
const ShoreWaves = styled.path`
  /* stroke-dasharray: 0.3px; */
  opacity: 0.7;
  stroke: lightgrey;
  fill: transparent;
  animation: break 5s linear infinite;
  @keyframes break {
    0% {
      /* "transform:scale(5)translate(-500px-500px)"; */
      stroke-dasharray: 3px;
      /* stroke-dashoffset: 1020; */
      opacity: 0.1;
      stroke-width: 2px;
    }
    50% {
      /* transform: scale(1) translate(0); */

      /* transform: scale(0.9) translate(0); */
      stroke-dasharray: 1px;
      /* stroke-dashoffset: 1020; */
      opacity: 0;
      stroke-width: 0.1px;
    }
    100% {
      /* transform: scale(5) translate(-500px -500px); */
      stroke-dasharray: 3px;
      /* stroke-dashoffset: 1020; */
      opacity: 0.1;
      stroke-width: 2px;
    }
  }
`;
const GreenSpaces = styled.path`
  fill: #173e41;
`;
export const GameBoard = ({
  isClassWrapper = false,
  isPaused,
  playerData,
  kaijuData,
  setPlayerMoveToTiles,
  tileStatuses,
  setTileStatuses,
  clickedTile,
  setClickedTile,
  tiles,
  path,
  width,
  height,
  scale
}) => {
  useEffect(() => {
    const { i, _ } = clickedTile;
    if (i !== -1) {
      setPlayerMoveToTiles(path);
      setClickedTile({ i: -1, j: -1 });
    }
  }, [clickedTile]);
  const kaiju = kaijuData.map((k, i) => (
    <Kaiju
      key={k.key}
      dir={k.dir}
      charLocation={k.charLocation}
      color={k.color}
      scale={scale}
      lives={k.lives}
    />
  ));
  const players = playerData.map(p => (
    <Player
      key={p.i}
      i={p.i}
      charLocation={p.charLocation}
      color={p.color}
      scale={scale}
      lives={p.lives}
      isHealed={p.isHealed}
      isTeleported={p.isTeleported}
      dir={p.dir}
    />
  ));
  return (
    <Board width={width} height={height}>
      {isPaused && <PauseModal />}

      <ShiftContentOver scale={scale}>
        {tiles}
        {kaiju}
        {players}
      </ShiftContentOver>
      <BackgroundImage
        width="600px"
        height="800px"
        viewBox="0 0 210 297"
        version="1.1"
      >
        <ShoreWaves d="m 15.771259,295.77646 20.848376,-22.80592 5.212731,-28.44718 3.107232,-9.10107 2.754361,-24.16994 2.024438,-16.92159 3.323406,-10.8389 2.085765,-11.44357 1.715243,-5.49598 2.803748,-3.73006 1.007402,-4.44802 -4.633291,-0.84242 -2.146588,-4.63329 0.461756,-4.21208 -1.684832,-3.79087 -4.508854,-4.40748 -5.917188,-4.22222 -0.104158,-7.79741 -6.31812,-9.26658 -6.318123,-7.16054 c 0.280806,-5.89691 -3.831138,5.83449 3.30884,-17.896272 l 4.077509,-8.56887 1.037812,-10.601164 0.842418,-9.266576 1.684832,-5.896914 5.054497,-0.842415 3.369664,-3.790873 -2.948458,-4.633289 5.054497,-5.054496 8.84537,-2.948456 L 63.181208,39.17235 61.496376,26.957316 42.120806,0 h 9.687785 l 16.427114,21.902819 27.378525,14.742282 6.8407,-3.174267 c 4.89711,0.600959 6.49683,2.437333 7.48037,4.016684 l 7.58175,4.633288 12.07032,5.711653 2.25075,7.767005 4.63329,5.054497 13.89987,6.739329 60.23275,-33.696645 -0.84242,10.530202 -55.59946,32.01181 -12.63624,6.318123 -7.16054,5.054497 -4.21208,2.106038 3.79087,5.054497 -2.52725,5.475708 -5.4757,0.84241 -2.52725,3.79088 -5.47571,1.68483 -6.0112,7.27204 0.4691,5.77249 6.72185,4.59274 0.66729,5.29044 -2.5678,5.2499 -0.54286,6.36145 -2.84709,6.14299 -3.54477,3.20469 -0.76868,4.13098 -3.33924,4.43788 -2.38533,3.83143 -3.03969,6.44255 -1.283903,7.19374 2.106043,9.77902 13.46852,25.47803 4.08764,5.88677 4.33652,8.37347 4.778,4.64343 3.17426,3.542 v 0 l 3.33925,4.59274 3.22496,4.33651 3.94572,4.41762 2.82681,6.66837 4.78814,6.86376 14.11832,9.16521 11.35513,6.96513 23.64785,18.57544 H 15.771259" />
        <Peninsula d="m 15.771259,295.77646 20.848376,-22.80592 5.212731,-28.44718 3.107232,-9.10107 2.754361,-24.16994 2.024438,-16.92159 3.323406,-10.8389 2.085765,-11.44357 1.715243,-5.49598 2.803748,-3.73006 1.007402,-4.44802 -4.633291,-0.84242 -2.146588,-4.63329 0.461756,-4.21208 -1.684832,-3.79087 -4.508854,-4.40748 -5.917188,-4.22222 -0.104158,-7.79741 -6.31812,-9.26658 -6.318123,-7.16054 c 0.280806,-5.89691 -3.831138,5.83449 3.30884,-17.896272 l 4.077509,-8.56887 1.037812,-10.601164 0.842418,-9.266576 1.684832,-5.896914 5.054497,-0.842415 3.369664,-3.790873 -2.948458,-4.633289 5.054497,-5.054496 8.84537,-2.948456 L 63.181208,39.17235 61.496376,26.957316 42.120806,0 h 9.687785 l 16.427114,21.902819 27.378525,14.742282 6.8407,-3.174267 c 4.89711,0.600959 6.49683,2.437333 7.48037,4.016684 l 7.58175,4.633288 12.07032,5.711653 2.25075,7.767005 4.63329,5.054497 13.89987,6.739329 60.23275,-33.696645 -0.84242,10.530202 -55.59946,32.01181 -12.63624,6.318123 -7.16054,5.054497 -4.21208,2.106038 3.79087,5.054497 -2.52725,5.475708 -5.4757,0.84241 -2.52725,3.79088 -5.47571,1.68483 -6.0112,7.27204 0.4691,5.77249 6.72185,4.59274 0.66729,5.29044 -2.5678,5.2499 -0.54286,6.36145 -2.84709,6.14299 -3.54477,3.20469 -0.76868,4.13098 -3.33924,4.43788 -2.38533,3.83143 -3.03969,6.44255 -1.283903,7.19374 2.106043,9.77902 13.46852,25.47803 4.08764,5.88677 4.33652,8.37347 4.778,4.64343 3.17426,3.542 v 0 l 3.33925,4.59274 3.22496,4.33651 3.94572,4.41762 2.82681,6.66837 4.78814,6.86376 14.11832,9.16521 11.35513,6.96513 23.64785,18.57544 H 15.771259" />

        <GreenSpaces
          d="m 56.90078,238.98328 7.13695,-3.59545 v -8.96091 l 7.212441,-1.09279 4.808292,-4.8083"
          id="path2879"
        />
        <GreenSpaces
          d="m 109.9353,37.487518 -0.53391,8.430953 -9.641515,14.662555 -18.712286,1.169516 -8.782452,-1.780516 h -5.771176 l -4.51657,-6.273016 1.203817,-14.52466 -1.684832,-12.215034 6.739329,-5.054497 27.378525,14.742282 6.8407,-3.174267 c 6.23781,1.071441 6.50245,2.569536 7.48037,4.016684 z"
          id="path262"
        />
        <GreenSpaces
          d="m 381.29356,153.15456 c -6.07243,-3.89687 -9.11822,-4.6492 -22.6125,-5.58546 l -15.59483,-1.082 -10.26638,-10.1744 -10.26638,-10.17441 -20.14354,0.92126 c -11.07894,0.50669 -23.36069,1.25767 -27.29277,1.66884 l -7.14924,0.74758 -10.39494,-17.11188 c -5.71722,-9.41153 -10.39495,-17.729412 -10.39495,-18.484173 0,-0.754761 2.50346,-3.153531 5.56325,-5.3306 l 5.56324,-3.958307 51.44258,27.77088 51.44258,27.77088 13.41348,-6.16773 13.41348,-6.16773 8.23087,2.39278 c 4.52699,1.31603 10.38284,4.20355 13.01304,6.4167 4.14116,3.48456 4.78215,5.05051 4.78215,11.68271 0,7.00241 -0.31452,7.65879 -3.66995,7.65879 -2.01847,0 -7.80805,0.38469 -12.86573,0.85486 -8.25595,0.7675 -9.91302,0.3946 -16.21346,-3.64859 z"
          id="path1136"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 259.3196,204.88944 c -0.65698,-9.7397 -0.19704,-11.9615 4.9661,-23.98943 l 5.69013,-13.2556 -0.87239,-18.32649 -0.87239,-18.32649 12.47587,-0.13323 c 6.86172,-0.0733 18.79176,-0.66123 26.5112,-1.30658 l 14.03535,-1.17335 10.16061,10.66604 10.16062,10.66604 9.33292,0.093 c 13.22412,0.13171 23.16952,2.02592 28.30177,5.39037 l 4.42339,2.89976 -20.22776,3.69031 c -11.12528,2.02968 -20.40612,3.86867 -20.62411,4.08665 -0.21798,0.21799 0.41065,4.73565 1.39696,10.03926 0.98631,5.3036 1.34045,10.09575 0.78699,10.64921 -0.55346,0.55346 -9.62377,2.51049 -20.15625,4.34895 l -19.14997,3.34265 -0.46428,9.69934 -0.46429,9.69933 -12.01158,0.0111 c -6.60636,0.006 -16.66081,0.45028 -22.34321,0.98706 l -10.33164,0.97598 z"
          id="path1175"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 240.19954,208.75018 -4.27401,-6.45845 1.95784,-28.24004 c 1.7236,-24.86147 1.65042,-30.48942 -0.61169,-47.04158 -3.34309,-24.46199 -3.34138,-24.48651 1.9927,-28.430167 l 4.56222,-3.37299 10.79235,17.704197 10.79236,17.70419 1.07201,17.93085 1.072,17.93085 -5.51019,12.53244 c -4.72208,10.73995 -5.5102,14.22495 -5.5102,24.3658 v 11.83336 h -6.0307 c -5.34246,0 -6.51845,-0.73705 -10.30469,-6.45846 z"
          id="path1214"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 307.99787,204.46132 c 0,-8.78222 -2.05566,-7.74548 23.9376,-12.07253 l 16.91993,-2.81663 -1.02242,-7.84491 c -0.56234,-4.3147 -1.36828,-9.25705 -1.79099,-10.983 -0.70918,-2.89565 0.81274,-3.41862 19.69928,-6.76917 11.2573,-1.9971 20.6632,-3.39203 20.90198,-3.09984 0.99938,1.22286 4.2069,25.02335 3.47145,25.75881 -0.62003,0.62003 -41.05051,6.41548 -46.6386,6.68534 -0.64329,0.0311 -1.16961,3.81473 -1.16961,8.40813 v 8.35165 l -10.52651,0.99416 c -5.78958,0.54679 -13.50902,0.99916 -17.15431,1.00525 l -6.6278,0.0111 z"
          id="path1253"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 393.2913,183.71135 c -0.47164,-1.97509 -1.31777,-7.09992 -1.88028,-11.38849 -0.56251,-4.28858 -1.36192,-9.02551 -1.77648,-10.52651 -0.66979,-2.42512 0.56073,-2.7291 11.04747,-2.7291 h 11.80121 v 6.65567 c 0,5.82196 -1.94743,10.27789 -8.4277,19.2835 -0.0822,0.11423 -2.34484,0.67757 -5.02808,1.25185 -4.22338,0.90392 -4.99378,0.56186 -5.73614,-2.54692 z"
          id="path1292"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 307.99787,224.08045 v -8.43737 l 8.18728,-0.98341 c 4.50301,-0.54087 12.57333,-0.98951 17.93405,-0.99696 l 9.74677,-0.0136 v -9.05557 -9.05557 l 23.49284,-2.79987 c 12.92107,-1.53992 23.69913,-2.55273 23.95126,-2.25067 0.25212,0.30205 0.85344,3.11265 1.33626,6.24578 l 0.87785,5.69661 -12.16038,1.07644 -12.16038,1.07644 2.8556,11.10156 c 1.57057,6.10586 2.65801,11.29914 2.41653,11.54062 -0.24147,0.24148 -11.26258,1.13724 -24.49134,1.99059 -13.22876,0.85334 -28.08745,1.94546 -33.01932,2.42692 l -8.96702,0.87539 z"
          id="path1331"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 288.50433,228.37249 c -5.14629,-1.16126 -13.74294,-2.142 -19.10367,-2.17943 l -9.74676,-0.068 v -4.67845 -4.67845 l 16.76444,-0.0172 c 9.22044,-0.009 19.39607,-0.45214 22.6125,-0.98378 l 5.84806,-0.96663 v 8.00146 c 0,9.20636 -0.10431,9.24185 -16.37457,5.57049 z"
          id="path1370"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 249.66066,222.22631 -2.55453,-3.89871 h 5.49414 c 4.82076,0 5.49414,0.47784 5.49414,3.89871 0,5.21872 -5.01431,5.21872 -8.43375,0 z"
          id="path1409"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 375.01349,216.59246 c -2.26828,-9.45526 -1.23201,-10.68006 9.06727,-10.71684 l 6.68591,-0.0239 -6.35414,9.3569 c -3.49479,5.14629 -6.60889,9.35689 -6.92024,9.35689 -0.31135,0 -1.42681,-3.58788 -2.4788,-7.97307 z"
          id="path1448"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 394.80427,194.65706 c -1.05797,-4.04567 0.67139,-6.50859 4.01355,-5.71601 1.90968,0.45287 1.84601,1.21519 -0.41007,4.90937 -2.66095,4.35713 -2.67423,4.36011 -3.60348,0.80664 z"
          id="path1487"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 38.238895,73.291218 37.676561,-2.811683 0.337108,10.801956 -37.541523,2.105134 -1.791787,0.155509 z"
          id="path1559"
        />
        <GreenSpaces
          d="m 141.95981,310.41564 c 0,-4.81017 3.21244,-31.25361 3.8776,-31.91877 0.54932,-0.54932 24.86823,-2.64269 31.02217,-2.67038 l 4.19009,-0.0189 -2.12294,7.65599 c -1.68591,6.07991 -1.97574,9.89694 -1.40789,18.54169 l 0.71506,10.8857 h -5.78879 c -3.18383,0 -11.3455,0.33999 -18.13704,0.75553 l -12.34826,0.75554 z"
          id="path1598"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 180.20204,288.44368 c 0,-0.69862 0.79255,-3.99647 1.76122,-7.32857 l 1.76121,-6.05836 21.12618,-1.42784 c 11.61941,-0.78531 23.52476,-1.7161 26.45635,-2.06843 l 5.33017,-0.6406 1.84818,7.33694 c 1.0165,4.03532 1.74683,7.43318 1.62297,7.55081 -0.30878,0.29322 -52.78365,3.90627 -56.73358,3.90627 -1.74498,0 -3.1727,-0.5716 -3.1727,-1.27022 z"
          id="path1637"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 242.25069,284.81722 c -0.95297,-2.94067 -2.7744,-13.04505 -2.41611,-13.40335 0.50085,-0.50085 44.86459,-3.91974 45.22356,-3.48516 0.15734,0.1905 0.56312,3.55233 0.90172,7.47075 l 0.61563,7.12439 -5.96336,0.66279 c -3.27985,0.36454 -11.96044,0.9666 -19.2902,1.33793 -7.32976,0.37132 -14.51163,0.92141 -15.95971,1.22241 -1.53008,0.31805 -2.83336,-0.0714 -3.11153,-0.92976 z"
          id="path1676"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 179.68351,302.35691 c -0.4498,-5.15638 -0.64751,-9.53617 -0.43936,-9.73287 0.73977,-0.69906 60.16609,-4.34873 60.7819,-3.73292 1.0566,1.05661 3.04673,18.29935 2.20879,19.1373 -0.79205,0.79205 -41.45458,3.49362 -54.64031,3.63024 l -7.09321,0.0735 z"
          id="path1715"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 244.1482,298.98652 c -0.74103,-5.24003 -1.10667,-9.91672 -0.81253,-10.39265 0.29415,-0.47594 6.93844,-1.21987 14.7651,-1.65318 7.82666,-0.43331 17.48957,-1.10159 21.47314,-1.48506 l 7.24285,-0.69722 v 10.45815 10.45815 l -4.92514,0.65689 c -2.70882,0.36129 -12.0061,1.00009 -20.66061,1.41956 l -15.73547,0.76267 z"
          id="path1754"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 38.751142,65.708458 1.408316,0.153053 0.422812,-2.005835 7.718819,-0.116951 0.70171,-5.73064 7.993882,-0.416449 -0.892431,-13.683964 -5.138076,1.582799 -5.054497,5.054496 2.948458,4.633289 -3.369664,3.790873 -5.054497,0.842415 z"
          id="path1826"
        />
        <GreenSpaces
          d="m 149.02559,248.03291 c -0.77494,-0.0902 -1.47296,-0.22803 -1.55115,-0.30622 -0.0782,-0.0782 1.20205,-4.84687 2.84497,-10.59708 2.19806,-7.69322 3.08299,-10.48193 3.35007,-10.55713 0.19962,-0.0562 4.4718,-0.78094 9.49373,-1.6105 l 9.13078,-1.5083 6.59044,-7.41707 c 5.38924,-6.06521 6.54866,-7.48378 6.36118,-7.78306 -0.12609,-0.2013 -2.63632,-4.14594 -5.57829,-8.76588 l -5.34903,-8.3999 9.30788,-9.30165 9.30788,-9.30166 9.19016,-2.82793 c 5.05459,-1.55536 9.23065,-2.78744 9.28014,-2.73795 0.17659,0.1766 3.0127,46.7939 3.00626,49.41414 l -0.002,0.79975 -9.83783,0.50047 c -21.64454,1.10111 -19.84571,0.96724 -19.95681,1.48525 -0.0545,0.25429 -0.66099,5.11092 -1.34766,10.79252 -0.68668,5.6816 -1.27149,10.34874 -1.29959,10.37142 -0.0281,0.0227 -6.54951,0.13546 -14.49205,0.25061 -7.94253,0.11515 -14.48543,0.2545 -14.53977,0.30966 -0.0543,0.0552 -0.44117,1.71932 -0.8597,3.69813 -0.85714,4.05266 -0.6154,3.77582 -3.04958,3.49238 z"
          id="path1865"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 183.4393,239.19999 c 0.0677,-0.52562 0.60604,-5.05384 1.19627,-10.0627 0.59022,-5.00887 1.11237,-9.15645 1.16032,-9.21686 0.048,-0.0604 6.55611,-0.36398 14.46255,-0.6746 l 14.37535,-0.56476 0.004,0.56217 c 0.002,0.30918 0.25039,4.70745 0.55098,9.77391 0.3006,5.06646 0.52621,9.22715 0.50135,9.24597 -0.07,0.0531 -30.99224,1.902 -31.72548,1.89699 -0.63237,-0.004 -0.64579,-0.0288 -0.5258,-0.96012 z"
          id="path1904"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 27.125678,282.40847 30.139645,-16.87822 -2.882275,-15.56965 -4.652637,-9.44625 14.307319,-14.08743 14.626738,-15.14802 6.027928,6.63072 -3.616756,16.5768 3.616756,4.52095 8.439103,-5.12374 5.72653,6.93212 -5.123738,14.76842 15.326549,5.81216 -5.07907,11.36744 4.21955,4.21955 7.23351,18.68657 -99.663571,0.10657 z"
          id="path2056"
        />
        <GreenSpaces
          d="m 299.66326,841.02341 c -10.98585,-8.80938 -18.64626,-17.28782 -18.66134,-20.65409 -0.005,-1.13903 3.5365,-6.09918 7.87023,-11.02255 l 7.8795,-8.95158 10.83342,11.95607 c 9.48909,10.47244 10.69329,12.65114 9.70416,17.55726 -2.43883,12.0966 -4.76091,19.59834 -6.02881,19.47673 -0.73058,-0.0701 -5.9493,-3.83291 -11.59716,-8.36184 z"
          id="path2095"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 261.34471,838.40892 c 8.19098,-8.26931 15.4459,-15.03511 16.12205,-15.03511 0.67615,0 2.67715,2.2096 4.44666,4.91021 3.2137,4.90472 3.20714,4.92017 -5.85321,13.795 -7.9352,7.77272 -10.35582,9.04001 -19.33935,10.1249 l -10.26884,1.24011 z"
          id="path2134"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 211.33534,895.53919 c -2.79774,-4.2699 -2.46287,-4.79169 12.8547,-20.02968 l 15.72727,-15.64557 v 14.40162 14.40162 l -11.14912,5.62806 c -6.13202,3.09543 -11.91663,5.62806 -12.8547,5.62806 -0.93806,0 -2.99823,-1.97285 -4.57815,-4.38411 z"
          id="path2173"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 197.58051,925.49003 -7.79618,-15.72645 8.01391,-7.86506 8.0139,-7.86505 3.98316,5.06377 c 3.24103,4.1203 3.98316,7.60644 3.98316,18.71081 0,11.46166 -0.67271,14.42863 -4.20089,18.52775 l -4.20088,4.88069 z"
          id="path2212"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 125.22154,1099.232 c 6.72012,-13.546 11.03487,-19.5205 20.00848,-27.7052 l 11.44077,-10.435 -2.37398,-7.3021 c -1.30569,-4.0162 -2.76008,-8.2041 -3.23197,-9.3065 -0.4719,-1.1024 13.93698,-10.2513 32.01973,-20.331 18.08275,-10.0796 33.24407,-19.2812 33.69184,-20.4481 0.44776,-1.1668 -1.55365,-14.81639 -4.44757,-30.33235 l -5.26168,-28.21084 4.27991,-5.34849 c 3.66018,-4.57404 4.28125,-7.51957 4.28918,-20.34233 l 0.009,-14.99383 14.00296,-6.92885 14.00295,-6.92884 V 873.94808 857.2776 l 5.13442,-0.98194 c 2.82393,-0.54007 8.91522,-1.52858 13.53619,-2.19671 6.57142,-0.95012 10.29812,-3.05686 17.10647,-9.67044 l 8.70469,-8.45567 11.36621,8.74609 c 6.25142,4.81036 11.36621,9.93338 11.36621,11.3845 0,1.45113 -1.38386,8.9363 -3.07523,16.63373 l -3.07524,13.99532 7.15663,8.92923 c 3.93616,4.91109 7.35081,9.20966 7.58811,9.5524 0.2373,0.34273 5.08156,-2.35148 10.76502,-5.98715 l 10.33357,-6.6103 12.22594,16.65708 c 6.72428,9.16139 12.22572,17.73685 12.2254,19.05657 -2.9e-4,1.31972 -2.91108,10.54202 -6.46841,20.494 l -6.46785,18.0945 9.73577,3.66382 c 5.35467,2.0151 18.13754,6.79697 28.40638,10.62638 10.26883,3.82941 18.92622,7.17651 19.23866,7.438 0.31243,0.26149 -3.71118,9.95976 -8.94134,21.55169 l -9.50939,21.0763 8.38152,8.5398 c 7.0082,7.1406 10.11407,12.9757 18.9553,35.6122 5.81557,14.8898 11.70141,30.2231 13.07965,34.0739 l 2.50588,7.0015 H 275.28991 116.65383 Z"
          id="path2251"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 147.97163,1037.7116 c -1.6351,-4.7651 2.33754,-13.3107 12.40732,-26.6896 8.96648,-11.91301 10.38304,-14.99572 11.52369,-25.07773 l 1.30051,-11.49504 15.11202,-12.9322 c 10.02688,-8.58055 15.52249,-12.16672 16.33184,-10.65735 1.66245,3.10034 9.9732,51.56232 8.98632,52.40142 -0.43362,0.3686 -13.39106,7.6538 -28.79431,16.1893 -15.40325,8.5354 -29.81241,16.6819 -32.02036,18.1033 -3.24965,2.092 -4.17306,2.122 -4.84703,0.1579 z"
          id="path2290"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 73.748901,1110.7023 c 0,-4.7277 3.365712,-9.4896 18.203843,-25.7551 15.870626,-17.3973 20.596886,-21.2998 36.874446,-30.4473 l 18.67061,-10.4924 2.55416,7.5022 2.55415,7.5022 -11.24826,11.4749 c -7.88444,8.0433 -13.81862,16.6397 -19.84321,28.7452 l -8.59494,17.2704 H 93.334302 73.748901 Z"
          id="path2329"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 355.1208,907.15491 c -8.64929,-12.0191 -10.38463,-15.56822 -8.63993,-17.67045 3.57756,-4.3107 5.94134,-2.97496 15.45909,8.7357 8.10868,9.97695 8.93723,11.83776 7.8504,17.63103 -0.66828,3.56226 -1.80712,6.44686 -2.53075,6.41021 -0.72363,-0.0367 -6.1861,-6.83457 -12.13881,-15.10649 z"
          id="path2368"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 96.567155,139.77985 -5.511823,0.66142 -2.645677,3.96852 3.527567,2.20473 v 2.20472 l -3.307093,0.22048 v 2.64567 h -5.511824 l -0.440946,3.74804 8.157498,2.20473 1.543312,-1.98425 -1.984259,-1.32284 1.763784,-1.98426 h 3.748043 l 6.614183,-5.73229 3.52757,-1.10237 -0.88189,-3.74804 -3.08662,-0.22047 -2.86615,-5.7323 z"
          id="path2520"
        />
        <GreenSpaces
          d="m 328.58235,590.90874 c -7.64347,-2.12324 -14.11954,-4.08688 -14.39127,-4.36364 -0.27174,-0.27677 -0.24502,-3.18285 0.0594,-6.45795 l 0.55344,-5.95473 h 10.71302 10.71303 v -4.92861 -4.92861 l 6.24963,-0.58564 6.24963,-0.58563 v -4.69919 -4.69918 l -6.57481,-4.09801 -6.57481,-4.098 4.61668,-6.9373 c 2.53917,-3.81551 4.84163,-6.9403 5.11656,-6.94396 1.39992,-0.0186 20.37161,-2.51296 20.50691,-2.69616 0.0868,-0.11752 2.14887,-3.19143 4.5824,-6.8309 l 4.42461,-6.61723 5.03176,10.10304 5.03176,10.10305 5.97603,0.56 5.97602,0.56 1.29924,5.92088 c 0.71458,3.25648 1.1527,6.15798 0.9736,6.44777 -0.1791,0.28978 -3.05847,1.35308 -6.39859,2.36288 -5.65411,1.70936 -6.92469,2.58046 -18.42222,12.63003 l -12.34926,10.79405 h -7.09757 -7.09757 l -3.64371,3.9581 c -2.00403,2.17695 -3.65792,4.14558 -3.6753,4.37474 -0.0174,0.22915 1.64851,1.47806 3.70196,2.77536 l 3.73356,2.35873 -2.62458,3.26594 c -1.44352,1.79626 -2.65557,3.22199 -2.69344,3.16827 -0.0379,-0.0537 -6.32261,-1.83486 -13.96608,-3.9581 z"
          id="path2559"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 63.799291,166.88846 1.870945,-4.86445 5.987031,2.80641 v 3.7419 l -4.303178,0.56128 z"
          id="path2631"
        />
        <GreenSpaces
          d="m 71.657267,164.83042 7.857977,1.12257 2.245138,-2.05804 3.554799,0.93547 v -4.30317 l -4.303178,-1.30967 1.665356,-3.78415 -4.097589,-1.64159 -3.554799,-1.49676 -2.245135,3.18061 2.148994,4.8044 z"
          id="path2633"
        />
        <GreenSpaces
          d="m 248.75941,634.48071 c -3.41768,-2.15357 -6.2868,-3.97118 -6.37582,-4.03913 -0.19019,-0.1452 5.97468,-15.98394 6.3786,-16.38786 0.21588,-0.21588 14.1517,5.95906 14.33697,6.35268 0.34038,0.7232 -1.10991,16.28058 -1.5556,16.687 -0.33701,0.30733 -1.95317,0.7262 -3.59146,0.93083 -2.6919,0.33623 -3.57705,-0.005 -9.19269,-3.54352 z"
          id="path2672"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 270.02484,630.05243 c 0,-3.69475 0.11919,-5.20624 0.26485,-3.35886 0.14567,1.84738 0.14567,4.87035 0,6.71773 -0.14566,1.84738 -0.26485,0.33589 -0.26485,-3.35887 z"
          id="path2711"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 264.32496,629.61596 c 0.23384,-4.12927 0.57042,-7.65302 0.74796,-7.83056 0.17754,-0.17754 1.307,0.18615 2.5099,0.80819 l 2.18711,1.131 v 6.25761 6.25762 l -2.20978,0.44195 c -1.21538,0.24308 -2.53616,0.44196 -2.93507,0.44196 -0.47677,0 -0.5796,-2.57239 -0.30012,-7.50777 z"
          id="path2750"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 293.93071,625.39429 c -3.24071,-0.48399 -5.99561,-0.98629 -6.12199,-1.11622 -0.12637,-0.12993 -1.01481,-4.37294 -1.97431,-9.42892 l -1.74453,-9.19268 2.20949,-13.46509 2.20949,-13.46509 11.36145,4.62859 11.36145,4.6286 -3.0552,7.00722 c -1.68035,3.85397 -2.93203,7.13039 -2.7815,7.28092 0.15054,0.15053 3.73151,1.33202 7.95773,2.62552 l 7.68403,2.35182 0.20152,7.15896 c 0.11083,3.93743 -0.003,7.15896 -0.25392,7.15896 -0.25049,0 -3.12606,-0.70044 -6.39016,-1.55654 l -5.93473,-1.55653 -2.65048,2.45559 c -6.15589,5.70328 -5.51457,5.46515 -12.07834,4.48489 z"
          id="path2789"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 279.4851,595.17195 -3.32383,-7.54603 3.69884,-5.27268 c 2.03436,-2.89996 4.01705,-5.28194 4.40597,-5.29327 2.46122,-0.0717 2.50301,1.01373 0.51522,13.38386 l -1.97237,12.27415 z"
          id="path2828"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 279.08099,623.31309 c -3.24071,-0.50609 -5.99137,-1.02647 -6.11257,-1.15641 -0.2994,-0.32098 8.7635,-12.91202 9.4787,-13.16869 0.31282,-0.11227 0.76639,1.00146 1.00792,2.47495 0.24153,1.47349 0.88362,4.98609 1.42686,7.80577 0.54323,2.81968 0.78602,5.09021 0.53951,5.04562 -0.24651,-0.0446 -3.0997,-0.49515 -6.34042,-1.00124 z"
          id="path2867"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 78.664466,211.2789 3.792474,-0.76672 -0.569979,-2.4699 7.979704,-3.98986 -1.329952,-6.07977 4.369837,-11.58957 -9.879632,-1.89993 -11.779562,6.83975 2.469907,7.9797 3.039888,3.22988 1.709936,4.17985 0.197379,4.56657"
          id="path2939"
        />
        <GreenSpaces
          d="m 313.30294,768.06727 c -4.18488,-5.94462 -11.64452,-15.51884 -16.57697,-21.27605 l -8.96808,-10.46764 9.6775,-4.89416 c 5.32263,-2.69178 9.99987,-4.54671 10.39387,-4.12207 0.394,0.42464 2.19534,4.60859 4.00297,9.29765 3.20329,8.30949 5.20636,11.40744 5.20636,8.05216 0,-0.91294 -1.57643,-5.4828 -3.50318,-10.15522 -1.92676,-4.67243 -3.50319,-8.65497 -3.50319,-8.8501 0,-0.19513 3.15287,-2.03525 7.00637,-4.08915 3.85351,-2.05389 7.00638,-4.18662 7.00638,-4.73939 0,-1.50414 -0.62642,-1.3119 -8.22629,2.5245 l -6.99197,3.52953 -1.02978,-2.65374 c -0.56638,-1.45955 -2.11565,-5.3846 -3.44283,-8.72234 l -2.41305,-6.0686 6.08911,-3.47142 c 5.44718,-3.10545 6.64309,-3.36356 11.34389,-2.44829 2.89013,0.56272 5.64451,1.04601 6.12083,1.07398 0.47632,0.028 3.73946,5.7803 7.25142,12.78295 3.51196,7.00264 6.93322,12.91469 7.60279,13.13788 0.71768,0.23923 -0.47643,4.71943 -2.90901,10.91444 l -4.12642,10.50864 2.37203,10.30583 c 1.30462,5.66821 2.37204,10.78502 2.37204,11.37068 0,0.85835 -15.16966,9.26832 -16.71791,9.26832 -0.2354,0 -3.85199,-4.86377 -8.03688,-10.80839 z"
          id="path2978"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 341.17839,724.31814 c -2.3347,-3.77762 -11.0725,-21.95642 -10.72201,-22.3069 0.39633,-0.39634 18.28685,3.04206 18.77077,3.60757 0.12885,0.15056 -1.45622,4.69975 -3.52236,10.1093 -2.06614,5.40956 -4.10302,9.27507 -4.5264,8.59003 z"
          id="path3017"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 286.07058,730.53055 c -0.35571,-1.99037 -1.04376,-5.98351 -1.52901,-8.87364 l -0.88227,-5.25478 7.05588,-4.33776 c 3.88073,-2.38576 7.6398,-4.3563 8.35348,-4.37898 0.71368,-0.0227 2.37043,2.71753 3.68168,6.08935 1.31124,3.37182 2.73553,7.00181 3.16508,8.06666 0.61687,1.52916 -1.31854,3.02604 -9.20855,7.12204 l -9.98955,5.18597 z"
          id="path3056"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 298.04255,788.31111 c -0.78236,-11.18927 -6.47888,-24.20391 -13.5671,-30.99627 -4.17787,-4.00349 -5.38067,-6.39159 -8.90433,-17.67917 -2.24069,-7.17774 -4.07398,-13.85164 -4.07398,-14.8309 0,-0.97925 2.29162,-3.06127 5.09249,-4.6267 l 5.09248,-2.84625 1.41818,9.53234 1.41818,9.53235 9.92321,11.60581 c 9.33988,10.92356 21.98582,27.92212 23.27847,31.29071 0.35882,0.93506 -1.28109,2.36032 -4.26285,3.70491 -4.77097,2.15141 -4.83565,2.26069 -4.17794,7.05923 l 0.66806,4.874 -5.64298,1.11576 -5.64299,1.11576 z"
          id="path3095"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 259.99888,204.32758 c 0.0101,-10.28067 0.32959,-11.72122 5.27806,-23.79648 l 5.26733,-12.85334 -0.77259,-17.6375 -0.7726,-17.63749 5.58976,-0.76616 c 3.07437,-0.42139 10.38019,-0.80798 16.23517,-0.85908 5.85497,-0.0511 15.03538,-0.45752 20.40091,-0.90316 l 9.7555,-0.81024 10.21457,10.68462 10.21457,10.68463 13.91603,0.53307 c 11.27994,0.43209 15.11273,1.05616 20.23356,3.29449 7.8303,3.42266 7.58555,3.54606 -15.08119,7.60425 -9.31867,1.66838 -17.29775,3.39582 -17.73128,3.83875 -0.43353,0.44293 -0.32497,3.17151 0.24123,6.06352 0.56621,2.892 1.05237,7.43299 1.08036,10.09109 l 0.0509,4.83291 -13.14547,2.42963 c -7.23001,1.3363 -15.51165,2.77323 -18.40366,3.19317 -2.892,0.41995 -5.91546,1.59032 -6.71879,2.60081 -0.83906,1.05543 -1.46061,5.1558 -1.46061,9.63565 v 7.79839 l -16.06668,0.77339 c -8.83668,0.42537 -18.82724,1.08273 -22.20124,1.4608 l -6.13455,0.68742 0.0107,-10.94314 z"
          id="path4950"
          transform="scale(0.26458333)"
        />
        <GreenSpaces
          d="m 259.99888,204.32758 c 0.0101,-10.26932 0.334,-11.73447 5.2609,-23.79503 l 5.25017,-12.8519 -0.76053,-17.63824 -0.76053,-17.63825 5.59486,-0.76686 c 3.07716,-0.42177 10.38528,-0.80867 16.24026,-0.85977 5.85497,-0.0511 14.98493,-0.45382 20.2888,-0.89492 l 9.64339,-0.80201 10.64324,10.68768 10.64324,10.68767 13.59946,0.52179 c 10.95813,0.42044 14.82648,1.05811 19.91701,3.2832 7.82127,3.41871 7.60353,3.52888 -15.08119,7.63151 -9.31867,1.68532 -17.29775,3.41356 -17.73128,3.84052 -0.43353,0.42696 -0.32497,3.14248 0.24123,6.03449 0.56621,2.892 1.05237,7.43299 1.08036,10.09109 l 0.0509,4.83291 -13.14547,2.42963 c -7.23001,1.3363 -15.30769,2.76638 -17.9504,3.17795 -7.47988,1.16491 -7.95061,1.80067 -8.43495,11.39199 l -0.43786,8.67081 -15.94661,0.76702 c -8.77063,0.42187 -18.70716,1.07637 -22.08116,1.45444 l -6.13455,0.68742 0.0107,-10.94314 z"
          id="path4989"
          transform="scale(0.26458333)"
        />
        <Road
          stroke-width="2px"
          d="m 47.333394,-0.30212805 18.026973,26.18443005 5.236884,8.560293 0.503547,9.869517 -3.021279,6.747526 0.805674,15.207112 -1.208513,1.510641 -5.539012,0.201417 1.611349,7.150364 0.906383,6.445398 0.503547,15.207112 0.704967,30.817058 2.618441,3.82696 1.208513,11.78299 0.402836,17.01988 -1.007091,16.21421 -3.52483,6.04255 -4.733337,7.04966 -3.927666,-0.10071 0.704967,8.05675 -0.906386,2.01419 -5.337593,0.60425 0.604255,7.15037 -1.107802,5.4383 0.100708,4.73334 2.114897,5.3376 0.604255,11.8837 3.222699,4.3305 v 7.5532 l -2.517732,3.42412 -9.063842,7.65391 -0.402839,5.74043 -6.042559,8.25816 -0.302128,2.31632 2.417024,6.34468 -5.941851,5.84115 -5.438306,10.57447"
        />
        <Road
          stroke-width="1px"
          d="m 70.597251,34.442595 9.120264,-0.358428 5.445956,-0.469479 5.352058,5.445955 8.356724,0.65727 3.755827,2.253499 2.3474,15.023324 3.84973,1.12675 6.94828,-0.938956 1.97181,13.896572 10.14075,0.938959 -0.56338,11.549181 -8.35672,7.13608 -10.9858,4.413102 -10.046853,9.577366 -3.755832,11.0797 -2.159603,5.91544 -2.159603,9.57737 -6.948286,7.22997 -8.262829,0.28169 -4.956276,4.43073"
        />
        <Road
          stroke-width="2px"
          d="m 82.909973,138.49627 -6.009331,9.48347 -1.971812,12.30035 1.971812,10.32854 6.009331,7.79335 4.882578,9.10789 2.159603,4.4131 3.098562,0.65727 7.981144,7.69945 6.85439,9.76517 8.73231,15.68059 8.16893,16.80734 20.28149,24.22512 31.17339,24.03732 6.38492,1.03285 4.97647,3.84972"
        />
        <Road
          stroke-width="2px"
          d="m 210.02986,40.174751 -58.11324,31.392365 -14.20131,4.484624 -9.82926,-4.033679"
        />
        <Road
          stroke-width="1px"
          d="m 56.487713,50.055364 0.935614,16.139348 -7.601865,1.520372 -1.520373,-3.976359 32.7465,-1.988183 v -5.028924 l -32.04479,1.286467 -0.70171,5.847591 H 40.58227 l -0.935614,5.145878 9.82395,-0.935614 -2.339035,9.005289 29.354899,-1.988181 7.017107,-3.27465 3.040746,1.98818 6.432349,-1.052566 2.806843,2.57294 5.613685,-2.923795 13.68336,-1.637325 -6.25535,-12.634346 -9.065335,2.45954 -1.637325,-6.081493 17.42582,-1.98818 12.98165,-1.754277 1.05256,2.105132 -6.3154,4.678072 -3.04074,-1.988181 -0.81866,-7.601866 -28.653192,3.508554 v 4.56112 l -9.706999,0.584759 0.116952,-4.911976 10.876516,-1.871228 -1.052566,-5.730638 11.639589,-2.119412 10.6982,-0.570479 2.44721,15.781597"
        />
        <Road
          stroke-width="1px"
          d="m 47.13157,77.071227 1.403421,34.617733 18.946191,-0.58476 8.069672,-6.43235 5.730637,-0.35086 7.601868,-6.432344 7.484914,-1.403421 0.70171,-9.590048 -3.040745,-4.795023 9.005282,-3.859408 5.96455,-6.198446"
        />
        <Road
          stroke-width="1px"
          d="m 85.140902,101.6311 -5.379783,-8.420525 -3.27465,-4.327216 -0.233905,-7.601868 -28.770138,1.871229 -8.771385,0.233905 -0.584758,7.017107 -1.637326,12.864698 39.412753,-2.9238 -1.754277,10.52566 4.911974,5.02893 10.174806,-1.28647 0.116953,3.04075 -2.57294,1.05256 0.233905,5.73064 -12.630796,-3.85941 -5.262829,-5.73064 -1.637324,-3.74245"
        />
        <Road
          stroke-width=".5px"
          d="M 64.79129,88.181647 38.009329,89.818974"
        />
        <Road
          stroke-width="1.5px"
          d="m 133.75799,295.4915 -3.05983,-8.52379 -17.04758,-20.1074 -4.58974,-5.46398 0.21856,-7.21244 3.05983,-5.24541 -3.27839,-9.39803 -6.11964,-8.96091 -5.901091,-8.08668 -5.682528,-8.30523 -5.026853,-5.46397 -5.463971,-7.86812 -5.24541,-6.11965 -1.748472,-10.49082 -4.786262,-7.80229 10.031674,9.11364 4.589735,11.58362"
        />
        <Road
          stroke-width=".5px"
          d="m 85.456492,189.70904 -9.835145,5.02685 -1.748472,-10.49082"
        />
        <Road
          stroke-width="2px"
          d="m 109.06084,261.39633 -17.703259,-24.26003 -6.775323,-10.0537 -8.523793,-6.55677 -6.993881,-9.61658 -0.21856,-7.21244 -4.371175,-8.74236 -3.646403,-5.41946"
        />
        <Road
          stroke-width=".5px"
          d="m 69.064584,210.90925 v 0 h -6.993882 l -2.622707,-5.24542 -7.481972,1.59601"
        />
        <Road
          stroke-width="2px"
          d="m 56.90078,238.98328 7.13695,-3.59545 v -8.96091 l 7.212441,-1.09279 4.808292,-4.8083"
        />
        <Road
          stroke-width="2px"
          d="m 82.909973,138.49627 12.600225,-7.79811 6.119642,-7.64955 5.46397,-9.39803 5.24542,-6.33821 0.65567,-10.053702 0.65568,-2.622706 8.08667,0.437118 5.90109,-1.092793 -2.40414,-4.589735 -6.26825,1.31277 -4.00402,-7.432418 -2.40415,-3.278381 0.43712,-5.463971 -9.83514,8.523793 v 8.742354 l 8.74235,-1.529913 -3.92196,4.851638"
        />
      </BackgroundImage>
    </Board>
  );
};

// <BackgroundImage>
//   <defs></defs>
//   <path
//     d="M 85 0 l 45,80 l -5,5 l 5,15 l -10,10"
//     stroke="black"
//     stroke-width="1px"
//     // fill="#152642"
//   />
// </BackgroundImage>
// <?xml version="1.0" encoding="UTF-8" standalone="no"?>
// <!-- Created with Inkscape (http://www.inkscape.org/) -->
//
//
//     <BackgroundImage src="test_map.png" />
