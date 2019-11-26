import Koji from '@withkoji/vcc'
import { hash } from './utilities.js'

/**
 * If window.localStorage is not available, an instance of the
 * CustomStorage class will be used instead. No data will be saved
 * to the user's hard drive.
 *
 * @class      CustomStorage (name)
 */
class CustomStorage{
  constructor() {
    this.storage = {}
  }

  setItem(key, value) {
    this.storage[key] = value
  }
}



class Storage{
  constructor() {
    this.id = Koji.config.settings.storageName
           || "store" + hash(JSON.stringify(Koji.config.settings))

    try {
      this.storage = window.localStorage
      this.settings = JSON.parse(this.storage.getItem(this.id))

    } catch(error) {
      this.storage = new CustomStorage()
    }

    if (!this.settings || typeof this.settings !== "object") {
      this.settings = {}
    }
  }


  getItem(key) {
    return this.settings[key]
  }


  setItem(key, value) {
    this.settings[key] = value
    this._save()
  }


  /**
   * Assumes settings to be a shallow map, although no error will
   * occur if it some other value.
   *
   * @settings  {object}
   */
  set(settings) {
    Object.assign(this.settings, settings)
    this._save()
  }


  restore(settings) {
    Object.assign(settings, this.settings)
  }


  _save() {
    const string = JSON.stringify(this.settings)
    this.storage.setItem(this.id, string)
  }
}



export default new Storage()