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
import storage from '../../utilities/storage.js'
import { StyledAchievement
       , StyledAchievements } from './styles.js'





class Achievements extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView

    this._save = this._save.bind(this)
    this._saveState = this._saveState.bind(this)
    this.storageItem = "achievements"
    
    this.state = this._getInitialState()

    // For testing only. Remove for production
    window.kojiTest = { achievements: this }
  }

  /// PUBLIC METHODS

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
 

  setStats(key, value) {
    if (typeof key !== "string") {
      return
    } else if (key === "trophies") {
      return
    }

    this._saveState({ [key]: value })
  }


  incrementStats(key, increment) {
    if (typeof key !== "string") {
      return
    } else if (key === "trophies") {
      return
    } else if (isNaN(increment)) {
      increment = 1
    }

    const value = isNaN(this.state[key])
                ? increment
                : this.state[key] + increment

    this._saveState({ [key]: value })
  }


  // PRIVATE METHODS

  _getInitialState() {
    const state = storage.getItem(this.storageItem) || {}

    if (!state.trophies) {
      state.trophies = {}
    }

    return state
  }


  _getUnlocked(key) {
    let unlocked = this.state.trophies[key]

    if (!unlocked) {
      // The unique key for this trophy is also the name of the method
      // for testing if it has been unlocked
      const method = (this[key] || function () {}).bind(this)

      unlocked = method()
      if (unlocked) {
        this._unlockAchievement(key)
      }
    }

    return unlocked
  }


  _unlockAchievement(key) {
    const trophies = this.state.trophies
    trophies[key] = true

    setTimeout(
      () => this._saveState({ trophies })
    , 0
    )
  }


  _saveState(data) {
    this.setState(data)
    setTimeout(
      this._save
    , 0
    )
  }


  _save() {
    storage.setItem(this.storageItem, this.state)
  }


  _getAchievements() {
    const defaultTrophy = Koji.config.achievements.defaultTrophy

    return Koji.config.achievements.trophies.map( trophyData => (
        <StyledAchievement
          key={trophyData.key}
          unlocked={this._getUnlocked(trophyData.key)}
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


  // TESTS FOR WHETHER A GIVEN TROPHY IS NOW UNLOCKED
  // If no test is provided for a given key, the trophy cannot be
  // unlocked. You must ensure that the keys used for trophies in
  // the file at .koji/customization/achievements.json match the
  // method names below exactly.

  one() {
    // Unlocks trophy one 1 second after the user views the
    // achievements page. On the second visit, the achievment will 
    // already be unlocked.

    const unlocked = this.state.trophies.one

    if (!unlocked) {
      setTimeout(
        () => this._unlockAchievement("one")
      , 1000
      )
    }

    return unlocked
  }


  two() {
    // Gives a 1/10 chance of Unlocking trophy two each time the
    // achievements page is visited.
    return Math.random() * 10 < 1
  }


  three() {
    // To unlock trophy three, call setStats("unlockThree", true)
    // from elsewhere.
    return !!this.state.unlockThree
  }


  four() {
    // To unlock trophy 4, call incrementStats("unlockFour") 4 times
    // or incrementStats("unlockFour", 2) twice
    return this.state.unlockFour > 3
  }


  five() {
    // Method to customize
    return false
  }


  six() {
    // Method to customize
    return false
  }
}

export default Achievements
