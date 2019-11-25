/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import { StyledMenu
       , StyledPlayButton
       , StyledMenuButtons } from './styles.js'


const Title = () => {
  return <h1>{Koji.config.game.title}</h1>
}


const Rules = () => {
  const rules = Koji.config.game.rules.split("\n").map((line, index) => (
    <p key={index}>{line}</p>
  ))
  return <div>{rules}</div>
}


class Menu extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView
  }

  createButtonDiv() {
    const viewMap = Koji.config.views
    const views = Object.keys(viewMap).filter( key => {
      const value = viewMap[key]
      return (isNaN(value)) ? false : value
    }).sort(( a, b ) => (viewMap[a] - viewMap[b]))

    const buttonsArray = views.map(view => {
      const text = Koji.config[view].title
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
          {Koji.config.game.buttonText}
        </StyledPlayButton>
        {buttonDiv}
      </StyledMenu>
    )
  }
}

export default Menu
