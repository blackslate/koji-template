import styled, { css } from 'styled-components'
import Koji from '@withkoji/vcc'
import { toneColor
       , getFontFamily
       } from '../../utilities/utilities'


const titleFont = getFontFamily(Koji.config.text.titleFont)
const textFont = getFontFamily(Koji.config.text.textFont)
const colors = {
  text: Koji.config.colors.textColor

, btnTint: toneColor(Koji.config.colors.buttonColor, 1.5)
, btnShade: toneColor(Koji.config.colors.buttonColor, 0.75)
, hoverTint: toneColor(Koji.config.colors.buttonHoverColor, 1.5)
, hoverShade: toneColor(Koji.config.colors.buttonHoverColor, 0.75)
, clickTint: toneColor(Koji.config.colors.buttonClickColor, 1.25)
, clickShade: toneColor(Koji.config.colors.buttonClickColor, 0.75)

, playTint: toneColor(Koji.config.game.buttonColor, 1.5)
, playShade: toneColor(Koji.config.game.buttonColor, 0.75)
, playHoverTint: toneColor(Koji.config.game.buttonHoverColor, 1.5)
, playHoverShade: toneColor(Koji.config.game.buttonHoverColor, 0.75)
, playClickTint: toneColor(Koji.config.game.buttonClickColor, 1.25)
, playClickShade: toneColor(Koji.config.game.buttonClickColor, 0.75)

, closeTint: toneColor(Koji.config.colors.backgroundColor, 1.1)
, closeShade: toneColor(Koji.config.colors.backgroundColor, 0.9)
, closeActiveTint: toneColor(Koji.config.colors.backgroundColor, 1.333)
, closeActiveShade: toneColor(Koji.config.colors.backgroundColor, 0.75)
}

// LOADER // LOADER // LOADER // LOADER // LOADER // LOADER //

export const StyledLoader = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};
  display: flex;
  flex-direction: column
  justify-content: space-between;
  align-items: center;

  & img {
    width: 10vmin;
  }

  & h1, h2 {
    color: ${colors.text}
  }
`

// MENU // MENU // MENU // MENU // MENU // MENU // MENU // MENU //

export const StyledMenu = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};
  color: ${colors.text};
  font-family: ${textFont};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  & h1 {
    font-size: ${Koji.config.game.titleSize}vmin;
    margin-bottom: 0;
  }

  & p {
    font-size: ${Koji.config.game.rulesSize}vmin;
    margin: 0;
  }

  & p:empty {
    font-size: ${Koji.config.game.rulesSize / 2}vmin;
  }

  & p:empty::after {
    content: " ";
  }
`

export const StyledMenuButtons = styled.div`
  width: 100%;
  height: ${Koji.config.text.buttonHeight}vmin;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  & button {
    width: ${(props) => (100 / props.count)}vw;
    height: 100%;
    font-family: ${titleFont};
    font-size: ${(props) => (
      Koji.config.text.buttonTextRatio / props.count
    )}vw;
    border-radius: ${Koji.config.text.buttonRadius}vmin;
    background-color: ${Koji.config.colors.buttonColor};
    color: ${Koji.config.colors.buttonTextColor}
    border: 0.5vmin solid ${colors.btnTint};
    border-right-color: ${colors.btnShade};
    border-bottom-color: ${colors.btnShade};
  }

  & button:hover {
    background-color: ${Koji.config.colors.buttonHoverColor};
    border: 0.5vmin solid ${colors.hoverTint};
    border-right-color: ${colors.hoverShade};
    border-bottom-color: ${colors.hoverShade};
  }

  & button:active {
    background-color: ${Koji.config.colors.buttonClickColor};
    border: ${Koji.config.text.buttonBorder}vmin solid ${colors.clickTint};
    border-top-color: ${colors.clickShade};
    border-left-color: ${colors.clickShade};
  }

  & button:focus {
    outline: 0;
  }
`

export const StyledPlayButton = styled.button`
  width: 45vmin;
  height: 20vmin;
  font-family: ${titleFont};
  font-size: ${Koji.config.game.buttonTextSize}vmin;
  border-radius: 4.5vmin;
  background-color: ${Koji.config.game.buttonColor};
  color: ${Koji.config.game.buttonTextColor}
  border: 0.5vmin solid ${colors.playTint};
  border-right-color: ${colors.playShade};
  border-bottom-color: ${colors.playShade};

  &:hover {
    background-color: ${Koji.config.game.buttonHoverColor};
    border: 0.5vmin solid ${colors.playHoverTint};
    border-right-color: ${colors.playHoverShade};
    border-bottom-color: ${colors.playHoverShade};
  }

  &:active {
    background-color: ${Koji.config.game.buttonClickColor};
    border: 0.5vmin solid ${colors.playClickTint};
    border-top-color: ${colors.playClickShade};
    border-left-color: ${colors.playClickShade};
  }

  &:focus {
    outline: 0;
  }
`

