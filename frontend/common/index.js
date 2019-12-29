/* eslint-disable global-require */

/**
 * common/index.js
 *
 * What it Does:
 *   This file sets up our app to render inside the root html file.
 *   Both the global css file and the css file dedicated to the
 *   setScore and leaderboard layouts are imported here.
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Koji from '@withkoji/vcc'

import App from '../app/react/App'

import './index.css'
import './leaderboardStyles.css'
import '../app/react/Styles/rangeInput.css'

// Make Koji global, to simplify debugging
window.Koji = Koji


const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  )
}

render(App)



// Add a <link> in the <head> of index.html file for each custom font
// defined in a json file at .koji/customization/

;(function addLinksForCustomFonts(){
  const fonts = []
  const vccs = Object.keys(Koji.config)

  vccs.forEach( vcc => {
    const settings = Koji.config[vcc]
    const keys = Object.keys(settings)

    keys.forEach( key => {
      const value = settings[key]
      if (typeof value === "string") {
        if (value.startsWith("https://fonts.googleapis.com/")) {
          fonts.push(value)
        }
      }
    })
  })

  const addLinkForFont = (font) => {
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', font)
    document.head.appendChild(link)
  }

  fonts.forEach( font => addLinkForFont(font) )
}())



// in development, set up HMR:
if (module.hot) {
  module.hot.accept('../app/react/App', () => { render(App) })
}
