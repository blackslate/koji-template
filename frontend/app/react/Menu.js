/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import { StyledMenu
       , StyledPlayButton
       , StyledMenuButtons } from './styles.js'


const Title = () => {
  return <h1>{Koji.config.strings.title}</h1>
}


const Rules = () => {
  return <p>{Koji.config.strings.rules}</p>
}


class Menu extends Component {
  constructor({ setView, views }) {
    super()
    this.views = views
    this.setView = setView
  }

  createButtonDiv() {
    const buttonsArray = this.views.map(view => {
      const key = view + "ButtonText"
      const text = Koji.config.strings[key]
      return (
        <button
          key={view}
          onMouseUp={() => this.setView(view)}
        >
          {text}
        </button>
      )
    })

    return (
      <StyledMenuButtons
        count={buttonsArray.length}
      >
        {buttonsArray}
      </StyledMenuButtons>
    )
  }

  render() {
    const buttonDiv = this.createButtonDiv()

    return (
      <StyledMenu>
        <Title />
        <Rules />
        <StyledPlayButton
          onMouseUp={() => this.setView("play")}
        >
          {Koji.config.strings.playButtonText}
        </StyledPlayButton>
        {buttonDiv}
      </StyledMenu>
    )
  }
}

export default Menu