// HEADER // HEADER // HEADER // HEADER // HEADER // HEADER //

export const StyledHeader = styled.div`
  width: 100%;
  height:  ${Koji.config.text.headerHeight}vmin;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: ${titleFont};
  font-size: ${Koji.config.text.headerFontSize}vmin;
  color: ${Koji.config.colors.titleColor};

  & h1 {
    position: relative;
    top: 0.1em;
    font-weight: normal;
  }
`

// ACHIEVEMENTS // ACHIEVEMENTS // ACHIEVEMENTS // ACHIEVEMENTS //

export const StyledAchievement = styled.li`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 90vmin;
  height: 15vh;
  color: ${Koji.config.achievements.color};
  background-color: ${Koji.config.achievements.bgColor};
  border-radius: ${Koji.config.achievements.radius}vmin;
  margin: 1vmin auto;

  & img {
    margin: 0 4vmin;
    ${props => props.unlocked
             ? ""
             : `filter: saturate(0%);opacity:0.25`
     }
    height: 80%;
  }

  & div {
    ${props => props.unlocked
             ? ""
             : "opacity:0.5;"
     }
    max-height: 100%;
    overflow: hidden;
    margin: 0 4vmin 0 0;
  }

  & h1 {
    margin: 0;
    font-size: 1.25em;
  }

  & p {
    margin: 0;
  }
`

export const StyledAchievements = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};

  & ul {
    height: calc(100vh - ${Koji.config.text.headerHeight}vmin);
    margin: 0;
    padding: 0 5vmin;
    font-size: ${Koji.config.achievements.fontSize}vmin;
    overflow-y: auto;
  }
`

export const StyledSettings = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};
`


export const StyledSettingLabel = styled.label`
  display: flex;
  flexDirection: column;
  justifyContent: center;
  textAlign: center;
  margin: 0 auto;
  fontFamily: font;
  color: ${Koji.config.colors.textColor};
  fontSize: ${Koji.config.settings.buttonSize}vmin;
  borderWidth: ${Koji.config.settings.borderWidth}vmin;
  borderStyle: solid;
`


export const StyledGame = styled.div`
`

export const StyledGameOver = styled.div`
`

export const StyledScore = styled.div`
`

export const StyledLeaderboard = styled.div`
`

export const StyledCredits = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};
  color: ${colors.text};
  text-align: center;

  & ul {
    height: calc(100vh - ${Koji.config.text.headerHeight}vmin);
    list-style: none;
    margin: 0;
    padding: 0;
    overflow-y: auto
  }

  & h1 {
    font-size: ${Koji.config.credits.h1Size}vmin;
    margin: 1em 0 0;
    position: relative;
    top: -3vmin;
    display: flex;
    justify-content: center;
  }

  & ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }


  & h2 {
    font-size: ${Koji.config.credits.h2Size}vmin;
    margin: 1.5em 0 0;
  }

  & p {
    font-size: ${Koji.config.credits.fontSize}vmin;
    margin: 0.25em;
  }

  & a {
    color: ${colors.text}
  }

`
  // position: absolute;
  // top: 0;
  // right: 0;
export const StyledCloseButton = styled.button`

  width: 7vmin;
  height: 7vmin;

  background-color: transparent;
  border: 0.5vmin solid ${colors.closeTint};
  border-bottom-color: ${colors.closeShade};
  border-right-color: ${colors.closeShade};

  &:hover {
    border: 0.5vmin solid ${colors.closeActiveTint};
    border-bottom-color: ${colors.closeActiveShade};
    border-right-color: ${colors.closeActiveShade};
  }

  &:active {
    background-color: ${colors.closeShade};
    border: 0.5vmin solid ${colors.closeActiveTint};
    border-top-color: ${colors.closeActiveShade};
    border-left-color: ${colors.closeActiveShade};
  }

  &:focus {
    outline: none;
  }

  &::after {
    content: "×";
    color: ${Koji.config.colors.titleColor};
    font-size: 10vmin;
    position: relative;
    top: -3vmin;
    display: flex;
    justify-content: center;
  }

`