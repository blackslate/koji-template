/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */

/** achievements.js **
 *
 * The Achievements class reads in the details of the trophies that
 * are defined in the .koji/customization/achievement.json file. It
 * then displays each trophy either in its locked state (semi-
 * transparent black-and-white) or it in its unlocked state (saturated
 * color.)
 *
 * This script is self-contained and you should not need to change it.
 *
 * The script at frontend/utilities/achievement.js, however needs
 * to be customized. For each trophy key in
 * .koji/customization/achievement.json, you will need to add a method
 * with the same name that returns true when the trophy has been
 * unlocked.
**/


import React, { Component } from 'react'
import Koji from '@withkoji/vcc'
import Header from './Header.js'
import achievement from '../../utilities/achievement.js'
import { StyledAchievement
       , StyledAchievements } from './styles.js'



class Achievements extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView
    this.mounted = false

    this.newAchievement = this.newAchievement.bind(this)
    const trophies = achievement.setListener(this.newAchievement)
    this.state = { trophies }
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

    // TODO: Show newTrophy notification
    console.log("Achievements: new trophy", newTrophy)
  }


  _getAchievements() {
    const defaultTrophy = Koji.config.achievements.defaultTrophy

    return Koji.config.achievements.trophies.map( trophyData => (
        <StyledAchievement
          key={trophyData.key}
          unlocked={achievement.isUnlocked(trophyData.key)}
        >
          <img src={trophyData.image || defaultTrophy} />
          <div>
            <h1>{trophyData.name}</h1>
            <p>{trophyData.description}</p>
          </div>
        </StyledAchievement>
      )
    )
  }


  render() {
    const achievements = this._getAchievements()

    return (
      <StyledAchievements>
        <Header
          text={Koji.config.achievements.title}
          close={this.setView}
        />
        <ul>{achievements}</ul>
      </StyledAchievements>
    )
  }
}

export default Achievements
