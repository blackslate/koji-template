/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */

/* global sndMusic */

import React, { Component } from 'react'
import GameOverScreen from './GameOver'
import { StyledGame, StyledButton } from './Styles/styles.js'
import settings from '../../utilities/settings.js'
import achievement from '../../utilities/achievement.js'



class Game extends Component {
  constructor({ setView, setScore }) {
    super()
    this.setView  = setView
    this.setScore = setScore
    this.settings = settings.getGameSettings()
    this.mounted  = false

    this.play = this.play.bind(this)
    this.newAchievement = this.newAchievement.bind(this)

    const trophies = achievement.setListener(this.newAchievement)
    this.state = { trophies, gameOver: false }
  }


  componentDidMount() {
    this.mounted = true
  }


  componentWillUnmount() {
    this.mounted = false
  }


  newAchievement(trophies, newTrophy) {
    if (!this.mounted) {
      return
    }

    this.setState({ trophies })

    // TODO: Show newTrophy notification as overlay
    console.log("Game: new trophy", newTrophy)
  }


  play() {
    const score = Math.floor(Math.random() * 90) + 10
    console.log(score)
    this.setScore(score)
    this.setState({ gameOver: true })

    achievement.setStats("unlockThree", true)
    achievement.incrementStats("unlockFour")
    achievement.unlock("five")
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
