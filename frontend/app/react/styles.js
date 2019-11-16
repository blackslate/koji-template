import styled, { css } from 'styled-components'
import Koji from '@withkoji/vcc'
import { toneColor } from '../../utilities/utilities'


function getFontFamily(ff) {
  const start = ff.indexOf('family=')
  if (start === -1) return 'sans-serif'
  let end = ff.indexOf('&', start)
  if(end === -1) end = undefined
  ff = ff.slice(start + 7, end).replace("+", " ")
  ff = '"'+ ff + '"'
  return ff // + ', sans-serif'
}

const textFont = getFontFamily(Koji.config.strings.textFont)
const buttonFont = getFontFamily(Koji.config.strings.buttonFont)
const colors = {
  text: Koji.config.colors.textColor

, btnTint: toneColor(Koji.config.colors.buttonColor, 1.5)
, btnShade: toneColor(Koji.config.colors.buttonColor, 0.75)
, hoverTint: toneColor(Koji.config.colors.buttonHoverColor, 1.5)
, hoverShade: toneColor(Koji.config.colors.buttonHoverColor, 0.75)
, clickTint: toneColor(Koji.config.colors.buttonClickColor, 1.25)
, clickShade: toneColor(Koji.config.colors.buttonClickColor, 0.75)

, playTint: toneColor(Koji.config.colors.playButtonColor, 1.5)
, playShade: toneColor(Koji.config.colors.playButtonColor, 0.75)
, playHoverTint: toneColor(Koji.config.colors.playButtonHoverColor, 1.5)
, playHoverShade: toneColor(Koji.config.colors.playButtonHoverColor, 0.75)
, playClickTint: toneColor(Koji.config.colors.playButtonClickColor, 1.25)
, playClickShade: toneColor(Koji.config.colors.playButtonClickColor, 0.75)

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
  justify-content: center;
  align-items: center;

  & img {
    width: 10vmin;
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
    font-size: ${Koji.config.strings.titleSize + "vmin"};
  }

  & p {
    font-size: ${Koji.config.strings.rulesSize + "vmin"};
  }
`

export const StyledMenuButtons = styled.div`
  width: 100%;
  height: ${Koji.config.strings.buttonHeight + "vmin"};
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;

  & button {
    width: ${(props) => (100 / props.count) + "vw"};
    height: 100%;
    font-family: ${buttonFont};
    font-size: ${(props) => (
      Koji.config.strings.buttonTextRatio / props.count
    ) + "vw"};
    border-radius: ${Koji.config.strings.buttonRadius + "vmin"};
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
    border: 0.5vmin solid ${colors.clickTint};
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
  font-family: ${buttonFont};
  font-size: ${Koji.config.strings.playButtonTextSize + "vmin"};
  border-radius: 4.5vmin;
  background-color: ${Koji.config.colors.playButtonColor};
  color: ${Koji.config.colors.playButtonTextColor}
  border: 0.5vmin solid ${colors.playTint};
  border-right-color: ${colors.playShade};
  border-bottom-color: ${colors.playShade};

  &:hover {
    background-color: ${Koji.config.colors.playButtonHoverColor};
    border: 0.5vmin solid ${colors.playHoverTint};
    border-right-color: ${colors.playHoverShade};
    border-bottom-color: ${colors.playHoverShade};
  }

  &:active {
    background-color: ${Koji.config.colors.playButtonClickColor};
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
  height:  ${Koji.config.strings.headerHeight + "vmin"};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${Koji.config.strings.headerFontSize + "vmin"};
  color: ${Koji.config.colors.titleColor};
  font-weight: bold;
  text-transform: capitalize;
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
  border-radius: ${Koji.config.achievements.radius+ "vmin"};
  margin: 1vmin auto;

  & img {
    margin: 0 3vmin;
    ${props => props.unlocked
             ? ""
             : `filter: saturate(0%);opacity:0.25`
     }
    height: 80%;
  }

  & div {
    max-height: 100%;
    overflow: hidden;
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
    height: calc(100vh - ${Koji.config.strings.headerHeight + "vmin"});
    margin: 0;
    padding: 0 5vmin;
    font-size: ${Koji.config.strings.trophyFontSize + "vmin"};
    overflow-y: auto;
  }
`

export const StyledSettings = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${Koji.config.colors.backgroundColor};
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
    height: calc(100vh - ${Koji.config.strings.headerHeight + "vmin"});
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
    font-size: ${Koji.config.credits.pSize}vmin;
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