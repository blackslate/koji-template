/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import { preload } from '../../utilities/preload.js'
import { StyledLoader } from './styles.js'


class Loader extends Component {
  constructor({ setView }) {
    super()

    // The preloader will do its best to load all the assets in a
    // given number of milliseconds and then will start the game 
    // without the missing assets. The list of missing assets will
    // have been logged in the console.
    preload(2000).then( result => result )
                 .catch( error => error )
                 .then( result => setView())
  }


  render() {
    return (
      <StyledLoader>
        <img src={Koji.config.basics.spinner} />
      </StyledLoader>
    )
  }
}

export default Loader
