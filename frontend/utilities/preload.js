/** preload.js **
 *
 * Iterates through all the items in all the config settings, looking
 * for images and sounds to preload. Returns a promise that resolves
 * when all assets are in a usable state.
**/


import Koji from '@withkoji/vcc'
import { removeFrom } from './utilities.js'


export const preload = (milliseconds) => {
  const config     = Koji.config
  const sections   = Object.keys(config)
  const extensions = ["mp3","ogg","jpg","jpeg","png","gif","svg","webp"]

  const images = [Koji.config.assets.spinner]
  const sounds = []


  sections.forEach( section => {    
    const addURL = (item) => {
      const extension = item.substring(item.lastIndexOf(".")+1)
      const index = extensions.indexOf(extension)

      if (index < 0) {
        // ignore non-file strings and files with unknown extensions
      } else if (index > 1) {
        images.push(item) 
      } else { // "mp3", "ogg"
        sounds.push(item)
      }
    }

    const findURLs = (object) => {
      const keys = Object.keys(object)

      keys.forEach( key => {
        const item = object[key]

        switch (typeof item) {
          case "string":
            return addURL(item)
          case "object":
            findURLs(item)
        }
      })
    }

    findURLs(config[section])
  })

  // console.log("images:", images)
  // console.log("sounds:", sounds)

  const unresolved = images.concat(sounds)

  const promiseArray = images.map( url => (
    new Promise((resolve, reject) => {
      removeFrom(unresolved, url)
      const fileName = url.substring(url.lastIndexOf("/") + 1)
      const image = new Image()
      image.onload = () => {
        resolve(0)
        removeFrom(unresolved, url)
      }
      image.onerror = () => resolve(fileName)
      image.src = url
    })
  )).concat( sounds.map( url => (
    new Promise((resolve, reject) => {
      const fileName = url.substring(url.lastIndexOf("/") + 1)
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        resolve(0)
        removeFrom(unresolved, url)
      }
      audio.onerror = () => resolve(fileName)
      audio.src = url
      audio.load()
    })
  )))
  .concat([new Promise((resolve, reject) => {
    // Show spinner for `milliseconds` at the most, and then show an 
    // warning in the console to indicate which items failed to load.
    
    const duration = Math.round(milliseconds / 1000)
    let iterations = 100
    const delay    = Math.ceiling(milliseconds / iterations)

    const timeout = () => {
      if (!iterations--) {
        console.warn( `Assets not loaded after ${duration}s:\n`
                   + "————————————\n"
                   + unresolved.join("\n"))
        reject(unresolved)

      } else if (!unresolved.length) {
        resolve()

      } else {
        setTimeout(timeout, delay)
      }
    }

    timeout()
  })])

  return Promise.all(promiseArray)
}