/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */

/** achievements.js **
 *
 * The Achievements class reads in the details of the trophies that
 * are defined in the .koji/customization/achievement.json file.
 * 
 * Each trophy in that file has a custom key. You will need to edit
 * the Achievements class so that it has a method corresponding to 
 * each key. This method will be called to check if that particular
 * trophy has been unlocked.
 * 
 * You can update the state property of the Achievements instance, in
 * order to provide the raw data from which the achievements can be
 * calculated. Se the following public methods for more details;
 * 
 *   setStats(key, value)
 *   
 *   incrementStats(key [, increment])
 * 
 * To test these methods, open your game at the Achievements page and
 * run the following commands in the Developer Tools console:
 * 
 *   kojiTest.achievements.setStats("unlockThree", true)
 *   
 *   kojiTest.achievements.incrementStats("unlockFour")
 *   (You'll need to do this 4 times)
 *   
 * The achievements are stored as "achievements" in localStorage. To 
 * reset your game, you can run the following command in the browser
 * console:
 *    
 *    window.localStorage.removeItem("KojiGame_b6342f53")
 *    
 * Note: the name of the item to remove is set as "storageName" in
 * .koji/customization/settings.json
 *    
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
