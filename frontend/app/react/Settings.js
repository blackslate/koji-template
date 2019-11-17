/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
/* eslint-disable global-require */


import React, { Component } from 'react'
import Header from './Header.js'
import { StyledSettings } from './styles.js'


class Settings extends Component {
  constructor({ setView }) {
    super()
    this.setView = setView
  }


  render() {
    const settings = ""

    return (
      <StyledSettings>
        <Header
          text={Koji.config.settings.title}
          close={this.setView}
        />
        <ul>{settings}</ul>
      </StyledSettings>
    )
  }
}

export default Settings
