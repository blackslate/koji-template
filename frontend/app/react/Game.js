/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */

/* global sndMusic */

import React, { Component } from 'react'
import GameOverScreen from './GameOver'
import { StyledGame, StyledButton } from './styles.js'
import storage from '../../utilities/storage.js'


class Game extends Component {
  constructor({ setView, setScore }) {
    super()
    this.state = { gameOver: false }
    this.setView = setView
    this.setScore = setScore
    this.play = this.play.bind(this)

    console.log("Game storage", storage.stamp)
  }


  play() {
    const score = Math.floor(Math.random() * 90) + 10
    console.log(score)
    this.setScore(score)
    this.setState({ gameOver: true })
  }


  gameScreen() {
    return (
      <StyledGame>
        Your Game Goes Here
        <button
          onMouseUp={this.play}
        >
          Let's pretend that this button is the whole game
        </button>
      </StyledGame>
    )
  }


  render() {
    if (this.state.gameOver) {
      return <GameOverScreen
        setView={this.setView}
      />
      
    } else {
      return this.gameScreen()
    }
  }
}

export default Game
