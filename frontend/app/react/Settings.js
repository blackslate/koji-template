/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import { StyledSettings, StyledCloseButton } from './styles.js'


class Settings extends Component {
  constructor({ setView }) {
    super()
    this.close = setView
  }


  render() {
    return (
      <StyledSettings>
        Settings Go Here
        <StyledCloseButton
          onMouseUp={this.close}
        />
      </StyledSettings>
    )
  }
}

export default Settings
