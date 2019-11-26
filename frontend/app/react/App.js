/* eslint-disable react/destructuring-assignment */

import React, { Component } from 'react'

import Loader from './Loader'
import Game from './Game'
import Leaderboard from './Leaderboard'
import SetScore from './SetScore'
import Settings from './Settings'
import Achievements from './Achievements'
import Credits from './Credits'
import Menu from './Menu'


export default class App extends Component {
  constructor() {
    super()
    this.state = {
      score: 0
    , view: "loader"
    }

    this.setView = this.setView.bind(this)
    this.setScore = this.setScore.bind(this)
  }


  setView(view) {
    this.setState({ view })
  }


  setScore(score) {
    this.setState({ score })
  }


  render() {
    switch (this.state.view) {
      case "loader":
        return <Loader setView={this.setView} />

      case "play":
        return <Game
          setView={this.setView}
          setScore={this.setScore}
        />

      case "leaderboard":
        return <Leaderboard setView={this.setView} />

      case "achievements":
        return <Achievements setView={this.setView} />

      case "settings":
        return <Settings setView={this.setView} />

      case "credits":
        return <Credits setView={this.setView} />

      case "setScore":
        return <SetScore
          setView={this.setView}
          score={this.state.score}
        />

      default: // case "menu":
        return <Menu
          setView={this.setView}
        />
    }
  }
}
