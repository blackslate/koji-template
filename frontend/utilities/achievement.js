import storage from './storage.js'



class Achievement {
  constructor() {    
    this.storageItem = "achievements"
    this.data = this._getInitialState()
    this.listeners = []
  }


  //////// TESTS FOR WHETHER A GIVEN TROPHY IS NOW UNLOCKED ////////
  //                                                              //
  //                    CUSTOMIZE THESE METHODS                   //
  //                    ———————————————————————                   //
  // If no test is provided for a given key, the trophy cannot be //
  // unlocked. You must ensure that the keys used for trophies in //
  // the file at .koji/customization/achievements.json match the  //
  // method names below exactly.                                  //
  //                                                              //
  //////////////////////////////////////////////////////////////////

  one() {
    // Unlocks trophy one 1 second after the user views the
    // achievements page. On the second visit, the achievment will 
    // already be unlocked.

    const unlocked = this.data.trophies.one

    if (!unlocked) {
      setTimeout(
        () => this.unlock("one")
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
    // To unlock trophy three, from Game.js call...
    // 
    //   achievement.setStats("unlockThree", true)
    //   
    // ... or...
    // 
    //   achievement.unlock("three")
    
    return !!this.data.stats.unlockThree
  }


  four() {
    // To unlock trophy 4, from Game.js call...
    // 
    //   achievement.incrementStats("unlockFour")
    //   
    // ...  4 times, or ...
    // 
    //   achievement.incrementStats("unlockFour", 2) 
    //   
    // ...twice.
    
    return this.data.stats.unlockFour > 3
  }


  five() {
    // Method to customize
    return false
  }


  six() {
    // Method to customize
    return false
  }


  ///////////////////////////////////////////////////////////////////
  ///            PUBLIC METHODS: UNLOCKING ACHIEVEMENTS           ///
  /////  You should not ned to change anything below this line  /////


  unlock(key) {
    if (this.data.trophies[key]) {
      return // already unlocked
    }

    this.data.trophies[key] = true
    this._save()
    this._broadcast(key)
  }
 

  setStats(key, value) {
    if (typeof key !== "string") {
      return
    }

    this.data.stats[key] = value

    this._save()
  }


  incrementStats(key, increment) {
    if (typeof key !== "string") {
      return
    } else if (isNaN(increment)) {
      increment = 1
    }

    const value = isNaN(this.data.stats[key])
                ? increment
                : this.data.stats[key] + increment

    this.data.stats[key] = value

    this._save()
  }


  isUnlocked(key) {
    let unlocked = this.data.trophies[key]

    if (!unlocked) {
      // The unique key for this trophy is also the name of the method
      // for testing if it has been unlocked
      const method = (this[key] || function () {}).bind(this)

      unlocked = method()
      if (unlocked) {
        this.unlock(key)
      }
    }

    return unlocked
  }


  setListener(listener, remove) {
    if (typeof listener !== "function") {
      return
    }

    const index = this.listeners.indexOf(listener)

    if (!remove) {
      if (index < 0) {
        this.listeners.push(listener)
        listener(this.data.trophies)       
      }

    } else if (index > -1) {
      this.listeners.splice(index, 1)
    }
  }


  /// PRIVATE METHODS ///// PRIVATE METHODS ///// PRIVATE METHODS ///

  _getInitialState() {
    const data = storage.getItem(this.storageItem) || {}

    if (!data.trophies) {
      data.trophies = {}
    }

    if (!data.stats) {
      data.stats = {}
    }

    return data
  }


  _save() {
    storage.setItem(this.storageItem, this.data)
  }


  _broadcast(newTrophy) {
    this.listeners.forEach( listener => {
      listener(this.data.trophies, newTrophy)
    })
  }
}


export default new Achievement()