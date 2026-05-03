import React from "react";
import styled from "styled-components";
import "App.css";


const LogoWrapper = styled.img`

  pointer-events: none;
  position: absolute;
  z-index: 999999;
  display: flex;

  ${props => `src: ${props.src};`}

  ${props => !!props.isSplashScreen ?
    ` top: 20%;
      align-self: center;
      width: 700px;
      height: 350px;
      -webkit-animation-name: fadeInLogo;
      animation-name: fadeInLogo;`
    :
    `justify-content: space-between;
      top: 0px;
      width: 600px;
      height: 300px;
      margin-top: 40px;
      margin-bottom: 30px;
      margin-left: 20px;`
  }

  -webkit-animation-duration: 3s;
  animation-duration: 3s;

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
`;


export const Logo = ({ isSplashScreen }) => {
  return <>
    <LogoWrapper
      src={isSplashScreen ? "./Logo.gif" : "./staticLogo.png"}
      isSplashScreen={isSplashScreen}
    />
    {/* {isSplashScreen && <footer className="App-header">
      <img src={"./logo.svg"} className="App-logo" alt="logo" />
      <p style={{ fontSize: "10px" }}>Made with React</p>
    </footer>} */}
  </>
};

