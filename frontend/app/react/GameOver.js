/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import { StyledGameOver } from './styles.js'


class GameOver extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView
    this.animationDelay = 1000
  }


  componentDidMount() {
    setTimeout(
      () => this.setView("setScore")
    , this.animationDelay
    )
  }


  render() {
    return (
      <StyledGameOver>
        Game Over!
      </StyledGameOver>
    )
  }
}

export default GameOver
